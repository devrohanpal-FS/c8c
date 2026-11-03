import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageSettings } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { siteSettingsSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageSettings(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'CRE8TIVECOVE',
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: unknown) {
    console.error('GET /api/admin/settings error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg === 'Unauthorized';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized' : 'Failed to fetch Site Settings' },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageSettings(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = siteSettingsSchema.parse(body);
    const existing = await prisma.siteSettings.findFirst();

    const dataToSave = {
      siteName: validated.siteName,
      tagline: validated.tagline ?? 'Lean Mean Storytelling Machine • Weird Energy Since Y2K',
      description: validated.description ?? null,
      phone: validated.phone ?? '+91 9999-659-129',
      email: validated.email ?? 'hello@cre8tivecove.com',
      address: validated.address ?? 'Delhi, India',
      linkedin: validated.linkedin ?? 'https://www.linkedin.com/company/cre8tivecove/',
      instagram: validated.instagram ?? 'https://www.instagram.com/cre8tivecove.cc/',
      youtube: validated.youtube ?? 'https://www.youtube.com/@CRE8TIVECOVE',
      footerContent: validated.footerContent ?? null,
      defaultCtaHeading: validated.defaultCtaHeading ?? null,
      defaultCtaText: validated.defaultCtaText ?? null,
      defaultCtaUrl: validated.defaultCtaUrl ?? '/contact',
      defaultSeoTitle: validated.defaultSeoTitle ?? null,
      defaultSeoDesc: validated.defaultSeoDesc ?? null,
    };

    const updated = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data: dataToSave,
        })
      : await prisma.siteSettings.create({
          data: dataToSave,
        });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_SITE_SETTINGS',
      entity: 'SiteSettings',
      entityId: updated.id,
      details: dataToSave,
    });

    return NextResponse.json({ settings: updated });
  } catch (error: unknown) {
    console.error('PUT /api/admin/settings error:', error);
    const errName = error instanceof Error ? error.name : '';
    const errMsg = error instanceof Error ? error.message : '';
    const isValidation = errName === 'ZodError';
    const isAuth = errMsg === 'Unauthorized';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized' : (isValidation ? 'Invalid settings input' : 'Failed to update Site Settings') },
      { status: isAuth ? 401 : (isValidation ? 400 : 500) }
    );
  }
}