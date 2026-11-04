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
  } catch (error: unknown) {
    console.error('GET /api/admin/testimonials error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch testimonials' },
      { status: isAuth ? 401 : 500 }
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
  } catch (error: unknown) {
    console.error('POST /api/admin/testimonials error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? 'Invalid testimonial input'
          : 'Failed to create testimonial',
      },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}