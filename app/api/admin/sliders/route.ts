import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { HeroSlideService } from '@/lib/services/heroSlideService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const slides = await HeroSlideService.getAllSlides(false);
    return NextResponse.json({ slides });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero slides' },
      { status: 401 }
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

    if (!body.title?.trim() || !body.mediaUrl?.trim()) {
      return NextResponse.json(
        { error: 'Slide Title and Media URL are required' },
        { status: 400 }
      );
    }

    const newSlide = await HeroSlideService.createSlide({
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      tagline: body.tagline?.trim() || 'CREATIVE DIRECTION',
      mediaUrl: body.mediaUrl.trim(),
      mediaType: body.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE',
      ctaText: body.ctaText?.trim() || 'EXPLORE WORK',
      ctaUrl: body.ctaUrl?.trim() || '/work',
      secondaryCtaText: body.secondaryCtaText?.trim() || null,
      secondaryCtaUrl: body.secondaryCtaUrl?.trim() || null,
      order: typeof body.order === 'number' ? body.order : undefined,
      active: body.active ?? true,
    });

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_HERO_SLIDE',
      entity: 'HeroSlide',
      entityId: newSlide.id,
      details: { title: newSlide.title },
    });

    return NextResponse.json({ success: true, slide: newSlide }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create hero slide' },
      { status: 400 }
    );
  }
}
