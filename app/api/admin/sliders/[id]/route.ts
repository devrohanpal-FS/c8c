import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { HeroSlideService } from '@/lib/services/heroSlideService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const slide = await HeroSlideService.getSlideById((await params).id);
    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ slide });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch slide' },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await HeroSlideService.updateSlide((await params).id, body);

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_HERO_SLIDE',
      entity: 'HeroSlide',
      entityId: updated.id,
      details: { title: updated.title },
    });

    return NextResponse.json({ success: true, slide: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update slide' },
      { status: 400 }
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

    const deleted = await HeroSlideService.deleteSlide((await params).id);

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_HERO_SLIDE',
      entity: 'HeroSlide',
      entityId: (await params).id,
      details: { title: deleted.title },
    });

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete slide' },
      { status: 400 }
    );
  }
}
