import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { BtsService } from '@/lib/services/btsService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const btsImage = await BtsService.getBtsById(params.id);
    if (!btsImage) {
      return NextResponse.json({ error: 'BTS image not found' }, { status: 404 });
    }

    return NextResponse.json({ btsImage });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch BTS image' },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return PATCH(req, { params });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await BtsService.updateBts(params.id, body);

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_BTS_IMAGE',
      entity: 'BtsImage',
      entityId: updated.id,
      details: { title: updated.title, imageUrl: updated.imageUrl },
    });

    return NextResponse.json({ success: true, btsImage: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update BTS image' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deleted = await BtsService.deleteBts(params.id);

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_BTS_IMAGE',
      entity: 'BtsImage',
      entityId: params.id,
      details: { imageUrl: deleted.imageUrl },
    });

    return NextResponse.json({ success: true, message: 'BTS image deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete BTS image' },
      { status: 400 }
    );
  }
}
