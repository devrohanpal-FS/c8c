import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { aboutPageSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let aboutData = await prisma.aboutPage.findFirst();
    if (!aboutData) {
      aboutData = await prisma.aboutPage.create({
        data: {
          heroTitle: 'WEIRD ENERGY SINCE Y2K',
        },
      });
    }

    return NextResponse.json({ about: aboutData });
  } catch (error: any) {
    console.error('GET /api/admin/about error:', error);
    const isAuth = error?.message === 'Unauthorized';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized' : 'Failed to fetch About Page content' },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = aboutPageSchema.parse(body);

    const payload = {
      heroTitle: validated.heroTitle || 'WEIRD ENERGY SINCE Y2K',
      heroContent: validated.heroContent ?? null,
      backgroundUrl: validated.backgroundUrl?.trim() || null,
      missionTitle: validated.missionTitle || 'WE MAKE PEOPLE FEEL SOMETHING',
      missionBody: validated.missionBody ?? null,
      companyStory: validated.companyStory ?? null,
      historyBody: validated.historyBody ?? null,
      credentials: typeof validated.credentials === 'string' ? validated.credentials : JSON.stringify(validated.credentials || []),
      certifications: typeof validated.certifications === 'string' ? validated.certifications : JSON.stringify(validated.certifications || []),
      ctaHeading: validated.ctaHeading ?? null,
      ctaButtonText: validated.ctaButtonText ?? null,
      ctaButtonUrl: validated.ctaButtonUrl ?? null,
    };

    const existing = await prisma.aboutPage.findFirst();

    const updated = existing
      ? await prisma.aboutPage.update({
          where: { id: existing.id },
          data: payload,
        })
      : await prisma.aboutPage.create({
          data: payload,
        });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_ABOUT_PAGE',
      entity: 'AboutPage',
      entityId: updated.id,
      details: payload,
    });

    return NextResponse.json({ about: updated });
  } catch (error: any) {
    console.error('PUT /api/admin/about error:', error);
    const isValidation = error?.name === 'ZodError';
    const isAuth = error?.message === 'Unauthorized';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized' : (isValidation ? 'Invalid about page content' : 'Failed to update About Page content') },
      { status: isAuth ? 401 : (isValidation ? 400 : 500) }
    );
  }
}