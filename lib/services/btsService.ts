import { prisma } from '@/lib/db';
import { btsSchema } from '@/lib/validation';
import { z } from 'zod';

export type CreateBtsInput = z.infer<typeof btsSchema>;
export type UpdateBtsInput = Partial<CreateBtsInput>;

export class BtsService {
  static async getAllBts(onlyActive: boolean = false) {
    return prisma.btsImage.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  static async getBtsById(id: string) {
    return prisma.btsImage.findUnique({
      where: { id },
    });
  }

  static async createBts(data: CreateBtsInput) {
    const validated = btsSchema.parse(data);

    let order = validated.order;
    if (order === undefined || order === null) {
      const highest = await prisma.btsImage.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (highest?.order ?? 0) + 1;
    }

    const newBts = await prisma.btsImage.create({
      data: {
        imageUrl: validated.imageUrl,
        title: validated.title?.trim() || null,
        caption: validated.caption?.trim() || null,
        order,
        active: validated.active ?? true,
      },
    });

    // Also sync to homeCollageItem so homepage reflects updates
    await prisma.homeCollageItem.create({
      data: {
        mediaUrl: newBts.imageUrl,
        alt: newBts.title || 'BTS Photo',
        title: newBts.title || null,
        subtitle: newBts.caption || null,
        badge: `0${order} BTS`,
        buttonText: 'View Photo',
        linkUrl: newBts.imageUrl,
        order,
        active: newBts.active,
      },
    }).catch(() => {});

    return newBts;
  }

  static async updateBts(id: string, data: UpdateBtsInput) {
    const validated = btsSchema.partial().parse(data);

    const updated = await prisma.btsImage.update({
      where: { id },
      data: {
        ...(validated.imageUrl !== undefined && { imageUrl: validated.imageUrl }),
        ...(validated.title !== undefined && { title: validated.title?.trim() || null }),
        ...(validated.caption !== undefined && { caption: validated.caption?.trim() || null }),
        ...(validated.order !== undefined && { order: validated.order }),
        ...(validated.active !== undefined && { active: validated.active }),
      },
    });

    // Update matching homeCollageItem if present
    await prisma.homeCollageItem.updateMany({
      where: { mediaUrl: updated.imageUrl },
      data: {
        title: updated.title,
        subtitle: updated.caption,
        order: updated.order,
        active: updated.active,
      },
    }).catch(() => {});

    return updated;
  }

  static async deleteBts(id: string) {
    const existing = await prisma.btsImage.findUnique({ where: { id } });
    if (existing) {
      await prisma.homeCollageItem.deleteMany({
        where: { mediaUrl: existing.imageUrl },
      }).catch(() => {});
    }

    return prisma.btsImage.delete({
      where: { id },
    });
  }

  static async reorderBts(items: { id: string; order: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.btsImage.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }
}
