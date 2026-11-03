import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateMagicBytes } from '../lib/storage/mediaUpload';
import { sanitizeLogDetails } from '../lib/audit/index';
import { seoSchema } from '../lib/validation/index';

describe('Bucket 1: Security Hardening Verification Suite', () => {
  describe('Video Upload Magic Byte Signature Verification', () => {
    it('validates authentic MP4 with ftyp box signature at offset 4', () => {
      // 4 bytes box size (0x00 0x00 0x00 0x20) + 'ftyp' (0x66 0x74 0x79 0x70) + brand
      const mp4Buffer = Buffer.from([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]);
      const isValid = validateMagicBytes(mp4Buffer, 'video/mp4');
      assert.strictEqual(isValid, true);
    });

    it('rejects disguised HTML or script payload declared as video/mp4', () => {
      const maliciousHtml = Buffer.from('<script>alert("xss")</script>');
      const isValid = validateMagicBytes(maliciousHtml, 'video/mp4');
      assert.strictEqual(isValid, false);
    });

    it('validates authentic WebM with EBML header bytes (1A 45 DF A3)', () => {
      const webmBuffer = Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x9f, 0x42, 0x86, 0x81]);
      const isValid = validateMagicBytes(webmBuffer, 'video/webm');
      assert.strictEqual(isValid, true);
    });

    it('rejects disguised executable or text payload declared as video/webm', () => {
      const fakeWebm = Buffer.from('MZ\x90\x00\x03\x00\x00\x00ThisIsAnExecutable');
      const isValid = validateMagicBytes(fakeWebm, 'video/webm');
      assert.strictEqual(isValid, false);
    });

    it('validates authentic QuickTime MOV with recognized atom at offset 4', () => {
      // 4 bytes length + 'moov' atom
      const movBuffer = Buffer.from([0x00, 0x00, 0x01, 0x00, 0x6d, 0x6f, 0x6f, 0x76]);
      const isValid = validateMagicBytes(movBuffer, 'video/quicktime');
      assert.strictEqual(isValid, true);
    });

    it('rejects short buffer under 8 bytes for video signatures', () => {
      const shortBuffer = Buffer.from([0x00, 0x01, 0x02]);
      assert.strictEqual(validateMagicBytes(shortBuffer, 'video/mp4'), false);
      assert.strictEqual(validateMagicBytes(shortBuffer, 'video/quicktime'), false);
    });
  });

  describe('Recursive Audit Log Sensitive Key Sanitization', () => {
    it('recursively redacts nested credentials, tokens, secrets and passwords', () => {
      const input = {
        action: 'UPDATE_SETTINGS',
        adminId: 'usr-123',
        details: {
          database: {
            connectionSecret: 'super-secret-postgres-uri',
            apiKey: 'sk_live_123456789',
          },
          userProfile: {
            email: 'admin@cre8tivecove.com',
            newPassword: 'SuperStrongPassword!2026',
            nestedAuth: 'sensitive-auth-string',
            sessionInfo: {
              authToken: 'jwt-bearer-token-sample',
              sessionCookie: '__Secure-next-auth.session-token=secretval',
            },
          },
          tags: ['system', 'maintenance'],
        },
      };

      const sanitized = sanitizeLogDetails(input);
      assert.ok(sanitized);

      const d = sanitized.details as Record<string, any>;
      assert.strictEqual(d.database.connectionSecret, '[REDACTED]');
      assert.strictEqual(d.database.apiKey, '[REDACTED]');
      assert.strictEqual(d.userProfile.email, 'admin@cre8tivecove.com');
      assert.strictEqual(d.userProfile.newPassword, '[REDACTED]');
      assert.strictEqual(d.userProfile.nestedAuth, '[REDACTED]');
      assert.strictEqual(d.userProfile.sessionInfo.authToken, '[REDACTED]');
      assert.strictEqual(d.userProfile.sessionInfo.sessionCookie, '[REDACTED]');
      assert.deepStrictEqual(d.tags, ['system', 'maintenance']);
    });

    it('preserves legitimate business fields containing sensitive substrings such as keywords and author', () => {
      const input = {
        action: 'UPDATE_SEO_AND_CASE_STUDY',
        details: {
          keywords: 'design agency, branding, digital experiences',
          author: 'Rohan Pal',
          authorName: 'Rohan Pal',
          authority: 'Creative Director',
          meta: {
            keyword: 'branding',
            authors: ['Rohan Pal', 'Sanjeev'],
          },
          secretKey: 'top-secret-val',
          dbPassword: 'secret-password-123',
        },
      };

      const sanitized = sanitizeLogDetails(input);
      assert.ok(sanitized);

      const d = sanitized.details as Record<string, any>;
      assert.strictEqual(d.keywords, 'design agency, branding, digital experiences');
      assert.strictEqual(d.author, 'Rohan Pal');
      assert.strictEqual(d.authorName, 'Rohan Pal');
      assert.strictEqual(d.authority, 'Creative Director');
      assert.strictEqual(d.meta.keyword, 'branding');
      assert.deepStrictEqual(d.meta.authors, ['Rohan Pal', 'Sanjeev']);
      assert.strictEqual(d.secretKey, '[REDACTED]');
      assert.strictEqual(d.dbPassword, '[REDACTED]');
    });
  });

  describe('Admin SEO Server-Side Zod Schema Validation', () => {
    it('validates correct SEO payload with safe URLs', () => {
      const validPayload = {
        pageIdentifier: 'HOME',
        title: 'CRE8TIVECOVE — Creative & Digital Agency',
        description: 'Storytelling and high voltage design agency.',
        keywords: 'creative, agency, storytelling',
        ogTitle: 'CRE8TIVECOVE',
        ogDescription: 'Storytelling agency',
        ogImage: '/uploads/media_123.jpg',
        canonicalUrl: 'https://cre8tivecove.com',
        noIndex: false,
      };

      const result = seoSchema.safeParse(validPayload);
      assert.strictEqual(result.success, true);
    });

    it('rejects SEO payload with malicious javascript: URL scheme in ogImage', () => {
      const maliciousPayload = {
        pageIdentifier: 'WORK',
        title: 'Work Showcase',
        ogImage: 'javascript:alert(document.cookie)',
      };

      const result = seoSchema.safeParse(maliciousPayload);
      assert.strictEqual(result.success, false);
    });

    it('rejects SEO payload with missing pageIdentifier', () => {
      const invalidPayload = {
        title: 'No Identifier Page',
      };

      const result = seoSchema.safeParse(invalidPayload);
      assert.strictEqual(result.success, false);
    });

    it('rejects overly long title exceeding limits', () => {
      const invalidPayload = {
        pageIdentifier: 'SERVICES',
        title: 'A'.repeat(200),
      };

      const result = seoSchema.safeParse(invalidPayload);
      assert.strictEqual(result.success, false);
    });
  });
});
