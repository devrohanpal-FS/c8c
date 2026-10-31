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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch FAQs' },
      { status: 500 }
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}