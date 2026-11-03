import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { deleteMediaFile } from '@/lib/storage/mediaUpload';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const media = await prisma.media.findUnique({
      where: { id: (await params).id },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
    }

    await deleteMediaFile(media.storageKey);

    await prisma.media.delete({
      where: { id: (await params).id },
    });

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_MEDIA',
      entity: 'Media',
      entityId: media.id,
      details: { originalFilename: media.originalFilename, storageKey: media.storageKey },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('DELETE /api/admin/media/[id] error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to delete media asset' },
      { status: isAuth ? 401 : 500 }
    );
  }
}