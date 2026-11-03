import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { processStepSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const steps = await prisma.processStep.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ steps });
  } catch (error: unknown) {
    console.error('GET /api/admin/process error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch process steps' },
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
    const validated = processStepSchema.parse(body);

    const created = await prisma.processStep.create({
      data: {
        stepNumber: validated.stepNumber,
        title: validated.title,
        description: validated.description,
        media: validated.media ?? null,
        order: validated.order ?? 0,
        active: validated.active ?? true,
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_PROCESS_STEP',
      entity: 'ProcessStep',
      entityId: created.id,
      details: { title: created.title, stepNumber: created.stepNumber },
    });

    return NextResponse.json({ step: created }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/admin/process error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? 'Invalid process step input'
          : 'Failed to create process step',
      },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}