import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { HeroSlideService } from '@/lib/services/heroSlideService';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    await HeroSlideService.reorderSlides(body.items);
    return NextResponse.json({ success: true, message: 'Slides reordered' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reorder slides' },
      { status: 400 }
    );
  }
}
