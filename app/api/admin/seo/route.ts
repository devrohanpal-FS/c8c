import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch SEO settings' },
      { status: 500 }
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
    const { pageIdentifier, title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl, noIndex } = body;

    if (!pageIdentifier) {
      return NextResponse.json({ error: 'pageIdentifier is required' }, { status: 400 });
    }

    const updated = await prisma.sEO.upsert({
      where: { pageIdentifier },
      update: {
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        canonicalUrl,
        noIndex: noIndex ?? false,
      },
      create: {
        pageIdentifier,
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        canonicalUrl,
        noIndex: noIndex ?? false,
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_SEO_SETTINGS',
      entity: 'SEO',
      entityId: updated.id,
      details: { pageIdentifier, title, description },
    });

    return NextResponse.json({ seo: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update SEO settings' },
      { status: 500 }
    );
  }
}