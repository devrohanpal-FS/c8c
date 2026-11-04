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
    console.error('GET /api/admin/works error:', error);
    const isAuth = error instanceof Error && error.message.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch works.' },
      { status: isAuth ? 401 : 500 }
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
  } catch (error: unknown) {
    console.error('POST /api/admin/works error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : isValidation ? 'Invalid work project payload.' : 'Work creation failed.' },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}