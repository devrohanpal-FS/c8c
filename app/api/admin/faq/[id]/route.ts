import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { faqSchema } from '@/lib/validation';

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update FAQ' },
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

    const deleted = await prisma.faq.delete({
      where: { id: params.id },
    });

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_FAQ',
      entity: 'Faq',
      entityId: params.id,
      details: { question: deleted.question },
    });

    return NextResponse.json({ success: true, faq: deleted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}