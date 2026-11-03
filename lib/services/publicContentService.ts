import { prisma } from '@/lib/db';

function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw || typeof raw !== 'string') return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}


export async function getPublishedHome() {
  const page = await prisma.homePage.findFirst();
  const collage = await prisma.homeCollageItem.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: { id: true, mediaUrl: true, alt: true, order: true },
  });

  return {
    heroTitle: page?.heroTitle || 'WEIRD ENERGY SINCE Y2K',
    heroSubtitle: page?.heroSubtitle || 'Lean Mean Storytelling Machine',
    heroVideoUrl: page?.heroVideoUrl || null,
    heroPosterUrl: page?.heroPosterUrl || null,
    heroCtaText: page?.heroCtaText || 'EXPLORE WORK',
    heroCtaUrl: page?.heroCtaUrl || '/work',
    marqueeText: page?.marqueeText || 'STRATEGY • CREATIVE DIRECTION • VISUAL IDENTITY • DIGITAL EXPERIENCES',
    marqueeActive: page?.marqueeActive ?? true,
    ctaHeading: page?.ctaHeading || 'READY TO MAKE SOMETHING WEIRD?',
    ctaDescription: page?.ctaDescription || "Let's build something people won't stop talking about.",
    ctaButtonText: page?.ctaButtonText || 'START A PROJECT',
    ctaButtonUrl: page?.ctaButtonUrl || '/contact',
    cultureTag: page?.cultureTag || 'THE CULTURE',
    cultureTitle: page?.cultureTitle || 'BEHIND THE LENS BEYOND THE STORY',
    collage,
  };
}

export async function getPublishedAbout() {
  const page = await prisma.aboutPage.findFirst();
  return {
    heroTitle: page?.heroTitle || 'WEIRD ENERGY SINCE Y2K',
    heroContent: page?.heroContent || 'We are a bold digital design and storytelling collective.',
    backgroundUrl: page?.backgroundUrl || null,
    missionTitle: page?.missionTitle || 'WE MAKE PEOPLE FEEL SOMETHING',
    missionBody: page?.missionBody || 'Crafting unforgettable visual identities, web experiences, and film.',
    companyStory: page?.companyStory || 'Founded in 2020 to push digital boundaries.',
    historyBody: page?.historyBody || null,
    credentials: safeJsonParse<string[]>(page?.credentials, ['Awwwards Site of the Day', 'FWA of the Month']),
    certifications: safeJsonParse<string[]>(page?.certifications, ['Google Cloud Partner', 'Prisma Certified']),
    ctaHeading: page?.ctaHeading || 'WORK WITH US',
    ctaButtonText: page?.ctaButtonText || 'GET IN TOUCH',
    ctaButtonUrl: page?.ctaButtonUrl || '/contact',
  };
}

export async function getPublishedServices(category?: string) {
  const services = await prisma.service.findMany({
    where: {
      status: 'PUBLISHED',
      active: true,
      deletedAt: null,
      ...(category && category !== 'ALL' ? { category } : {}),
    },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      fullDescription: true,
      image: true,
      hoverVideo: true,
      category: true,
      tags: true,
      order: true,
    },
  });
  return services;
}

export async function getPublishedServiceBySlug(slug: string) {
  const service = await prisma.service.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      fullDescription: true,
      image: true,
      hoverVideo: true,
      category: true,
      tags: true,
      order: true,
      seo: {
        select: {
          title: true,
          description: true,
          ogTitle: true,
          ogDescription: true,
          ogImage: true,
        },
      },
    },
  });
  return service;
}

export async function getPublishedWork() {
  const works = await prisma.work.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      client: true,
      category: true,
      year: true,
      description: true,
      heroMedia: true,
      heroVideoUrl: true,
      thumbnailUrl: true,
      featured: true,
    },
  });
  return works;
}

export async function getPublishedWorkBySlug(slug: string) {
  const work = await prisma.work.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    select: {
      id: true,
      title: true,
      slug: true,
      client: true,
      category: true,
      year: true,
      description: true,
      fullDescription: true,
      heroMedia: true,
      heroVideoUrl: true,
      thumbnailUrl: true,
      projectVideoUrl: true,
      projectUrl: true,
      services: true,
      strategy: true,
      artDirection: true,
      deliverables: true,
      credits: true,
      featured: true,
      gallery: {
        select: { id: true, mediaUrl: true, mediaType: true, caption: true, order: true },
        orderBy: { order: 'asc' },
      },
    },
  });
  return work;
}

export async function getPublishedClients() {
  return await prisma.client.findMany({
    where: { active: true, deletedAt: null },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      website: true,
      description: true,
      featured: true,
    },
  });
}

export async function getPublishedProcess() {
  return await prisma.processStep.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      stepNumber: true,
      title: true,
      description: true,
      media: true,
      order: true,
    },
  });
}

export async function getPublishedPricing() {
  const tiers = await prisma.pricingTier.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      priceLabel: true,
      billingPeriod: true,
      features: true,
      ctaText: true,
      ctaUrl: true,
      featured: true,
    },
  });

  return tiers.map((t) => ({
    ...t,
    features: safeJsonParse<string[]>(t.features, []),
  }));
}

export async function getPublishedFAQs() {
  return await prisma.faq.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      question: true,
      answer: true,
      category: true,
    },
  });
}

export async function getPublicSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return {
    siteName: settings?.siteName || 'CRE8TIVECOVE',
    tagline: settings?.tagline || 'Lean Mean Storytelling Machine • Weird Energy Since Y2K',
    description: settings?.description || 'Full-stack creative agency, digital design studio, and video production hub.',
    phone: settings?.phone || '+91 9999-659-129',
    email: settings?.email || 'hello@cre8tivecove.com',
    address: settings?.address || 'Delhi, India',
    linkedin: settings?.linkedin || 'https://www.linkedin.com/company/cre8tivecove/',
    instagram: settings?.instagram || 'https://www.instagram.com/cre8tivecove.cc/',
    youtube: settings?.youtube || 'https://www.youtube.com/@CRE8TIVECOVE',
    footerContent: settings?.footerContent || '© 2026 CRE8TIVECOVE. All rights reserved.',
  };
}

export async function getPublicSEO(pageIdentifier?: string) {
  if (!pageIdentifier) return null;
  return await prisma.sEO.findFirst({
    where: { pageIdentifier },
    select: {
      title: true,
      description: true,
      keywords: true,
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      canonicalUrl: true,
      noIndex: true,
    },
  });
}

export type PublishedHomeData = Awaited<ReturnType<typeof getPublishedHome>>;
export type PublishedAboutData = Awaited<ReturnType<typeof getPublishedAbout>>;
export type PublishedWorkData = Awaited<ReturnType<typeof getPublishedWork>>;
export type PublicSiteSettings = Awaited<ReturnType<typeof getPublicSiteSettings>>;
export type PublishedPricingData = Awaited<ReturnType<typeof getPublishedPricing>>;
export type PublishedFAQsData = Awaited<ReturnType<typeof getPublishedFAQs>>;