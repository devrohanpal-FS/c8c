import { prisma } from '@/lib/db';
import { heroSlideSchema } from '@/lib/validation';
import { z } from 'zod';

export type CreateHeroSlideInput = z.infer<typeof heroSlideSchema>;
export type UpdateHeroSlideInput = Partial<CreateHeroSlideInput>;

export class HeroSlideService {
  static async getAllSlides(onlyActive: boolean = false) {
    return prisma.heroSlide.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  static async getSlideById(id: string) {
    return prisma.heroSlide.findUnique({
      where: { id },
    });
  }

  static async createSlide(data: CreateHeroSlideInput) {
    const validated = heroSlideSchema.parse(data);

    let order = validated.order;
    if (order === undefined || order === null) {
      const highest = await prisma.heroSlide.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (highest?.order ?? 0) + 1;
    }

    return prisma.heroSlide.create({
      data: {
        title: validated.title,
        subtitle: validated.subtitle ?? null,
        tagline: validated.tagline ?? 'CREATIVE DIRECTION',
        mediaUrl: validated.mediaUrl,
        mediaType: validated.mediaType ?? 'IMAGE',
        ctaText: validated.ctaText ?? 'EXPLORE WORK',
        ctaUrl: validated.ctaUrl ?? '/work',
        secondaryCtaText: validated.secondaryCtaText ?? null,
        secondaryCtaUrl: validated.secondaryCtaUrl ?? null,
        order,
        active: validated.active ?? true,
      },
    });
  }

  static async updateSlide(id: string, data: UpdateHeroSlideInput) {
    const validated = heroSlideSchema.partial().parse(data);

    return prisma.heroSlide.update({
      where: { id },
      data: validated,
    });
  }

  static async deleteSlide(id: string) {
    return prisma.heroSlide.delete({
      where: { id },
    });
  }

  static async reorderSlides(items: { id: string; order: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.heroSlide.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }
}
