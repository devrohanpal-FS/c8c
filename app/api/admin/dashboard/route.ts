import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();


    const [
      publishedWorksCount,
      draftWorksCount,
      activeServicesCount,
      clientsCount,
      newSubmissionsCount,
      recentWorks,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.work.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      prisma.work.count({ where: { status: 'DRAFT', deletedAt: null } }),
      prisma.service.count({ where: { active: true, deletedAt: null } }),
      prisma.client.count({ where: { active: true, deletedAt: null } }),
      prisma.contactSubmission.count({ where: { status: 'NEW' } }),
      prisma.work.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          client: true,
          category: true,
          status: true,
          updatedAt: true,
        },
      }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, role: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        publishedWorks: publishedWorksCount,
        draftWorks: draftWorksCount,
        activeServices: activeServicesCount,
        totalClients: clientsCount,
        newSubmissions: newSubmissionsCount,
      },
      recentWorks,
      recentAuditLogs,
    });
  } catch (error) {
    console.error('GET /api/admin/dashboard error:', error);
    const isAuth = error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized' : 'Failed to load dashboard metrics.' },
      { status: isAuth ? 401 : 500 }
    );
  }
}