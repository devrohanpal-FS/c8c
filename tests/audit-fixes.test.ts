import { describe, it } from 'node:test';
import assert from 'node:assert';
import { reorderItemsSchema } from '../lib/validation';

describe('Audit Remediation Verification Suite', () => {
  describe('Reorder Items Schema Validation', () => {
    it('accepts valid reorder array of id and integer order', () => {
      const payload = {
        items: [
          { id: 'item-1', order: 0 },
          { id: 'item-2', order: 1 },
          { id: 'item-3', order: 2 },
        ],
      };
      const result = reorderItemsSchema.safeParse(payload);
      assert.strictEqual(result.success, true);
    });

    it('rejects empty items array', () => {
      const payload = { items: [] };
      const result = reorderItemsSchema.safeParse(payload);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues[0]?.message.includes('At least one item'));
      }
    });

    it('rejects items with missing id', () => {
      const payload = {
        items: [{ order: 1 }],
      };
      const result = reorderItemsSchema.safeParse(payload);
      assert.strictEqual(result.success, false);
    });

    it('rejects items with non-integer order', () => {
      const payload = {
        items: [{ id: 'item-1', order: 'first' }],
      };
      const result = reorderItemsSchema.safeParse(payload);
      assert.strictEqual(result.success, false);
    });

    it('rejects payload where items is not an array', () => {
      const payload = { items: 'invalid-shape' };
      const result = reorderItemsSchema.safeParse(payload);
      assert.strictEqual(result.success, false);
    });
  });

  describe('Next.js Security Config & CSP Directives', () => {
    it('defines security headers in next.config.js', async () => {
      const nextConfig = require('../next.config.js');
      assert.ok(nextConfig.headers, 'headers function must exist');
      const headerBlocks = await nextConfig.headers();
      const globalHeader = headerBlocks.find((h: any) => h.source === '/:path*');
      assert.ok(globalHeader, 'global /:path* header must exist');
      const csp = globalHeader.headers.find((h: any) => h.key === 'Content-Security-Policy');
      assert.ok(csp, 'CSP header must exist');
      assert.ok(csp.value.includes("base-uri 'self'"), 'CSP must include base-uri');
      assert.ok(csp.value.includes("form-action 'self'"), 'CSP must include form-action');
    });
  });
});
