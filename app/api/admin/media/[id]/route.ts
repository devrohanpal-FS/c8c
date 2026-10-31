import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { deleteMediaFile } from '@/lib/storage/mediaUpload';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const media = await prisma.media.findUnique({
      where: { id: params.id },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
    }

    await deleteMediaFile(media.storageKey);

    await prisma.media.delete({
      where: { id: params.id },
    });

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_MEDIA',
      entity: 'Media',
      entityId: media.id,
      details: { originalFilename: media.originalFilename, storageKey: media.storageKey },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete media asset' },
      { status: 500 }
    );
  }
}