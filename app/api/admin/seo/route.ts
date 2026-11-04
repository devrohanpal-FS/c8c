import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { seoSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const seoRecords = await prisma.sEO.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ seoRecords });
  } catch (error: unknown) {
    console.error('GET /api/admin/seo error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch SEO settings' },
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
    const validated = seoSchema.parse(body);

    const updated = await prisma.sEO.upsert({
      where: { pageIdentifier: validated.pageIdentifier },
      update: {
        title: validated.title ?? null,
        description: validated.description ?? null,
        keywords: validated.keywords ?? null,
        ogTitle: validated.ogTitle ?? null,
        ogDescription: validated.ogDescription ?? null,
        ogImage: validated.ogImage ?? null,
        canonicalUrl: validated.canonicalUrl ?? null,
        noIndex: validated.noIndex ?? false,
      },
      create: {
        pageIdentifier: validated.pageIdentifier,
        title: validated.title ?? null,
        description: validated.description ?? null,
        keywords: validated.keywords ?? null,
        ogTitle: validated.ogTitle ?? null,
        ogDescription: validated.ogDescription ?? null,
        ogImage: validated.ogImage ?? null,
        canonicalUrl: validated.canonicalUrl ?? null,
        noIndex: validated.noIndex ?? false,
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_SEO_SETTINGS',
      entity: 'SEO',
      entityId: updated.id,
      details: { pageIdentifier: validated.pageIdentifier, title: validated.title, description: validated.description },
    });

    return NextResponse.json({ seo: updated });
  } catch (error: unknown) {
    console.error('PUT /api/admin/seo error:', error);
    const errName = error instanceof Error ? error.name : '';
    const errMsg = error instanceof Error ? error.message : '';
    if (errName === 'ZodError') {
      return NextResponse.json({ error: 'Invalid SEO payload' }, { status: 400 });
    }
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to update SEO settings' },
      { status: isAuth ? 401 : 500 }
    );
  }
}