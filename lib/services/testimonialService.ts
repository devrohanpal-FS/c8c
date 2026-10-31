import { prisma } from '@/lib/db';
import { z } from 'zod';
import { safeUrlOptional } from '@/lib/validation';

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  company: z.string().min(2, 'Company is required'),
  quote: z.string().min(5, 'Quote must be at least 5 characters'),
  avatar: safeUrlOptional,
  logo: safeUrlOptional,
  rating: z.number().int().default(5),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export class TestimonialService {
  static async getAllTestimonials(activeOnly = true) {
    return await prisma.testimonial.findMany({
      where: {
        ...(activeOnly ? { active: true, status: 'PUBLISHED' } : {}),
      },
      orderBy: { order: 'asc' },
    });
  }

  static async getTestimonialById(id: string) {
    return await prisma.testimonial.findUnique({
      where: { id },
    });
  }

  static async createTestimonial(data: TestimonialInput) {
    const validated = testimonialSchema.parse(data);
    return await prisma.testimonial.create({ data: validated });
  }

  static async updateTestimonial(id: string, data: Partial<TestimonialInput>) {
    const validated = testimonialSchema.partial().parse(data);
    return await prisma.testimonial.update({
      where: { id },
      data: validated,
    });
  }

  static async deleteTestimonial(id: string) {
    return await prisma.testimonial.delete({
      where: { id },
    });
  }
}