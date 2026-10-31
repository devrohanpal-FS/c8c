import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  status?: string;
}

export async function getAuditLogsService(params: GetAuditLogsParams = {}) {
  const { page = 1, limit = 15, search, action } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.AuditLogWhereInput = {};

  if (action && action !== "ALL") {
    where.action = action;
  }

  if (search && search.trim() !== '') {
    const term = search.trim();
    where.OR = [
      { action: { contains: term } },
      { entity: { contains: term } },
      { ipAddress: { contains: term } },
      { details: { contains: term } },
      { user: { email: { contains: term } } },
      { user: { name: { contains: term } } },
    ];
  }

  const [rawItems, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  const items = rawItems.map((item) => {
    const isFailure =
      item.action.includes('FAIL') ||
      item.action.includes('DENIED') ||
      item.action.includes('RATE_LIMITED') ||
      item.action.includes('EXPIRED');

    return {
      id: item.id,
      userId: item.userId,
      userEmail: item.user?.email || null,
      userName: item.user?.name || null,
      userRole: item.user?.role || null,
      action: item.action,
      entity: item.entity,
      entityType: item.entity,
      entityId: item.entityId,
      details: item.details,
      ipAddress: item.ipAddress,
      status: (isFailure ? 'FAILED' : 'SUCCESS') as 'SUCCESS' | 'FAILED' | 'DENIED',
      createdAt: item.createdAt.toISOString(),
    };
  });

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
