import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../lib/db';
import {
  getPublishedHome,
  getPublishedAbout,
  getPublishedServices,
  getPublishedServiceBySlug,
  getPublishedWork,
  getPublishedWorkBySlug,
} from '../lib/services/publicContentService';
import {
  contactSubmissionSchema,
} from '../lib/validation';
import {
  validatePasswordStrength,
  sanitizeInputString,
  getSafeRedirectUrl,
} from '../lib/security';
import { rateLimit } from '../lib/rate-limit';
import { LocalStorageDriver } from '../lib/storage/mediaUpload';
import { sanitizeLogDetails } from '../lib/audit';

describe('Ajay QA Lead — Master Quality Assurance & Full-Stack Verification Suite', () => {

  describe('1. Dynamic CMS & Public Data Retrieval (Zero Static Data)', () => {
    it('retrieves live site settings from database', async () => {
      const settings = await prisma.siteSettings.findFirst();
      assert.ok(settings, 'Site settings must exist in database');
      assert.strictEqual(typeof settings.siteName, 'string');
      assert.ok(settings.siteName.length > 0);
    });

    it('retrieves published homepage content and dynamic culture collage', async () => {
      const home = await getPublishedHome();
      assert.ok(home, 'Home page content must resolve');
      assert.ok(home.heroTitle, 'Hero title must be present');
      assert.ok(Array.isArray(home.collage), 'Collage must be an array');
    });

    it('retrieves published about page content with dynamic accreditations', async () => {
      const about = await getPublishedAbout();
      assert.ok(about, 'About page content must resolve');
      assert.ok(about.missionTitle, 'Mission title must be present');
      assert.ok(Array.isArray(about.credentials), 'Credentials must be dynamic array');
      assert.ok(Array.isArray(about.certifications), 'Certifications must be dynamic array');
    });

    it('retrieves creative and technology services dynamically from database', async () => {
      const allServices = await getPublishedServices('ALL');
      assert.ok(Array.isArray(allServices));
      assert.ok(allServices.length > 0, 'Database must contain active services');

      const creativeServices = await getPublishedServices('CREATIVE');
      assert.ok(creativeServices.every((s) => s.category === 'CREATIVE'));

      const techServices = await getPublishedServices('TECHNOLOGY');
      assert.ok(techServices.every((s) => s.category === 'TECHNOLOGY'));
    });

    it('retrieves published works with nested gallery relations', async () => {
      const works = await getPublishedWork();
      assert.ok(Array.isArray(works));

      if (works.length > 0) {
        const firstWork = works[0];
        assert.ok(firstWork.slug);
        assert.ok(firstWork.title);

        const detailedWork = await getPublishedWorkBySlug(firstWork.slug);
        assert.ok(detailedWork);
        assert.strictEqual(detailedWork.id, firstWork.id);
        assert.ok(Array.isArray(detailedWork.gallery), 'Gallery must be loaded as array');
      }
    });

    it('returns null gracefully for non-existent work or service slugs', async () => {
      const nonExistentWork = await getPublishedWorkBySlug('definitely-not-a-real-slug-12345');
      assert.strictEqual(nonExistentWork, null);

      const nonExistentService = await getPublishedServiceBySlug('definitely-not-a-real-service-slug-12345');
      assert.strictEqual(nonExistentService, null);
    });
  });

  describe('2. Backend CRUD Operations Lifecycle Integrity', () => {
    it('CRUD: executes full lifecycle on portfolio Work entity (Create, Update, Soft-Delete, Hard-Delete)', async () => {
      const uniqueSlug = `qa-master-work-${Date.now()}`;
      // 1. Create
      const created = await prisma.work.create({
        data: {
          title: 'QA Master Test Project',
          slug: uniqueSlug,
          client: 'QA Enterprise Corp',
          category: 'Commercial Direction',
          year: '2026',
          description: 'Created during Ajay QA Lead full-stack verification.',
          status: 'DRAFT',
          featured: false,
        },
      });
      assert.ok(created.id);
      const testWorkId = created.id;

      // 2. Update
      const updated = await prisma.work.update({
        where: { id: testWorkId },
        data: {
          title: 'QA Master Test Project (Updated)',
          status: 'PUBLISHED',
        },
      });
      assert.strictEqual(updated.title, 'QA Master Test Project (Updated)');
      assert.strictEqual(updated.status, 'PUBLISHED');

      // 3. Soft-Delete
      await prisma.work.update({
        where: { id: testWorkId },
        data: { deletedAt: new Date() },
      });

      const publicWorks = await getPublishedWork();
      const foundInPublic = publicWorks.find((w) => w.id === testWorkId);
      assert.strictEqual(foundInPublic, undefined, 'Soft-deleted work must not appear in public query results');

      // 4. Clean up / Permanent Delete
      await prisma.work.delete({ where: { id: testWorkId } });
      const verifyPurged = await prisma.work.findUnique({ where: { id: testWorkId } });
      assert.strictEqual(verifyPurged, null);
    });

    it('CRUD: executes full lifecycle on Service entity (Create, Update, Delete)', async () => {
      const uniqueSlug = `qa-service-${Date.now()}`;
      const created = await prisma.service.create({
        data: {
          title: 'QA Cloud Architecture Service',
          slug: uniqueSlug,
          description: 'Automated test service description',
          category: 'TECHNOLOGY',
          active: true,
          status: 'PUBLISHED',
        },
      });
      assert.ok(created.id);

      const updated = await prisma.service.update({
        where: { id: created.id },
        data: { description: 'Updated test description' },
      });
      assert.strictEqual(updated.description, 'Updated test description');

      await prisma.service.delete({ where: { id: created.id } });
      const verifyDeleted = await prisma.service.findUnique({ where: { id: created.id } });
      assert.strictEqual(verifyDeleted, null);
    });

    it('CRUD: executes full lifecycle on Client logo entity', async () => {
      const uniqueSlug = `qa-client-${Date.now()}`;
      const created = await prisma.client.create({
        data: {
          name: 'QA Global Enterprise',
          slug: uniqueSlug,
          website: 'https://example.com/qa',
          active: true,
        },
      });
      assert.ok(created.id);

      await prisma.client.delete({ where: { id: created.id } });
      const verifyDeleted = await prisma.client.findUnique({ where: { id: created.id } });
      assert.strictEqual(verifyDeleted, null);
    });

    it('CRUD: enforces database unique constraint on duplicate slugs', async () => {
      const first = await prisma.service.create({
        data: {
          title: 'Duplicate Slug Test',
          slug: 'unique-constraint-slug-test',
          description: 'Testing unique slug constraint',
        },
      });

      await assert.rejects(
        async () => {
          await prisma.service.create({
            data: {
              title: 'Duplicate Slug Test 2',
              slug: 'unique-constraint-slug-test',
              description: 'This must throw unique constraint violation',
            },
          });
        },
        /Unique constraint failed/
      );

      await prisma.service.delete({ where: { id: first.id } });
    });
  });

  describe('3. Input Validation, Honeypot & Anti-Spam Defense', () => {
    it('accepts valid contact inquiry payloads', () => {
      const validPayload = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        businessName: 'Acme Corp',
        budget: '$25k - $50k',
        helpDetails: 'We want to produce a commercial video reel with your studio.',
        consentGiven: true,
      };
      const result = contactSubmissionSchema.safeParse(validPayload);
      assert.strictEqual(result.success, true);
    });

    it('rejects contact payload when consent is missing', () => {
      const noConsent = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        helpDetails: 'We want to produce a commercial video reel.',
      };
      const result = contactSubmissionSchema.safeParse(noConsent);
      assert.strictEqual(result.success, false);
    });

    it('rejects contact payload with invalid email address format', () => {
      const invalidEmail = {
        name: 'Jane Doe',
        email: 'not-a-valid-email',
        helpDetails: 'Hello there, please call me back.',
        consentGiven: true,
      };
      const result = contactSubmissionSchema.safeParse(invalidEmail);
      assert.strictEqual(result.success, false);
    });

    it('rejects contact payload with short message under threshold', () => {
      const emptyMsg = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        helpDetails: 'Hey',
        consentGiven: true,
      };
      const result = contactSubmissionSchema.safeParse(emptyMsg);
      assert.strictEqual(result.success, false);
    });

    it('rejects oversized message exceeding denial-of-service length threshold', () => {
      const massiveMsg = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        helpDetails: 'A'.repeat(4001),
        consentGiven: true,
      };
      const result = contactSubmissionSchema.safeParse(massiveMsg);
      assert.strictEqual(result.success, false);
    });

    it('sanitizes malicious script and iframe injections from text input', () => {
      const malicious = '<script>alert("xss")</script><iframe src="javascript:alert(1)">Hello World</iframe>';
      const clean = sanitizeInputString(malicious);
      assert.strictEqual(clean.includes('<script>'), false);
      assert.strictEqual(clean.includes('<iframe'), false);
      assert.strictEqual(clean.includes('javascript:'), false);
    });

    it('neutralizes dangerous pseudo-protocol schemes and open redirects', () => {
      assert.strictEqual(getSafeRedirectUrl('javascript:alert(document.cookie)'), '/admin/dashboard');
      assert.strictEqual(getSafeRedirectUrl('https://evil-attacker.com/login'), '/admin/dashboard');
      assert.strictEqual(getSafeRedirectUrl('//malicious-domain.com'), '/admin/dashboard');
      assert.strictEqual(getSafeRedirectUrl('/admin/work'), '/admin/work');
    });
  });

  describe('4. Rate Limiting & Abuse Prevention', () => {
    it('allows requests below threshold and blocks excessive traffic with 429 logic', () => {
      const testKey = 'qa-client-ip-test';
      // First 5 requests should pass
      for (let i = 0; i < 5; i++) {
        const allowed = rateLimit(testKey, 5, 60000);
        assert.strictEqual(allowed.success, true);
      }
      // 6th request within window must be rate limited
      const blocked = rateLimit(testKey, 5, 60000);
      assert.strictEqual(blocked.success, false);
      assert.strictEqual(blocked.remaining, 0);
    });
  });

  describe('5. Storage Driver & Path Traversal Boundaries', () => {
    it('LocalStorageDriver strictly forbids directory traversal on file deletion', async () => {
      const driver = new LocalStorageDriver();
      await assert.rejects(
        async () => {
          await driver.delete('../../etc/passwd');
        },
        /Invalid path traversal/
      );
    });

    it('LocalStorageDriver strictly forbids absolute path escape on save', async () => {
      const driver = new LocalStorageDriver();
      await assert.rejects(
        async () => {
          await driver.save('/etc/shadow', Buffer.from('malicious'));
        },
        /Invalid path traversal/
      );
    });
  });

  describe('6. Sensitive Audit Log Sanitization & Redaction', () => {
    it('recursively scrubs secrets, passwords, tokens and credentials from audit metadata', () => {
      const rawMetadata = {
        userId: 'admin-1',
        password: 'SuperSecretPassword123!',
        nextAuthToken: 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        nested: {
          clientSecret: 'secret_live_998877',
          author: 'Sanjeev Security Lead',
          deep: {
            apiKey: 'key_12345',
            safeNote: 'All systems operational',
          },
        },
      };

      const sanitized = sanitizeLogDetails(rawMetadata) as Record<string, unknown>;
      assert.ok(sanitized);
      assert.strictEqual(sanitized.password, '[REDACTED]');
      assert.strictEqual(sanitized.nextAuthToken, '[REDACTED]');
      const nested = sanitized.nested as Record<string, unknown>;
      assert.strictEqual(nested.clientSecret, '[REDACTED]');
      const deep = nested.deep as Record<string, unknown>;
      assert.strictEqual(deep.apiKey, '[REDACTED]');
      // Legitimate business text must be preserved
      assert.strictEqual(nested.author, 'Sanjeev Security Lead');
      assert.strictEqual(deep.safeNote, 'All systems operational');
    });
  });

  describe('7. Password Complexity & Policy Enforcement', () => {
    it('rejects passwords shorter than 8 characters', () => {
      assert.throws(
        () => validatePasswordStrength('Pass1!'),
        /Password must be at least 8 characters/
      );
    });

    it('rejects common insecure dictionary passwords', () => {
      assert.throws(
        () => validatePasswordStrength('password123'),
        /Password is too common/
      );
      assert.throws(
        () => validatePasswordStrength('admin123'),
        /Password is too common/
      );
    });

    it('accepts strong production-grade passwords', () => {
      const r1 = validatePasswordStrength('C8C@Security2026!');
      assert.strictEqual(r1.valid, true);

      const r2 = validatePasswordStrength('Admin@123456');
      assert.strictEqual(r2.valid, true);
    });
  });
});
