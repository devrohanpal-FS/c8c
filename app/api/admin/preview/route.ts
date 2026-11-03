import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') || 'work';

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    if (type === 'work') {
      const work = await prisma.work.findUnique({
        where: { slug },
        include: { gallery: true, seo: true },
      });

      if (!work) {
        return NextResponse.json({ error: 'Work project not found' }, { status: 404 });
      }

      return NextResponse.json({ preview: true, work });
    }

    return NextResponse.json({ error: 'Unsupported preview entity type' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized preview session';
    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}