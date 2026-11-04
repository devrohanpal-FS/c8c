import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getServiceDetailBySlug } from '@/lib/data/serviceDetails';
import ServiceDetailClient from './ServiceDetailClient';
import type { Service } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const fallback = getServiceDetailBySlug(slug);

  try {
    const dbService = await prisma.service.findFirst({
      where: { slug, deletedAt: null },
      include: { seo: true },
    });

    const settings = await prisma.siteSettings.findFirst();
    const siteName = settings?.siteName || 'CRE8TIVECOVE';

    const title = dbService?.seo?.title || (dbService ? `${dbService.title} — Capabilities & Services | ${siteName}` : fallback ? `${fallback.title} — Capabilities | ${siteName}` : `Service — ${siteName}`);
    const description = dbService?.seo?.description || dbService?.description || fallback?.overview || 'Explore Cre8tiveCove capabilities and creative services.';

    return {
      title,
      description,
      openGraph: {
        title: dbService?.seo?.ogTitle || title,
        description: dbService?.seo?.ogDescription || description,
        images: dbService?.seo?.ogImage || dbService?.image ? [{ url: dbService?.seo?.ogImage || dbService?.image || '' }] : undefined,
      },
    };
  } catch {
    const title = fallback ? `${fallback.title} — Capabilities | CRE8TIVECOVE` : 'Capabilities — CRE8TIVECOVE';
    return {
      title,
      description: fallback?.overview || 'Explore Cre8tiveCove capabilities and creative services.',
    };
  }
}

export default async function ServiceSinglePage({ params }: ServicePageProps) {
  const { slug } = await params;
  let initialDbService: Service | null = null;

  try {
    initialDbService = await prisma.service.findFirst({
      where: { slug, deletedAt: null },
    });
  } catch (err) {
    console.warn('[SERVICE DETAIL]: DB fetch fallback triggered');
  }

  return <ServiceDetailClient key={slug} slug={slug} initialDbService={initialDbService} />;
}
