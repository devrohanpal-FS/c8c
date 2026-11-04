import { prisma } from '@/lib/db';

export interface AuditLogInput {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}


export function sanitizeLogDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) return undefined;

  const exactSensitive = ['password', 'passwd', 'token', 'secret', 'key', 'auth', 'credentials', 'credential', 'cookie'];

  function isSensitiveKey(key: string): boolean {
    const k = key.toLowerCase();
    // Explicit exclusion for benign fields that contain sensitive substrings (e.g., 'keywords' contains 'key', 'author' contains 'auth')
    if (['keywords', 'keyword', 'author', 'authorname', 'authors', 'authority'].includes(k)) {
      return false;
    }

    if (exactSensitive.includes(k)) {
      return true;
    }

    // Common compound tokens: apiKey, api_key, authToken, auth_token, secretKey, accessToken, sessionCookie, connectionSecret, etc.
    const compoundRegex = /(api_?key|secret_?key|access_?key|private_?key|auth_?token|access_?token|refresh_?token|session_?cookie|connection_?secret|new_?password|user_?password|nested_?auth)/i;
    if (compoundRegex.test(key)) {
      return true;
    }

    // Delimited tokens (e.g. user_key, client-secret, db_password, auth-token)
    const segments = k.split(/[-_.]/);
    if (segments.some((seg) => exactSensitive.includes(seg))) {
      return true;
    }

    // CamelCase boundary matching (e.g., apiKey, authToken, dbPassword)
    if (/(?:^|[a-z])(Password|Secret|Token|Credentials?|Cookie|ApiKey|Auth)(?:$|[A-Z])/.test(key)) {
      return true;
    }

    return false;
  }

  function sanitizeValue(val: unknown): unknown {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'object') return val;
    if (Array.isArray(val)) return val.map(sanitizeValue);

    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (isSensitiveKey(k)) {
        result[k] = '[REDACTED]';
      } else {
        result[k] = sanitizeValue(v);
      }
    }
    return result;
  }

  return sanitizeValue(details) as Record<string, unknown>;
}

export class AuditService {
  static async log(input: AuditLogInput) {
    try {
      const sanitizedDetails = sanitizeLogDetails(input.details);
      return await prisma.auditLog.create({
        data: {
          userId: input.userId,
          action: input.action,
          entity: input.entity,
          entityId: input.entityId,
          details: sanitizedDetails ? JSON.stringify(sanitizedDetails) : undefined,
          ipAddress: input.ipAddress,
        },
      });
    } catch (error) {
      console.error('[AUDIT LOG ERROR]: Failed to record audit log:', error);
    }
  }

  static async logPublish(userId: string | undefined, entity: string, entityId: string, title?: string) {
    return this.log({
      userId,
      action: 'PUBLISH_CONTENT',
      entity,
      entityId,
      details: { title },
    });
  }

  static async logUnpublish(userId: string | undefined, entity: string, entityId: string, title?: string) {
    return this.log({
      userId,
      action: 'UNPUBLISH_CONTENT',
      entity,
      entityId,
      details: { title },
    });
  }

  static async logArchive(userId: string | undefined, entity: string, entityId: string, title?: string) {
    return this.log({
      userId,
      action: 'ARCHIVE_CONTENT',
      entity,
      entityId,
      details: { title },
    });
  }

  static async getLogs(options?: { limit?: number; entity?: string }) {
    return await prisma.auditLog.findMany({
      where: options?.entity ? { entity: options.entity } : undefined,
      take: options?.limit || 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }
}