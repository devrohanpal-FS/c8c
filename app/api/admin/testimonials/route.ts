import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { TestimonialService } from '@/lib/services/testimonialService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const testimonials = await TestimonialService.getAllTestimonials(false);
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonials' },
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
    const newTestimonial = await TestimonialService.createTestimonial(body);

    return NextResponse.json({ success: true, testimonial: newTestimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create testimonial' },
      { status: 400 }
    );
  }
}