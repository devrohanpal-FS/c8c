import { z } from 'zod';

/**
 * Validates URLs stored from input:
 * - Allows relative paths starting with "/" (e.g. "/work", "/contact"), explicitly excluding protocol-relative "//"
 * - Allows absolute https:// URLs (e.g. "https://instagram.com/cre8tivecove.cc")
 * - Strictly rejects javascript:, data:, and other unsafe schemes
 */
export const safeUrlSchema = z.string().refine(
  (val) => {
    if (!val || val.trim() === '') return true;
    const trimmed = val.trim();
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return true;
    }
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
  },
  {
    message: 'URL must be a relative path starting with "/" (e.g. /work) or an absolute http(s):// URL',
  }
);

export const safeUrlOptional = safeUrlSchema.optional().nullable();

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format').max(120, 'Email cannot exceed 120 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password cannot exceed 128 characters'),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address').max(120, 'Email cannot exceed 120 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password cannot exceed 128 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
  avatar: safeUrlOptional,
});

export const workSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  client: z.string().min(1, 'Client name is required'),
  category: z.string().min(1, 'Category is required'),
  year: z.string().min(4, 'Year must be a valid 4-digit string'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  fullDescription: z.string().optional().nullable(),
  heroMedia: safeUrlOptional,
  heroVideoUrl: safeUrlOptional,
  thumbnailUrl: safeUrlOptional,
  projectVideoUrl: safeUrlOptional,
  video: safeUrlOptional,
  services: z.string().optional().nullable(),
  strategy: z.string().optional().nullable(),
  artDirection: z.string().optional().nullable(),
  deliverables: z.string().optional().nullable(),
  credits: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  order: z.number().int().default(0),
  gallery: z.array(z.object({
    mediaUrl: safeUrlSchema,
    mediaType: z.string().optional(),
    caption: z.string().optional(),
  })).optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(5, 'Description is required'),
  fullDescription: z.string().optional().nullable(),
  image: safeUrlOptional,
  hoverVideo: safeUrlOptional,
  category: z.string().optional().nullable().default('CREATIVE'),
  tags: z.string().optional().nullable(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
});

export const clientSchema = z.object({
  name: z.string().min(2, 'Client name is required'),
  slug: z.string().min(2, 'Slug is required'),
  logo: safeUrlOptional,
  website: safeUrlOptional,
  description: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address').max(120, 'Email cannot exceed 120 characters'),
  businessName: z.string().trim().max(150, 'Business name cannot exceed 150 characters').optional().nullable(),
  helpDetails: z.string().trim().min(5, 'Description is required').max(4000, 'Description cannot exceed 4000 characters'),
  budget: z.string().trim().max(60, 'Budget cannot exceed 60 characters').optional().nullable(),
  consentGiven: z.literal(true, {
    message: 'Explicit privacy consent is required to submit an inquiry.',
  }),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').or(z.literal('')).optional().nullable(),
  address: z.string().optional().nullable(),
  linkedin: safeUrlOptional,
  instagram: safeUrlOptional,
  youtube: safeUrlOptional,
  footerContent: z.string().optional().nullable(),
  defaultCtaHeading: z.string().optional().nullable(),
  defaultCtaText: z.string().optional().nullable(),
  defaultCtaUrl: safeUrlOptional,
  defaultSeoTitle: z.string().optional().nullable(),
  defaultSeoDesc: z.string().optional().nullable(),
});

export const homeCollageItemSchema = z.object({
  mediaUrl: safeUrlSchema,
  alt: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  linkUrl: safeUrlOptional,
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const homePageSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroSubtitle: z.string().optional().nullable(),
  heroVideoUrl: safeUrlOptional,
  heroPosterUrl: safeUrlOptional,
  heroCtaText: z.string().optional().nullable(),
  heroCtaUrl: safeUrlOptional,
  marqueeText: z.string().optional().nullable(),
  marqueeActive: z.boolean().optional(),
  ctaHeading: z.string().optional().nullable(),
  ctaDescription: z.string().optional().nullable(),
  ctaButtonText: z.string().optional().nullable(),
  ctaButtonUrl: safeUrlOptional,
  cultureTag: z.string().optional().nullable(),
  cultureTitle: z.string().optional().nullable(),
  collageItems: z.array(homeCollageItemSchema).optional(),
});

export const aboutPageSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroContent: z.string().optional().nullable(),
  backgroundUrl: safeUrlOptional,
  missionTitle: z.string().optional().nullable(),
  missionBody: z.string().optional().nullable(),
  companyStory: z.string().optional().nullable(),
  historyBody: z.string().optional().nullable(),
  credentials: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  certifications: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  ctaHeading: z.string().optional().nullable(),
  ctaButtonText: z.string().optional().nullable(),
  ctaButtonUrl: safeUrlOptional,
});

export const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  mediaUrl: safeUrlSchema,
  mediaType: z.enum(['IMAGE', 'VIDEO']).default('IMAGE'),
  ctaText: z.string().optional().nullable(),
  ctaUrl: safeUrlOptional,
  secondaryCtaText: z.string().optional().nullable(),
  secondaryCtaUrl: safeUrlOptional,
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const pricingTierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  priceLabel: z.string().optional().nullable(),
  billingPeriod: z.string().optional().nullable(),
  features: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  ctaText: z.string().optional().nullable(),
  ctaUrl: safeUrlOptional,
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.union([z.number().int(), z.string().regex(/^\d+$/).transform(Number)]).default(0),
});

export const faqSchema = z.object({
  question: z.string().min(2, 'Question is required'),
  answer: z.string().min(2, 'Answer is required'),
  category: z.string().optional(),
  order: z.union([z.number().int(), z.string().regex(/^\d+$/).transform(Number)]).default(0),
  active: z.boolean().default(true),
});

export const processStepSchema = z.object({
  stepNumber: z.union([z.string().min(1), z.number().int().min(1)]).transform((v) => String(v)),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  media: safeUrlOptional,
  order: z.union([z.number().int(), z.string().regex(/^\d+$/).transform(Number)]).default(0),
  active: z.boolean().default(true),
});

export const btsSchema = z.object({
  imageUrl: safeUrlSchema,
  title: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const seoSchema = z.object({
  pageIdentifier: z.string().trim().min(1, 'pageIdentifier is required').max(100),
  title: z.string().trim().max(160, 'Title cannot exceed 160 characters').optional().nullable(),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional().nullable(),
  keywords: z.string().trim().max(500, 'Keywords cannot exceed 500 characters').optional().nullable(),
  ogTitle: z.string().trim().max(160, 'OG Title cannot exceed 160 characters').optional().nullable(),
  ogDescription: z.string().trim().max(500, 'OG Description cannot exceed 500 characters').optional().nullable(),
  ogImage: safeUrlOptional,
  canonicalUrl: safeUrlOptional,
  noIndex: z.boolean().default(false),
});

export const reorderItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'Item ID is required'),
      order: z.number().int('Order must be an integer'),
    })
  ).min(1, 'At least one item is required to reorder'),
});