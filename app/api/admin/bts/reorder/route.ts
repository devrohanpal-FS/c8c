import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { BtsService } from '@/lib/services/btsService';
import { reorderItemsSchema } from '@/lib/validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = reorderItemsSchema.parse(body);

    await BtsService.reorderBts(validated.items);
    return NextResponse.json({ success: true, message: 'BTS images reordered' });
  } catch (error: unknown) {
    console.error('POST /api/admin/bts/reorder error:', error);
    const isAuth = error instanceof Error && error.message.includes('Unauthorized');
    const isValidation = error instanceof z.ZodError;
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? (error.issues?.[0]?.message || 'Invalid items array structure')
          : 'Failed to reorder BTS images',
      },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}
