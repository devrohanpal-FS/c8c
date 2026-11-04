import { prisma } from '@/lib/db';
import { z } from 'zod';
import { workSchema } from '@/lib/validation';

export type WorkInput = z.infer<typeof workSchema>;
export interface WorkGalleryInputItem {
  mediaUrl: string;
  mediaType?: string;
  caption?: string;
}

export class WorkService {
  static async getAllWorks(options?: { publishedOnly?: boolean; featuredOnly?: boolean }) {
    return await prisma.work.findMany({
      where: {
        deletedAt: null,
        ...(options?.publishedOnly ? { status: 'PUBLISHED' } : {}),
        ...(options?.featuredOnly ? { featured: true } : {}),
      },
      orderBy: { order: 'asc' },
      include: {
        gallery: { orderBy: { order: 'asc' } },
        seo: true,
      },
    });
  }

  static async getWorkBySlug(slug: string) {
    return await prisma.work.findFirst({
      where: { slug, deletedAt: null },
      include: {
        gallery: { orderBy: { order: 'asc' } },
        seo: true,
      },
    });
  }

  static async createWork(data: WorkInput, userId?: string) {
    const validated = workSchema.parse(data);

    const existing = await prisma.work.findFirst({
      where: { slug: validated.slug },
    });

    if (existing) {
      if (existing.deletedAt !== null) {
        const { video, gallery, ...validData } = validated as any;
        return await prisma.$transaction(async (tx) => {
          if (Array.isArray(gallery)) {
            await tx.workGallery.deleteMany({ where: { workId: existing.id } });
          }
          return await tx.work.update({
            where: { id: existing.id },
            data: {
              ...validData,
              deletedAt: null,
              updatedById: userId,
              updatedAt: new Date(),
              ...(gallery && Array.isArray(gallery) && gallery.length > 0
                ? {
                    gallery: {
                      create: gallery.map((item: WorkGalleryInputItem, idx: number) => ({
                        mediaUrl: item.mediaUrl,
                        mediaType: item.mediaType || 'VIDEO',
                        caption: item.caption || '',
                        order: idx,
                      })),
                    },
                  }
                : {}),
            },
            include: {
              gallery: { orderBy: { order: 'asc' } },
              seo: true,
            },
          });
        });
      } else {
        let counter = 1;
        let newSlug = `${validated.slug}-${counter}`;
        while (await prisma.work.findFirst({ where: { slug: newSlug } })) {
          counter++;
          newSlug = `${validated.slug}-${counter}`;
        }
        validated.slug = newSlug;
      }
    }

    const { video, gallery, ...validData } = validated as any;
    return await prisma.work.create({
      data: {
        ...validData,
        createdById: userId,
        updatedById: userId,
        ...(gallery && Array.isArray(gallery) && gallery.length > 0
          ? {
              gallery: {
                create: gallery.map((item: WorkGalleryInputItem, idx: number) => ({
                  mediaUrl: item.mediaUrl,
                  mediaType: item.mediaType || 'VIDEO',
                  caption: item.caption || '',
                  order: idx,
                })),
              },
            }
          : {}),
      },
      include: {
        gallery: { orderBy: { order: 'asc' } },
        seo: true,
      },
    });
  }

  static async updateWork(id: string, data: Partial<WorkInput>, userId?: string) {
    const validated = workSchema.partial().parse(data);

    if (validated.slug) {
      const existing = await prisma.work.findFirst({
        where: { slug: validated.slug, NOT: { id } },
      });
      if (existing) {
        if (existing.deletedAt !== null) {
          await prisma.work.update({
            where: { id: existing.id },
            data: { slug: `${existing.slug}__deleted_${Date.now()}` },
          });
        } else {
          let counter = 1;
          let newSlug = `${validated.slug}-${counter}`;
          while (await prisma.work.findFirst({ where: { slug: newSlug, NOT: { id } } })) {
            counter++;
            newSlug = `${validated.slug}-${counter}`;
          }
          validated.slug = newSlug;
        }
      }
    }

    const { video, gallery, ...validData } = validated as any;

    return await prisma.$transaction(async (tx) => {
      if (Array.isArray(gallery)) {
        await tx.workGallery.deleteMany({ where: { workId: id } });
      }

      return await tx.work.update({
        where: { id },
        data: {
          ...validData,
          updatedById: userId,
          ...(Array.isArray(gallery) && gallery.length > 0
            ? {
                gallery: {
                  create: gallery.map((item: WorkGalleryInputItem, idx: number) => ({
                    mediaUrl: item.mediaUrl,
                    mediaType: item.mediaType || 'VIDEO',
                    caption: item.caption || '',
                    order: idx,
                  })),
                },
              }
            : {}),
        },
        include: {
          gallery: { orderBy: { order: 'asc' } },
          seo: true,
        },
      });
    });
  }

  static async softDeleteWork(id: string, userId?: string) {
    const existing = await prisma.work.findUnique({ where: { id } });
    const slugSuffix = existing ? `__deleted_${Date.now()}` : '';
    return await prisma.work.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: userId,
        ...(existing ? { slug: `${existing.slug}${slugSuffix}` } : {}),
      },
    });
  }
}