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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch clients.' },
      { status: 401 }
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create client' },
      { status: 400 }
    );
  }
}