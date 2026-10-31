import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeInputString,
  sanitizePayload,
  getSafeRedirectUrl,
  validatePasswordStrength,
  hashPassword,
  verifyPassword,
} from '../lib/security/index';

describe('Security & XSS Defense Suite', () => {
  it('neutralizes script tags and inline scripts', () => {
    const malicious = '<script>alert("xss")</script>Hello World';
    const sanitized = sanitizeInputString(malicious);
    assert.strictEqual(sanitized.includes('<script>'), false);
    assert.strictEqual(sanitized.includes('</script>'), false);
    assert.strictEqual(sanitized, 'Hello World');
  });

  it('neutralizes iframe injection vectors', () => {
    const malicious = '<iframe src="https://evil.com"></iframe>Safe Content';
    const sanitized = sanitizeInputString(malicious);
    assert.strictEqual(sanitized.includes('<iframe'), false);
    assert.strictEqual(sanitized, 'Safe Content');
  });

  it('neutralizes inline event handlers (onclick, onerror, onload)', () => {
    const malicious = '<img src=x onerror="alert(1)" onload="evil()">';
    const sanitized = sanitizeInputString(malicious);
    assert.strictEqual(sanitized.includes('onerror'), false);
    assert.strictEqual(sanitized.includes('onload'), false);
  });

  it('neutralizes javascript: and data: pseudo-protocol schemes', () => {
    const malicious = 'javascript:alert(document.cookie)';
    const sanitized = sanitizeInputString(malicious);
    assert.strictEqual(sanitized.includes('javascript:'), false);
    assert.strictEqual(sanitized.includes('blocked:'), true);
  });

  it('escapes dangerous HTML entities', () => {
    const input = 'Creative & Bold <"Quotes">';
    const sanitized = sanitizeInputString(input);
    assert.strictEqual(sanitized.includes('&amp;'), true);
    assert.strictEqual(sanitized.includes('&lt;'), true);
    assert.strictEqual(sanitized.includes('&gt;'), true);
    assert.strictEqual(sanitized.includes('&quot;'), true);
  });

  it('recursively sanitizes nested payloads without altering passwords', () => {
    const payload = {
      name: '<script>evil()</script>John Doe',
      email: 'john@example.com',
      password: 'My$ecurePassword123!',
      metadata: {
        bio: 'Hello <iframe src=x></iframe>World',
      },
    };

    const sanitized = sanitizePayload(payload);
    assert.strictEqual(sanitized.name, 'John Doe');
    assert.strictEqual(sanitized.password, 'My$ecurePassword123!');
    assert.strictEqual(sanitized.metadata.bio, 'Hello World');
  });
});

describe('Open Redirect Defense Suite', () => {
  it('blocks protocol-relative URLs (//evil.com)', () => {
    const safe = getSafeRedirectUrl('//evil.com', '/admin/dashboard');
    assert.strictEqual(safe, '/admin/dashboard');
  });

  it('blocks absolute external URLs (https://evil.com)', () => {
    const safe = getSafeRedirectUrl('https://evil.com', '/admin/dashboard');
    assert.strictEqual(safe, '/admin/dashboard');
  });

  it('blocks javascript: targets', () => {
    const safe = getSafeRedirectUrl('javascript:alert(1)', '/admin/dashboard');
    assert.strictEqual(safe, '/admin/dashboard');
  });

  it('allows valid relative internal paths', () => {
    const safe = getSafeRedirectUrl('/admin/work', '/admin/dashboard');
    assert.strictEqual(safe, '/admin/work');
  });
});

describe('Password Policy & Hashing Suite', () => {
  it('rejects short passwords under 8 characters', () => {
    assert.throws(() => validatePasswordStrength('short'), /at least 8 characters/);
  });

  it('rejects common dictionary passwords', () => {
    assert.throws(() => validatePasswordStrength('password123'), /easily guessed/);
    assert.throws(() => validatePasswordStrength('admin123'), /easily guessed/);
  });

  it('validates and hashes strong passwords with bcrypt (12 rounds)', async () => {
    const password = 'Super$ecurePassword2026!';
    assert.doesNotThrow(() => validatePasswordStrength(password));

    const hash = await hashPassword(password);
    assert.ok(hash.startsWith('$2a$12$') || hash.startsWith('$2b$12$'));

    const isValid = await verifyPassword(password, hash);
    assert.strictEqual(isValid, true);

    const isInvalid = await verifyPassword('WrongPassword', hash);
    assert.strictEqual(isInvalid, false);
  });
});
