import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { ClientService } from '@/lib/services/clientService';
import { AuditService } from '@/lib/audit';

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
    const updated = await ClientService.updateClient(id, body);

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_CLIENT',
      entity: 'Client',
      entityId: id,
      details: body,
    });

    return NextResponse.json({ client: updated });
  } catch (error: unknown) {
    console.error('PATCH /api/admin/clients/[id] error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? 'Invalid client input'
          : 'Failed to update client',
      },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
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

    const deleted = await ClientService.deleteClient((await params).id);

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_CLIENT',
      entity: 'Client',
      entityId: (await params).id,
      details: { name: deleted.name },
    });

    return NextResponse.json({ success: true, client: deleted });
  } catch (error: unknown) {
    console.error('DELETE /api/admin/clients/[id] error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to delete client' },
      { status: isAuth ? 401 : 500 }
    );
  }
}