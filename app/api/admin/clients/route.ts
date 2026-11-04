import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { ClientService } from '@/lib/services/clientService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const clients = await ClientService.getAllClients(false);
    return NextResponse.json({ clients });
  } catch (error) {
    console.error('GET /api/admin/clients error:', error);
    const isAuth = error instanceof Error && error.message.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch clients.' },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const newClient = await ClientService.createClient(body);

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_CLIENT',
      entity: 'Client',
      entityId: newClient.id,
      details: { name: newClient.name, slug: newClient.slug },
    });

    return NextResponse.json({ client: newClient }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/admin/clients error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : isValidation ? 'Invalid client input' : 'Failed to create client' },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}