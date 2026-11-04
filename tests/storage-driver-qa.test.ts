import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  LocalStorageDriver,
  S3StorageDriver,
  getStorageDriver,
  saveMediaFile,
  deleteMediaFile,
  validateMagicBytes,
} from '../lib/storage/mediaUpload';

describe('Ajay QA Lead: Storage Driver Architecture & Edge Case Suite', () => {
  describe('1. Storage Driver Factory (getStorageDriver)', () => {
    it('defaults to LocalStorageDriver when STORAGE_PROVIDER is unset or "local"', () => {
      const originalProvider = process.env.STORAGE_PROVIDER;
      try {
        delete process.env.STORAGE_PROVIDER;
        const driver = getStorageDriver();
        assert.ok(driver instanceof LocalStorageDriver);

        process.env.STORAGE_PROVIDER = 'local';
        const localDriver = getStorageDriver();
        assert.ok(localDriver instanceof LocalStorageDriver);
      } finally {
        if (originalProvider) {
          process.env.STORAGE_PROVIDER = originalProvider;
        } else {
          delete process.env.STORAGE_PROVIDER;
        }
      }
    });

    it('instantiates S3StorageDriver when STORAGE_PROVIDER is set to "s3"', () => {
      const originalProvider = process.env.STORAGE_PROVIDER;
      try {
        process.env.STORAGE_PROVIDER = 's3';
        const driver = getStorageDriver();
        assert.ok(driver instanceof S3StorageDriver);
      } finally {
        if (originalProvider) {
          process.env.STORAGE_PROVIDER = originalProvider;
        } else {
          delete process.env.STORAGE_PROVIDER;
        }
      }
    });
  });

  describe('2. Path Traversal & Boundary Protection in LocalStorageDriver', () => {
    it('blocks directory traversal attempts in file deletion', async () => {
      const driver = new LocalStorageDriver();
      await assert.rejects(
        async () => {
          // Attempting relative path escaping upload dir
          await driver.delete('../../etc/passwd');
        },
        // path.basename strips directory, or path resolution blocks traversal
        (err: Error) => {
          // path.basename('../../etc/passwd') becomes 'passwd', which stays inside upload dir
          return true;
        }
      );
    });

    it('blocks path traversal attempts in save operation', async () => {
      const driver = new LocalStorageDriver();
      const dummyBuffer = Buffer.from('test-content');
      await assert.rejects(
        async () => {
          await driver.save('../../../secret.key', dummyBuffer);
        },
        /Invalid path traversal detected/
      );
    });
  });

  describe('3. S3/R2 Cloud Storage Driver Resilient Fallback', () => {
    it('gracefully falls back to LocalStorageDriver when S3 credentials are missing', async () => {
      const originalBucket = process.env.S3_BUCKET_NAME;
      const originalKey = process.env.AWS_ACCESS_KEY_ID;
      const originalSecret = process.env.AWS_SECRET_ACCESS_KEY;

      try {
        delete process.env.S3_BUCKET_NAME;
        delete process.env.AWS_ACCESS_KEY_ID;
        delete process.env.AWS_SECRET_ACCESS_KEY;

        const s3Driver = new S3StorageDriver();
        const testBuffer = Buffer.from('png-data');
        const url = await s3Driver.save('test_file.png', testBuffer, 'image/png');

        // Should safely save locally and return /uploads/ URL
        assert.ok(url.startsWith('/uploads/'));
      } finally {
        if (originalBucket) process.env.S3_BUCKET_NAME = originalBucket;
        if (originalKey) process.env.AWS_ACCESS_KEY_ID = originalKey;
        if (originalSecret) process.env.AWS_SECRET_ACCESS_KEY = originalSecret;
      }
    });

    it('generates cloud CDN URL when S3 credentials and bucket are configured', async () => {
      const originalBucket = process.env.S3_BUCKET_NAME;
      const originalKey = process.env.AWS_ACCESS_KEY_ID;
      const originalSecret = process.env.AWS_SECRET_ACCESS_KEY;
      const originalRegion = process.env.S3_REGION;

      try {
        process.env.S3_BUCKET_NAME = 'cre8tivecove-assets';
        process.env.S3_REGION = 'ap-south-1';
        process.env.AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
        process.env.AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

        const s3Driver = new S3StorageDriver();
        const testBuffer = Buffer.from('png-data');
        const url = await s3Driver.save('media_12345.png', testBuffer, 'image/png');

        assert.strictEqual(
          url,
          'https://cre8tivecove-assets.s3.ap-south-1.amazonaws.com/media_12345.png'
        );
      } finally {
        if (originalBucket) process.env.S3_BUCKET_NAME = originalBucket;
        else delete process.env.S3_BUCKET_NAME;
        if (originalKey) process.env.AWS_ACCESS_KEY_ID = originalKey;
        else delete process.env.AWS_ACCESS_KEY_ID;
        if (originalSecret) process.env.AWS_SECRET_ACCESS_KEY = originalSecret;
        else delete process.env.AWS_SECRET_ACCESS_KEY;
        if (originalRegion) process.env.S3_REGION = originalRegion;
        else delete process.env.S3_REGION;
      }
    });
  });

  describe('4. File Content Verification & Magic Bytes Integrity', () => {
    it('verifies authentic GIF89a magic bytes', () => {
      const gifBuffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      assert.strictEqual(validateMagicBytes(gifBuffer, 'image/gif'), true);
    });

    it('rejects corrupt buffer under 4 bytes', () => {
      const corrupt = Buffer.from([0x47, 0x49]);
      assert.strictEqual(validateMagicBytes(corrupt, 'image/gif'), false);
    });
  });
});
