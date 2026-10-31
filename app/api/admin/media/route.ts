import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { saveMediaFile } from '@/lib/storage/mediaUpload';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || undefined;
    const mimeType = searchParams.get('mimeType') || undefined;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (mimeType && mimeType !== 'ALL') {
      where.mimeType = { startsWith: mimeType };
    }
    if (search) {
      where.OR = [
        { originalFilename: { contains: search } },
        { title: { contains: search } },
        { altText: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch media library' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';
    const title = (formData.get('title') as string) || '';
    const caption = (formData.get('caption') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saved = await saveMediaFile(buffer, file.name, file.type);

    const mediaRecord = await prisma.media.create({
      data: {
        filename: saved.filename,
        originalFilename: saved.originalFilename,
        mimeType: saved.mimeType,
        size: saved.size,
        storageKey: saved.storageKey,
        url: saved.url,
        altText,
        title: title || saved.originalFilename,
        caption,
        createdById: user.id,
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'UPLOAD_MEDIA',
      entity: 'Media',
      entityId: mediaRecord.id,
      details: {
        originalName: saved.originalFilename,
        size: saved.size,
        mimeType: saved.mimeType,
        url: saved.url,
      },
    });

    return NextResponse.json({ media: mediaRecord }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/media error:', error);
    return NextResponse.json(
      { error: error.message || 'Media upload failed' },
      { status: 400 }
    );
  }
}