import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { faqSchema } from '@/lib/validation';

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
    const validated = faqSchema.partial().parse(body);

    const updated = await prisma.faq.update({
      where: { id },
      data: validated,
    });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_FAQ',
      entity: 'Faq',
      entityId: id,
      details: { id, ...validated },
    });

    return NextResponse.json({ faq: updated });
  } catch (error: unknown) {
    console.error('PATCH /api/admin/faq/[id] error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? 'Invalid input'
          : 'Failed to update FAQ',
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

    const deleted = await prisma.faq.delete({
      where: { id: (await params).id },
    });

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_FAQ',
      entity: 'Faq',
      entityId: (await params).id,
      details: { question: deleted.question },
    });

    return NextResponse.json({ success: true, faq: deleted });
  } catch (error: unknown) {
    console.error('DELETE /api/admin/faq/[id] error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to delete FAQ' },
      { status: isAuth ? 401 : 500 }
    );
  }
}