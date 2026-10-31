import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Hashes a password using bcrypt with 12 salt rounds (OWASP recommended cost).
 */
export async function hashPassword(password: string): Promise<string> {
  validatePasswordStrength(password);
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Verifies a plain text password against a stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
}

/**
 * Enforces strong password rules.
 */
export function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }

  const trimmed = password.trim();
  if (trimmed.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  if (password.length > 128) {
    throw new Error('Password cannot exceed 128 characters.');
  }

  const commonWeak = [
    'password',
    'password123',
    'admin123',
    '12345678',
    'qwertyuiop',
    'cre8tivecove',
    'changeme',
  ];

  if (commonWeak.includes(trimmed.toLowerCase())) {
    throw new Error('Password is too common and easily guessed. Please choose a stronger password.');
  }

  return { valid: true };
}

/**
 * Strips dangerous HTML tags, inline scripts, event handlers, and escapes special HTML chars.
 * Prevents Stored and Reflected XSS attacks.
 */
export function sanitizeInputString(input: unknown): string {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') return String(input);

  let clean = input
    // Remove null bytes
    .replace(/\0/g, '')
    // Strip <script...>...</script> blocks
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip <iframe...>...</iframe> blocks
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Strip inline event handlers like onclick=, onerror=, onload=
    .replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    // Neutralize dangerous URL schemes
    .replace(/\b(?:javascript|data|vbscript):/gi, 'blocked:');

  // Escape HTML entities
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return clean.trim();
}

/**
 * Recursively sanitizes all string fields in an object or array.
 */
export function sanitizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) return payload;

  if (typeof payload === 'string') {
    return sanitizeInputString(payload) as unknown as T;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item)) as unknown as T;
  }

  if (typeof payload === 'object') {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      // Don't modify passwords during sanitization to avoid altering user credentials
      if (key.toLowerCase().includes('password')) {
        sanitizedObj[key] = value;
      } else {
        sanitizedObj[key] = sanitizePayload(value);
      }
    }
    return sanitizedObj as T;
  }

  return payload;
}

/**
 * Validates and sanitizes a redirect target URL to prevent Open Redirect attacks.
 * Enforces that target must be a relative path starting with '/' and NOT '//'.
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback = '/admin/dashboard'): string {
  if (!target || typeof target !== 'string') return fallback;

  const trimmed = target.trim();
  // Must start with a single slash (relative URL) and NOT protocol-relative '//'
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    return trimmed;
  }

  return fallback;
}
