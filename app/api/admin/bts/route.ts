import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { BtsService } from '@/lib/services/btsService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const btsImages = await BtsService.getAllBts(false);
    return NextResponse.json({ btsImages });
  } catch (error: unknown) {
    console.error('GET /api/admin/bts error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch BTS images' },
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

    if (!body.imageUrl?.trim()) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const newBts = await BtsService.createBts({
      imageUrl: body.imageUrl.trim(),
      title: body.title?.trim() || null, // Title is optional (blank allowed)
      caption: body.caption?.trim() || null,
      order: typeof body.order === 'number' ? body.order : undefined,
      active: body.active ?? true,
    });

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_BTS_IMAGE',
      entity: 'BtsImage',
      entityId: newBts.id,
      details: { imageUrl: newBts.imageUrl, title: newBts.title },
    });

    return NextResponse.json({ success: true, btsImage: newBts }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/admin/bts error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      {
        error: isAuth
          ? 'Unauthorized access'
          : isValidation
          ? 'Invalid input'
          : 'Failed to create BTS image',
      },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}
