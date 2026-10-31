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


  if (
    declaredMime === 'video/mp4' ||
    declaredMime === 'video/webm' ||
    declaredMime === 'video/quicktime' ||
    declaredMime === 'video/x-m4v'
  ) {
    return true;
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

export async function saveMediaFile(
  fileBuffer: Buffer,
  originalName: string,
  declaredMime: string
): Promise<SaveMediaResult> {
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds maximum allowed limit of 25MB');
  }

  const safeExtension = ALLOWED_MIME_TYPES[declaredMime];
  if (!safeExtension) {
    throw new Error(`Forbidden file type: ${declaredMime}. Only JPEG, PNG, WEBP, GIF, MP4, and WEBM allowed.`);
  }

  const isValidHeader = validateMagicBytes(fileBuffer, declaredMime);
  if (!isValidHeader) {
    throw new Error('File content does not match declared MIME signature (Magic Bytes mismatch)');
  }


  await fs.mkdir(UPLOAD_DIR, { recursive: true });


  const randomHash = crypto.randomBytes(8).toString('hex');
  const storageKey = `media_${Date.now()}_${randomHash}${safeExtension}`;
  const filePath = path.join(UPLOAD_DIR, storageKey);


  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
    throw new Error('Invalid path traversal detected in file storage operation');
  }

  await fs.writeFile(filePath, fileBuffer);

  const publicUrl = `/uploads/${storageKey}`;
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
  const filePath = path.join(UPLOAD_DIR, path.basename(storageKey));
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
    throw new Error('Invalid path traversal detected in file delete operation');
  }
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.warn(`[STORAGE]: Unable to unlink file ${filePath}:`, err);
  }
}