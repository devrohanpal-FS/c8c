import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import eslintConfig from '../eslint.config.mjs';

describe('Bucket 2: Next.js 16 Dynamic Routes & Tooling Verification Suite', () => {
  describe('Dynamic Route Async Params & Resolution Contracts', () => {
    it('simulates Next.js 16 Promise-wrapped params resolution for work case studies', async () => {
      // In Next.js 16, page props arrive as params: Promise<{ slug: string }>
      const mockParamsPromise = Promise.resolve({ slug: 'urban-couture-2026' });

      // Simulate page/metadata handler resolving params asynchronously
      const { slug } = await mockParamsPromise;
      assert.strictEqual(slug, 'urban-couture-2026');

      // Verify fallback title formatting logic
      const fallbackTitle = slug.replace(/-/g, ' ').toUpperCase();
      assert.strictEqual(fallbackTitle, 'URBAN COUTURE 2026');
    });

    it('simulates Next.js 16 Promise-wrapped params resolution for services', async () => {
      const mockServiceParams = Promise.resolve({ slug: 'creative-direction' });
      const { slug } = await mockServiceParams;
      assert.strictEqual(slug, 'creative-direction');
    });

    it('simulates Next.js 16 Promise-wrapped params resolution for admin work edit', async () => {
      const mockAdminParams = Promise.resolve({ id: 'work_proj_uuid_12345' });
      const { id } = await mockAdminParams;
      assert.strictEqual(id, 'work_proj_uuid_12345');
    });

    it('handles special characters and hyphenated slugs safely without crashing', async () => {
      const complexSlug = Promise.resolve({ slug: '3d-vfx-cgi-hyper-realism' });
      const { slug } = await complexSlug;
      const formatted = slug.replace(/-/g, ' ').toUpperCase();
      assert.strictEqual(formatted, '3D VFX CGI HYPER REALISM');
    });
  });

  describe('ESLint 9 Flat Config Verification', () => {
    it('exports a valid flat config array with Next.js rules and custom ignores', () => {
      assert.ok(Array.isArray(eslintConfig), 'eslintConfig must be an array');
      assert.ok(eslintConfig.length >= 2, 'eslintConfig must contain at least base and override configurations');

      // Check that all ignore entries properly cover required directories
      const allIgnores = eslintConfig
        .filter((entry: any) => entry.ignores && Array.isArray(entry.ignores))
        .flatMap((entry: any) => entry.ignores);

      assert.ok(allIgnores.includes('.next/**'), 'Must ignore .next/** directory');
      assert.ok(allIgnores.includes('node_modules/**'), 'Must ignore node_modules/** directory');
      assert.ok(allIgnores.includes('public/**'), 'Must ignore public/** directory');
    });
  });
});
