import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { processStepSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, (await params).id);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, (await params).id);
}

async function handleUpdate(req: Request, id: string) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = processStepSchema.partial().parse(body);

    const updated = await prisma.processStep.update({
      where: { id },
      data: validated,
    });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_PROCESS_STEP',
      entity: 'ProcessStep',
      entityId: id,
      details: { id, ...validated },
    });

    return NextResponse.json({ step: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update process step' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deleted = await prisma.processStep.delete({
      where: { id: (await params).id },
    });

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_PROCESS_STEP',
      entity: 'ProcessStep',
      entityId: (await params).id,
      details: { title: deleted.title },
    });

    return NextResponse.json({ success: true, step: deleted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete process step' },
      { status: 500 }
    );
  }
}