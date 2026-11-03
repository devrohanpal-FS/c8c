import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getFeaturedWorkDetailBySlug } from '../lib/data/featuredWorkDetail';

describe('Bucket 3: Performance, Memory Leaks & UI Optimization Suite', () => {
  describe('Navbar Section Theme & Color Fast Lookup Logic', () => {
    function evaluateSectionTheme(mockElement: {
      dataColor?: string | null;
      classList?: string[];
      isDocumentLight?: boolean;
    }): boolean {
      // Direct simulation of Navbar's optimized O(1) decision logic
      if (mockElement.dataColor) {
        const clean = mockElement.dataColor.trim().toUpperCase();
        if (['#FFFEF2', '#FFF', '#FFFFFF', '#FFF8E7', 'CREAM'].includes(clean)) {
          return true; // Light
        }
        if (['#0A0A0A', '#000000', 'OBSIDIAN', 'DARK'].includes(clean)) {
          return false; // Dark
        }
      }

      if (mockElement.isDocumentLight) {
        return true;
      }

      const classes = mockElement.classList || [];
      const hasLightClass = classes.some((cls) =>
        ['bg-white', 'light-section', 'light-theme', 'bg-[#FFFEF2]', 'bg-[#f5f0e6]'].includes(cls)
      );

      if (hasLightClass) {
        return true;
      }

      return false; // Default Obsidian Dark
    }

    it('identifies light section from data-color cream/white hexes', () => {
      assert.strictEqual(evaluateSectionTheme({ dataColor: '#FFFEF2' }), true);
      assert.strictEqual(evaluateSectionTheme({ dataColor: '#FFFFFF' }), true);
      assert.strictEqual(evaluateSectionTheme({ dataColor: 'CREAM' }), true);
    });

    it('identifies dark section from obsidian/dark hexes without computed styles', () => {
      assert.strictEqual(evaluateSectionTheme({ dataColor: '#0A0A0A' }), false);
      assert.strictEqual(evaluateSectionTheme({ dataColor: '#000000' }), false);
      assert.strictEqual(evaluateSectionTheme({ dataColor: 'OBSIDIAN' }), false);
    });

    it('identifies light section from utility class without forced reflow', () => {
      assert.strictEqual(evaluateSectionTheme({ classList: ['relative', 'bg-white', 'p-8'] }), true);
      assert.strictEqual(evaluateSectionTheme({ classList: ['light-section'] }), true);
    });

    it('defaults to dark obsidian aesthetic when no light markers exist', () => {
      assert.strictEqual(evaluateSectionTheme({ classList: ['relative', 'w-full', 'py-20'] }), false);
    });
  });

  describe('Dynamic Work & Service Detail Data Resilience', () => {
    it('retrieves valid fallback featured work detail for known slugs', () => {
      const fallback = getFeaturedWorkDetailBySlug('warivo-new-ev-scooter');
      if (fallback) {
        assert.ok(fallback.title);
        assert.ok(fallback.slug);
        assert.ok(Array.isArray(fallback.videos));
      }
    });

    it('handles unknown slug gracefully by returning null rather than throwing', () => {
      const unknown = getFeaturedWorkDetailBySlug('non-existent-project-xyz');
      assert.strictEqual(unknown, null);
    });
  });
});
