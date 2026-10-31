
import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';
import { prisma } from '@/lib/db';

export const revalidate = 60;

const DEFAULT_TITLE = 'About Us — CRE8TIVECOVE';
const DEFAULT_DESCRIPTION =
  'Learn about Cre8tiveCove ethos, culture, storytelling heritage, and cinematic finishing.';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [seo, settings] = await Promise.all([
      prisma.sEO.findUnique({
        where: { pageIdentifier: 'ABOUT' },
        select: {
          title: true,
          description: true,
          ogTitle: true,
          ogDescription: true,
          ogImage: true,
        },
      }),
      prisma.siteSettings.findFirst({
        select: { siteName: true },
      }),
    ]);

    return {
      title:
        seo?.title ||
        `About Us — ${settings?.siteName || 'CRE8TIVECOVE'}`,
      description: seo?.description || DEFAULT_DESCRIPTION,
      openGraph: {
        title: seo?.ogTitle || seo?.title || DEFAULT_TITLE,
        description:
          seo?.ogDescription || seo?.description || undefined,
        images: seo?.ogImage
          ? [{ url: seo.ogImage }]
          : undefined,
      },
    };
  } catch {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    };
  }
}

export default async function AboutPage() {
  try {
    const [cmsAbout, clientList, siteSettings] = await Promise.all([
      prisma.aboutPage.findFirst({
        select: {
          heroTitle: true,
          heroContent: true,
          backgroundUrl: true,
          missionTitle: true,
          missionBody: true,
          companyStory: true,
          historyBody: true,
          credentials: true,
          certifications: true,
          ctaHeading: true,
          ctaButtonText: true,
          ctaButtonUrl: true,
        },
      }),
      prisma.client.findMany({
        where: {
          active: true,
          deletedAt: null,
        },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          name: true,
          logo: true,
          website: true,
          featured: true,
        },
      }),
      prisma.siteSettings.findFirst(),
    ]);

    const clients = clientList.map((client) => ({
      id: client.id,
      name: client.name,
      logo: client.logo,
      website: client.website,
      featured: client.featured,
    }));

    return (
      <AboutPageClient
        cmsAbout={cmsAbout}
        clients={clients}
        siteSettings={siteSettings}
      />
    );
  } catch {
    console.warn('[CMS ABOUT]: Server fetch fallback triggered');

    return (
      <AboutPageClient
        cmsAbout={null}
        clients={[]}
        siteSettings={null}
      />
    );
  }
}
