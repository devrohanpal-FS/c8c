import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { faqSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ faqs });
  } catch (error: unknown) {
    console.error('GET /api/admin/faq error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch FAQs' },
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
    const validated = faqSchema.parse(body);

    const created = await prisma.faq.create({
      data: {
        question: validated.question,
        answer: validated.answer,
        category: validated.category || 'General',
        order: validated.order ?? 0,
        active: validated.active ?? true,
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_FAQ',
      entity: 'Faq',
      entityId: created.id,
      details: { question: created.question },
    });

    return NextResponse.json({ faq: created }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/admin/faq error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? 'Invalid FAQ input'
          : 'Failed to create FAQ',
      },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}