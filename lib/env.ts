/**
 * Centralized environment configuration and security validation.
 * Compatible with Edge runtime (middleware) and Node.js server environments.
 */

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function getNextAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    // Only allow build placeholder during the explicit Next.js production build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return 'build-phase-placeholder-secret-must-be-at-least-32-chars-long';
    }
    throw new Error(
      'Security Configuration Error: NEXTAUTH_SECRET is not defined. Generate a minimum 32-character secret with: openssl rand -base64 32'
    );
  }

  const lower = secret.toLowerCase();
  if (
    secret.startsWith('CHANGE_ME') ||
    lower.includes('your-super-secret') ||
    lower.includes('changeme')
  ) {
    throw new Error(
      'Security Configuration Error: NEXTAUTH_SECRET contains an unconfigured placeholder value. Generate a real secret with: openssl rand -base64 32'
    );
  }

  if (secret.length < 32) {
    throw new Error(
      `Security Configuration Error: NEXTAUTH_SECRET must be at least 32 characters long (current length: ${secret.length}). Generate one with: openssl rand -base64 32`
    );
  }

  return secret;
}

export function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return 'file:./dev.db';
    }
    throw new Error('Configuration Error: DATABASE_URL is not set.');
  }
  return dbUrl;
}

export function getNextAuthUrl(): string {
  const authUrl = process.env.NEXTAUTH_URL;
  if (!authUrl) {
    return 'http://localhost:3000';
  }
  return authUrl;
}

/**
 * Validates that no sensitive secrets are leaked via NEXT_PUBLIC_ prefixes.
 */
export function validatePublicEnvSafety(): void {
  const publicKeys = Object.keys(process.env).filter((k) => k.startsWith('NEXT_PUBLIC_'));
  const dangerousSubstrings = ['SECRET', 'PASSWORD', 'KEY', 'TOKEN', 'PRIVATE', 'DATABASE'];

  for (const key of publicKeys) {
    const upper = key.toUpperCase();
    for (const dangerous of dangerousSubstrings) {
      if (upper.includes(dangerous)) {
        throw new Error(
          `FATAL SECURITY VIOLATION: Environment variable ${key} contains "${dangerous}" and is exposed to the browser via NEXT_PUBLIC_ prefix! Rename or remove immediately.`
        );
      }
    }
  }
}
