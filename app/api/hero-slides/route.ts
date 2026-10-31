import { NextResponse } from 'next/server';
import { HeroSlideService } from '@/lib/services/heroSlideService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = await HeroSlideService.getAllSlides(true);
    return NextResponse.json({ slides });
  } catch (error: any) {
    console.error('GET /api/hero-slides error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}
