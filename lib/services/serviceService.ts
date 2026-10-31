import { prisma } from '@/lib/db';
import { z } from 'zod';
import { serviceSchema } from '@/lib/validation';

export type ServiceInput = z.infer<typeof serviceSchema>;

export class ServiceService {
  static async getAllServices(activeOnly = true) {
    return await prisma.service.findMany({
      where: {
        deletedAt: null,
        ...(activeOnly ? { active: true, status: 'PUBLISHED' } : {}),
      },
      orderBy: { order: 'asc' },
      include: { seo: true },
    });
  }

  static async getServiceBySlug(slug: string) {
    return await prisma.service.findFirst({
      where: { slug, deletedAt: null },
      include: { seo: true },
    });
  }

  static async getServiceById(id: string) {
    return await prisma.service.findFirst({
      where: { id, deletedAt: null },
      include: { seo: true },
    });
  }

  static async createService(data: ServiceInput) {
    const validated = serviceSchema.parse(data);

    const existing = await prisma.service.findFirst({
      where: { slug: validated.slug },
    });

    if (existing) {
      if (existing.deletedAt !== null) {
        return await prisma.service.update({
          where: { id: existing.id },
          data: {
            ...validated,
            deletedAt: null,
            active: validated.active ?? true,
            status: validated.status || 'PUBLISHED',
            updatedAt: new Date(),
          },
        });
      } else {
        let counter = 1;
        let newSlug = `${validated.slug}-${counter}`;
        while (await prisma.service.findFirst({ where: { slug: newSlug } })) {
          counter++;
          newSlug = `${validated.slug}-${counter}`;
        }
        validated.slug = newSlug;
      }
    }

    return await prisma.service.create({ data: validated });
  }

  static async updateService(id: string, data: Partial<ServiceInput>) {
    const validated = serviceSchema.partial().parse(data);

    if (validated.slug) {
      const existing = await prisma.service.findFirst({
        where: { slug: validated.slug, NOT: { id } },
      });
      if (existing) {
        if (existing.deletedAt !== null) {
          await prisma.service.update({
            where: { id: existing.id },
            data: { slug: `${existing.slug}__deleted_${Date.now()}` },
          });
        } else {
          let counter = 1;
          let newSlug = `${validated.slug}-${counter}`;
          while (await prisma.service.findFirst({ where: { slug: newSlug, NOT: { id } } })) {
            counter++;
            newSlug = `${validated.slug}-${counter}`;
          }
          validated.slug = newSlug;
        }
      }
    }

    return await prisma.service.update({
      where: { id },
      data: validated,
    });
  }

  static async deleteService(id: string) {
    const existing = await prisma.service.findUnique({ where: { id } });
    const slugSuffix = existing ? `__deleted_${Date.now()}` : '';
    return await prisma.service.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
        status: 'DRAFT',
        ...(existing ? { slug: `${existing.slug}${slugSuffix}` } : {}),
      },
    });
  }
}