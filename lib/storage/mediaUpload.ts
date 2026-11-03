import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB limit to support HD video uploads

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'video/x-m4v': '.m4v',
};

export function validateMagicBytes(buffer: Buffer, declaredMime: string): boolean {
  if (buffer.length < 4) return false;

  if (declaredMime === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  if (declaredMime === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (declaredMime === 'image/gif') {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
  }

  if (declaredMime === 'image/webp') {
    return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }

  if (declaredMime === 'video/mp4' || declaredMime === 'video/x-m4v') {
    return buffer.length >= 8 && buffer.subarray(4, 8).toString('ascii') === 'ftyp';
  }

  if (declaredMime === 'video/webm') {
    return buffer.length >= 4 && buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3;
  }

  if (declaredMime === 'video/quicktime') {
    if (buffer.length < 8) return false;
    const atom = buffer.subarray(4, 8).toString('ascii');
    return ['ftyp', 'moov', 'mdat', 'wide', 'skip', 'pnot'].includes(atom);
  }

  return false;
}

export interface SaveMediaResult {
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
}

export interface StorageDriver {
  save(storageKey: string, buffer: Buffer, mimeType: string): Promise<string>;
  delete(storageKey: string): Promise<void>;
}

export class LocalStorageDriver implements StorageDriver {
  async save(storageKey: string, buffer: Buffer): Promise<string> {
    if (storageKey.includes('..') || path.isAbsolute(storageKey)) {
      throw new Error('Invalid path traversal detected in file storage operation');
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_DIR, path.basename(storageKey));
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
      throw new Error('Invalid path traversal detected in file storage operation');
    }

    await fs.writeFile(filePath, buffer);
    return `/uploads/${path.basename(storageKey)}`;
  }

  async delete(storageKey: string): Promise<void> {
    if (storageKey.includes('..') || path.isAbsolute(storageKey)) {
      throw new Error('Invalid path traversal detected in file delete operation');
    }

    const filePath = path.join(UPLOAD_DIR, path.basename(storageKey));
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
      throw new Error('Invalid path traversal detected in file delete operation');
    }
    try {
      await fs.unlink(filePath);
    } catch (err: unknown) {
      console.warn(`[STORAGE]: Unable to unlink local file ${filePath}:`, err);
    }
  }
}

export class S3StorageDriver implements StorageDriver {
  private bucket: string;
  private region: string;
  private localFallback: LocalStorageDriver;

  constructor(bucket?: string, region?: string) {
    this.bucket = bucket || process.env.S3_BUCKET_NAME || '';
    this.region = region || process.env.S3_REGION || 'us-east-1';
    this.localFallback = new LocalStorageDriver();
  }

  async save(storageKey: string, buffer: Buffer, mimeType: string): Promise<string> {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!this.bucket || !accessKeyId || !secretAccessKey) {
      console.warn('[STORAGE_S3]: S3 credentials incomplete. Falling back to local storage driver.');
      return this.localFallback.save(storageKey, buffer);
    }

    const endpoint = process.env.S3_ENDPOINT || `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
    return `${endpoint}/${storageKey}`;
  }

  async delete(storageKey: string): Promise<void> {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!this.bucket || !accessKeyId || !secretAccessKey) {
      return this.localFallback.delete(storageKey);
    }
  }
}

export function getStorageDriver(): StorageDriver {
  const provider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase().trim();
  if (provider === 's3') {
    return new S3StorageDriver();
  }
  return new LocalStorageDriver();
}

export async function saveMediaFile(
  fileBuffer: Buffer,
  originalName: string,
  declaredMime: string
): Promise<SaveMediaResult> {
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds maximum allowed limit of 100MB');
  }

  const safeExtension = ALLOWED_MIME_TYPES[declaredMime];
  if (!safeExtension) {
    throw new Error(`Forbidden file type: ${declaredMime}. Only JPEG, PNG, WEBP, GIF, MP4, and WEBM allowed.`);
  }

  const isValidHeader = validateMagicBytes(fileBuffer, declaredMime);
  if (!isValidHeader) {
    throw new Error('File content does not match declared MIME signature (Magic Bytes mismatch)');
  }

  const randomHash = crypto.randomBytes(8).toString('hex');
  const storageKey = `media_${Date.now()}_${randomHash}${safeExtension}`;

  const driver = getStorageDriver();
  const publicUrl = await driver.save(storageKey, fileBuffer, declaredMime);
  const sanitizedOriginalName = path.basename(originalName).replace(/[^a-zA-Z0-9_.-]/g, '_');

  return {
    filename: storageKey,
    originalFilename: sanitizedOriginalName,
    mimeType: declaredMime,
    size: fileBuffer.length,
    storageKey,
    url: publicUrl,
  };
}

export async function deleteMediaFile(storageKey: string): Promise<void> {
  const driver = getStorageDriver();
  await driver.delete(storageKey);
}
