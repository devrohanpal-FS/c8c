import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { TestimonialService } from '@/lib/services/testimonialService';

export const dynamic = 'force-dynamic';

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
    const updated = await TestimonialService.updateTestimonial((await params).id, body);

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: unknown) {
    console.error('PATCH /api/admin/testimonials/[id] error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? 'Invalid input'
          : 'Failed to update testimonial',
      },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
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

    await TestimonialService.deleteTestimonial((await params).id);

    return NextResponse.json({ success: true, message: 'Testimonial deleted' });
  } catch (error: unknown) {
    console.error('DELETE /api/admin/testimonials/[id] error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to delete testimonial' },
      { status: isAuth ? 401 : 500 }
    );
  }
}