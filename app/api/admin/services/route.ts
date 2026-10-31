import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { ServiceService } from '@/lib/services/serviceService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const services = await ServiceService.getAllServices(false);
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch services.' },
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
    const newService = await ServiceService.createService(body);

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_SERVICE',
      entity: 'Service',
      entityId: newService.id,
      details: { title: newService.title, slug: newService.slug },
    });

    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create service.' },
      { status: 400 }
    );
  }
}