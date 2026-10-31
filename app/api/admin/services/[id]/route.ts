import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { ServiceService } from '@/lib/services/serviceService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const service = await ServiceService.getServiceById((await params).id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch service.' },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await ServiceService.updateService((await params).id, body);

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_SERVICE',
      entity: 'Service',
      entityId: (await params).id,
      details: body as Record<string, unknown>,
    });

    return NextResponse.json({ service: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update service.' },
      { status: 400 }
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

    const deleted = await ServiceService.deleteService((await params).id);

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_SERVICE',
      entity: 'Service',
      entityId: (await params).id,
      details: { title: deleted.title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete service.' },
      { status: 400 }
    );
  }
}