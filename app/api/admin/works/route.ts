import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { WorkService } from '@/lib/services/workService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {

  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const works = await WorkService.getAllWorks({ publishedOnly: false });
    return NextResponse.json({ works });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch works.' },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Cannot create content.' }, { status: 403 });
    }

    const body = await req.json();
    const newWork = await WorkService.createWork(body, user.id);

    await AuditService.log({
      userId: user.id,
      action: 'WORK_CREATED',
      entity: 'Work',
      entityId: newWork.id,
      details: { title: newWork.title, slug: newWork.slug, status: newWork.status },
    });

    return NextResponse.json({ success: true, work: newWork }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Work creation failed.' },
      { status: 400 }
    );
  }
}