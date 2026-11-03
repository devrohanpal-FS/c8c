import HomePageClient, { HomePageData } from './HomePageClient';
import { prisma } from '@/lib/db';
import { Metadata } from 'next';
import type { SiteSettings } from '@prisma/client';
import type { HeroSlideData } from '@/components/HeroBannerSlider';
import type { WorkProject } from '@/components/WorkCard';
import type { CultureSlideItem } from '@/app/ImageCollageStrip';
import type { ClientItem } from '@/app/ClientLogosSection';

export const revalidate = 300; // Incremental Static Regeneration (5 minutes) with on-demand CMS revalidation

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await prisma.sEO.findUnique({ where: { pageIdentifier: 'HOME' } });
    const settings = await prisma.siteSettings.findFirst();

    return {
      title: seo?.title || settings?.defaultSeoTitle || 'CRE8TIVECOVE — Creative & Digital Agency',
      description: seo?.description || settings?.defaultSeoDesc || 'We make people feel something. Strategy, Creative Direction, Digital Experiences.',
      openGraph: {
        title: seo?.ogTitle || seo?.title || settings?.defaultSeoTitle || 'CRE8TIVECOVE',
        description: seo?.ogDescription || seo?.description || settings?.defaultSeoDesc || undefined,
        images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
      },
    };
  } catch {
    return {
      title: 'CRE8TIVECOVE — Creative & Digital Agency',
      description: 'We make people feel something. Strategy, Creative Direction, Digital Experiences.',
    };
  }
}

export default async function HomePage() {
  let homeContent: HomePageData | null = null;
  let featuredWorks: WorkProject[] = [];
  let collageItems: CultureSlideItem[] = [];
  let clients: ClientItem[] = [];
  let siteSettings: SiteSettings | null = null;
  let heroSlides: HeroSlideData[] = [];

  try {
    const [data, works, collage, clientData, settings, slidesData] = await Promise.all([
      prisma.homePage.findFirst(),
      prisma.work.findMany({
        where: { featured: true, status: 'PUBLISHED', deletedAt: null },
        include: { gallery: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
        take: 6,
      }),
      prisma.homeCollageItem.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      }),
      prisma.client.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { order: 'asc' },
      }),
      prisma.siteSettings.findFirst(),
      prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      }),
    ]);

    if (slidesData && slidesData.length > 0) {
      heroSlides = slidesData.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle || undefined,
        tagline: s.tagline || undefined,
        mediaUrl: s.mediaUrl,
        mediaType: s.mediaType as 'IMAGE' | 'VIDEO',
        ctaText: s.ctaText || undefined,
        ctaUrl: s.ctaUrl || undefined,
        secondaryCtaText: s.secondaryCtaText || undefined,
        secondaryCtaUrl: s.secondaryCtaUrl || undefined,
      }));
    }

    if (data) {
      homeContent = {
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroVideoUrl: data.heroVideoUrl,
        heroPosterUrl: data.heroPosterUrl,
        heroCtaText: data.heroCtaText,
        heroCtaUrl: data.heroCtaUrl,
        marqueeText: data.marqueeText,
        marqueeActive: data.marqueeActive,
        ctaHeading: data.ctaHeading,
        ctaDescription: data.ctaDescription,
        ctaButtonText: data.ctaButtonText,
        ctaButtonUrl: data.ctaButtonUrl,
        cultureTag: data.cultureTag || 'THE CULTURE',
        cultureTitle: data.cultureTitle || 'BEHIND THE LENS BEYOND THE STORY',
      };
    }

    featuredWorks = works.map((w) => {
      const galleryVideo = w.gallery && w.gallery.length > 0 ? w.gallery[0].mediaUrl : null;
      const vUrl = w.heroVideoUrl || w.projectVideoUrl || galleryVideo || 'https://vjs.zencdn.net/v/oceans.mp4';
      return {
        id: w.id,
        title: w.title,
        client: w.client,
        category: w.category,
        thumbnailUrl: w.thumbnailUrl || w.heroMedia || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        videoUrl: vUrl,
        slug: w.slug,
      };
    });

    collageItems = collage.map((c) => ({
      id: c.id,
      title: c.title || '',
      subtitle: c.subtitle || '',
      badge: c.badge || 'BTS',
      buttonText: c.buttonText || 'View Photo',
      linkUrl: c.linkUrl || c.mediaUrl,
      mediaUrl: c.mediaUrl,
    }));

    clients = clientData.map((cl) => ({
      id: cl.id,
      name: cl.name,
      logo: cl.logo,
      website: cl.website,
    }));
    siteSettings = settings;
  } catch (err) {
    console.warn('[CMS HOME]: Server fetch fallback triggered');
  }

  return (
    <HomePageClient
      cmsContent={homeContent}
      featuredWorks={featuredWorks}
      collageItems={collageItems}
      clients={clients}
      siteSettings={siteSettings}
      heroSlides={heroSlides}
    />
  );
}

