import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    const dbUser = await prisma.user.findFirst({
      where: { id: user.id, deletedAt: null },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User account has been deactivated or not found.', expired: true },
        { status: 401 }
      );
    }

    const now = Date.now();
    const lastActivity = ((user as any).lastActivity as number) || now;

    if (now - lastActivity > INACTIVITY_TIMEOUT_MS) {
      await AuditService.log({
        userId: user.id,
        action: 'SESSION_EXPIRED_INACTIVITY',
        entity: 'User',
        entityId: user.id,
        details: { role: dbUser.role, lastActivity: new Date(lastActivity).toISOString() },
      });

      return NextResponse.json(
        { error: 'Your session expired due to inactivity. Please log in again.', expired: true },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      lastActivity: now,
      expiresInSeconds: Math.max(0, Math.floor((INACTIVITY_TIMEOUT_MS - (now - lastActivity)) / 1000)),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Activity verification error', expired: true }, { status: 401 });
  }
}