import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { ClientService } from '@/lib/services/clientService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return handleUpdate(req, params.id);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  return handleUpdate(req, params.id);
}

async function handleUpdate(req: Request, id: string) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await ClientService.updateClient(id, body);

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_CLIENT',
      entity: 'Client',
      entityId: id,
      details: body,
    });

    return NextResponse.json({ client: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update client' },
      { status: 500 }
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

    const deleted = await ClientService.deleteClient(params.id);

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_CLIENT',
      entity: 'Client',
      entityId: params.id,
      details: { name: deleted.name },
    });

    return NextResponse.json({ success: true, client: deleted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete client' },
      { status: 500 }
    );
  }
}