import { prisma } from '@/lib/db';
import { z } from 'zod';
import { clientSchema } from '@/lib/validation';

export type ClientInput = z.infer<typeof clientSchema>;

export class ClientService {
  static async getAllClients(activeOnly = true) {
    return await prisma.client.findMany({
      where: {
        deletedAt: null,
        ...(activeOnly ? { active: true } : {}),
      },
      orderBy: { order: 'asc' },
    });
  }

  static async getFeaturedClients() {
    return await prisma.client.findMany({
      where: {
        deletedAt: null,
        active: true,
        featured: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  static async createClient(data: ClientInput) {
    const validated = clientSchema.parse(data);

    // Check if a client with this slug already exists (active or soft-deleted)
    const existing = await prisma.client.findFirst({
      where: { slug: validated.slug },
    });

    if (existing) {
      if (existing.deletedAt !== null) {
        // Restore and update soft-deleted client
        return await prisma.client.update({
          where: { id: existing.id },
          data: {
            ...validated,
            deletedAt: null,
            active: validated.active ?? true,
            updatedAt: new Date(),
          },
        });
      } else {
        // Active client with this slug exists, generate a unique slug
        let counter = 1;
        let newSlug = `${validated.slug}-${counter}`;
        while (await prisma.client.findFirst({ where: { slug: newSlug } })) {
          counter++;
          newSlug = `${validated.slug}-${counter}`;
        }
        validated.slug = newSlug;
      }
    }

    return await prisma.client.create({ data: validated });
  }

  static async updateClient(id: string, data: Partial<ClientInput>) {
    const validated = clientSchema.partial().parse(data);

    if (validated.slug) {
      const existing = await prisma.client.findFirst({
        where: { slug: validated.slug, NOT: { id } },
      });
      if (existing) {
        if (existing.deletedAt !== null) {
          // Rename soft-deleted client's slug to free up target slug
          await prisma.client.update({
            where: { id: existing.id },
            data: { slug: `${existing.slug}__deleted_${Date.now()}` },
          });
        } else {
          // Generate unique slug for active conflict
          let counter = 1;
          let newSlug = `${validated.slug}-${counter}`;
          while (await prisma.client.findFirst({ where: { slug: newSlug, NOT: { id } } })) {
            counter++;
            newSlug = `${validated.slug}-${counter}`;
          }
          validated.slug = newSlug;
        }
      }
    }

    return await prisma.client.update({
      where: { id },
      data: validated,
    });
  }

  static async deleteClient(id: string) {
    const existing = await prisma.client.findUnique({ where: { id } });
    const slugSuffix = existing ? `__deleted_${Date.now()}` : '';
    return await prisma.client.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
        ...(existing ? { slug: `${existing.slug}${slugSuffix}` } : {}),
      },
    });
  }
}