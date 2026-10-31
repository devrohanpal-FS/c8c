import { prisma } from '@/lib/db';

export interface AuditLogInput {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}


function sanitizeLogDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) return undefined;
  const sanitized = { ...details };
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
  for (const k of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
      sanitized[k] = '[REDACTED]';
    }
  }
  return sanitized;
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