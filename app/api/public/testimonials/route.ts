import { NextResponse } from 'next/server';
import { TestimonialService } from '@/lib/services/testimonialService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const testimonials = await TestimonialService.getAllTestimonials(true);
    return NextResponse.json({ testimonials });
  } catch (_error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch public testimonials' },
      { status: 500 }
    );
  }
}