import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { WorkService } from '@/lib/services/workService';
import { AuditService } from '@/lib/audit';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return PATCH(req, { params });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updatedWork = await WorkService.updateWork(params.id, body, user.id);

    await AuditService.log({
      userId: user.id,
      action: 'WORK_UPDATED',
      entity: 'Work',
      entityId: updatedWork.id,
      details: { title: updatedWork.title, status: updatedWork.status },
    });

    return NextResponse.json({ success: true, work: updatedWork });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Work update failed.' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deletedWork = await WorkService.softDeleteWork(params.id, user.id);

    await AuditService.log({
      userId: user.id,
      action: 'WORK_SOFT_DELETED',
      entity: 'Work',
      entityId: deletedWork.id,
      details: { title: deletedWork.title },
    });

    return NextResponse.json({ success: true, message: 'Work soft-deleted.' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Work deletion failed.' },
      { status: 400 }
    );
  }
}