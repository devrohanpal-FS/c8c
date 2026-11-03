import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validatePublicEnvSafety, getNextAuthSecret } from '../lib/env';
import { getSafeRedirectUrl, sanitizeInputString, validatePasswordStrength } from '../lib/security';
import { reorderItemsSchema, seoSchema } from '../lib/validation';
import { validateMagicBytes } from '../lib/storage/mediaUpload';
import { canManageUsers, canViewAuditLogs, canManageSettings, canManageContent } from '../lib/permissions';

describe('Ajay QA Lead: Deep Quality Assurance & Boundary Verification Suite', () => {
  describe('1. Environment & Public Variable Leakage Prevention', () => {
    it('passes environment safety when no dangerous NEXT_PUBLIC_ variables exist', () => {
      assert.doesNotThrow(() => {
        validatePublicEnvSafety();
      });
    });

    it('strictly throws when NEXTAUTH_SECRET is undefined or placeholder', () => {
      const original = process.env.NEXTAUTH_SECRET;
      try {
        delete process.env.NEXTAUTH_SECRET;
        assert.throws(() => getNextAuthSecret(), /NEXTAUTH_SECRET is not defined/);

        process.env.NEXTAUTH_SECRET = 'CHANGE_ME_INSECURE_SECRET_TOO_SHORT';
        assert.throws(() => getNextAuthSecret(), /unconfigured placeholder value/);

        process.env.NEXTAUTH_SECRET = 'short';
        assert.throws(() => getNextAuthSecret(), /must be at least 32 characters long/);
      } finally {
        if (original) {
          process.env.NEXTAUTH_SECRET = original;
        } else {
          delete process.env.NEXTAUTH_SECRET;
        }
      }
    });

    it('retrieves configured NEXTAUTH_SECRET when valid minimum 32 chars provided', () => {
      const original = process.env.NEXTAUTH_SECRET;
      try {
        const validSecret = 'super-secure-production-random-token-32-chars-long';
        process.env.NEXTAUTH_SECRET = validSecret;
        const retrieved = getNextAuthSecret();
        assert.strictEqual(retrieved, validSecret);
      } finally {
        if (original) {
          process.env.NEXTAUTH_SECRET = original;
        } else {
          delete process.env.NEXTAUTH_SECRET;
        }
      }
    });
  });

  describe('2. Open Redirect & Malicious URI Boundary Defense', () => {
    it('rejects protocol-relative double-slash URLs (//attacker.com)', () => {
      const url = getSafeRedirectUrl('//attacker.com', '/admin/dashboard');
      assert.strictEqual(url, '/admin/dashboard');
    });

    it('rejects URLs containing backslashes (\\attacker.com)', () => {
      const url = getSafeRedirectUrl('/\\attacker.com', '/admin/dashboard');
      assert.strictEqual(url, '/admin/dashboard');
    });

    it('rejects javascript: and data: pseudo-schemes in redirects', () => {
      const url1 = getSafeRedirectUrl('javascript:alert(1)', '/admin/dashboard');
      assert.strictEqual(url1, '/admin/dashboard');

      const url2 = getSafeRedirectUrl('data:text/html,<script>alert(1)</script>', '/admin/dashboard');
      assert.strictEqual(url2, '/admin/dashboard');
    });

    it('accepts legitimate deep administrative and public internal relative paths', () => {
      assert.strictEqual(getSafeRedirectUrl('/admin/work/edit?id=123'), '/admin/work/edit?id=123');
      assert.strictEqual(getSafeRedirectUrl('/work/tvc-sbi-foreign-card'), '/work/tvc-sbi-foreign-card');
    });
  });

  describe('3. XSS Neutralization & Entity Encoding Boundaries', () => {
    it('neutralizes complex nested script and event vectors', () => {
      const dirty = '<IMG SRC="jav&#x0A;ascript:alert(\'XSS\');" onerror="alert(1)">';
      const clean = sanitizeInputString(dirty);
      assert.strictEqual(clean.includes('onerror='), false);
      assert.strictEqual(clean.includes('<IMG'), false);
    });

    it('escapes quotes and angle brackets in search and text queries', () => {
      const dirty = `"><script>alert(document.cookie)</script>`;
      const clean = sanitizeInputString(dirty);
      assert.strictEqual(clean.includes('<script>'), false);
      assert.ok(clean.includes('&quot;&gt;'));
    });
  });

  describe('4. File Magic Bytes Verification Edge Cases', () => {
    it('rejects text buffer disguised with an .mp4 MIME declaration', () => {
      const fakeBuffer = Buffer.from('<!DOCTYPE html><html><body>malicious</body></html>');
      const isValid = validateMagicBytes(fakeBuffer, 'video/mp4');
      assert.strictEqual(isValid, false);
    });

    it('validates authentic QuickTime MOV with recognized moov atom', () => {
      const movBuffer = Buffer.alloc(16);
      movBuffer.write('moov', 4, 'ascii');
      const isValid = validateMagicBytes(movBuffer, 'video/quicktime');
      assert.strictEqual(isValid, true);
    });
  });

  describe('5. RBAC Tier Hierarchy & Least Privilege Boundaries', () => {
    it('strictly confines system settings access to SUPER_ADMIN', () => {
      assert.strictEqual(canManageSettings('SUPER_ADMIN'), true);
      assert.strictEqual(canManageSettings('ADMIN'), false);
      assert.strictEqual(canManageSettings('EDITOR'), false);
      assert.strictEqual(canManageSettings('VIEWER'), false);
      assert.strictEqual(canManageSettings('UNKNOWN'), false);
    });

    it('allows SUPER_ADMIN and ADMIN to manage users, blocking lower tiers', () => {
      assert.strictEqual(canManageUsers('SUPER_ADMIN'), true);
      assert.strictEqual(canManageUsers('ADMIN'), true);
      assert.strictEqual(canManageUsers('EDITOR'), false);
      assert.strictEqual(canManageUsers('VIEWER'), false);
    });

    it('allows content management to EDITOR and above, strictly blocking VIEWER', () => {
      assert.strictEqual(canManageContent('SUPER_ADMIN'), true);
      assert.strictEqual(canManageContent('ADMIN'), true);
      assert.strictEqual(canManageContent('EDITOR'), true);
      assert.strictEqual(canManageContent('VIEWER'), false);
    });
  });

  describe('6. Reorder & SEO Zod Validation Stress Tests', () => {
    it('rejects reorder payload with floating point orders', () => {
      const payload = {
        items: [{ id: 'item-1', order: 1.5 }],
      };
      const result = reorderItemsSchema.safeParse(payload);
      assert.strictEqual(result.success, false);
    });

    it('rejects SEO schema with dangerous ogImage URL scheme', () => {
      const payload = {
        pageIdentifier: 'HOME',
        title: 'Home Page',
        ogImage: 'javascript:alert(1)',
      };
      const result = seoSchema.safeParse(payload);
      assert.strictEqual(result.success, false);
    });
  });

  describe('7. Edge Middleware & Admin Route Guard Verification', () => {
    it('configures matcher covering all /admin paths', async () => {
      const middlewareModule = await import('../middleware');
      assert.ok(middlewareModule.config);
      assert.deepStrictEqual(middlewareModule.config.matcher, ['/admin/:path*']);
      assert.strictEqual(typeof middlewareModule.middleware, 'function');
    });

    it('redirects unauthenticated admin navigation to login with encoded callbackUrl', async () => {
      const { middleware } = await import('../middleware');
      const req = {
        nextUrl: {
          pathname: '/admin/dashboard',
        },
        url: 'http://localhost:3000/admin/dashboard',
        cookies: {
          get: () => undefined,
        },
        headers: new Headers(),
      } as any;

      const response = await middleware(req);
      assert.ok(response);
      assert.strictEqual(response.status, 307);
      const location = response.headers.get('location');
      assert.ok(location?.includes('/admin/login'));
      assert.ok(location?.includes('callbackUrl=%2Fadmin%2Fdashboard'));
    });

    it('allows direct access to /admin/login without redirect loop', async () => {
      const { middleware } = await import('../middleware');
      const req = {
        nextUrl: {
          pathname: '/admin/login',
        },
        url: 'http://localhost:3000/admin/login',
        cookies: {
          get: () => undefined,
        },
        headers: new Headers(),
      } as any;

      const response = await middleware(req);
      assert.ok(response);
      // Next.next() has status 200 and no redirect header
      assert.strictEqual(response.headers.get('location'), null);
    });
  });
});
