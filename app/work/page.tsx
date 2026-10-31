import { Metadata } from 'next';
import WorkPageClient from './WorkPageClient';
import { WorkService } from '@/lib/services/workService';
import { prisma } from '@/lib/db';

export const revalidate = 300; // Incremental Static Regeneration (5 minutes)

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await prisma.sEO.findUnique({ where: { pageIdentifier: 'WORK' } });
    const settings = await prisma.siteSettings.findFirst();

    return {
      title: seo?.title || `Selected Work — ${settings?.siteName || 'CRE8TIVECOVE'}`,
      description: seo?.description || 'Explore Cre8tiveCove archive of commercial direction, brand identity, and WebGL case studies.',
      openGraph: {
        title: seo?.ogTitle || seo?.title || 'Selected Work — CRE8TIVECOVE',
        description: seo?.ogDescription || seo?.description || undefined,
        images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
      },
    };
  } catch {
    return {
      title: 'Selected Work — CRE8TIVECOVE',
      description: 'Explore Cre8tiveCove archive of commercial direction, brand identity, and WebGL case studies.',
    };
  }
}

export default async function WorkPage() {
  let cmsWorks: any[] = [];
  try {
    const data = await WorkService.getAllWorks({ publishedOnly: true });
    cmsWorks = data.map((w) => ({
      id: w.id,
      title: w.title,
      slug: w.slug,
      client: w.client,
      category: w.category,
      year: w.year,
      desc: w.description,
      media: w.heroMedia || w.thumbnailUrl,
      videoUrl: w.heroVideoUrl || w.projectVideoUrl,
      featured: Boolean(w.featured),
    }));
  } catch (err) {
    console.warn('[CMS WORK]: Server fetch fallback triggered');
  }

  return <WorkPageClient initialWorks={cmsWorks.length > 0 ? cmsWorks : undefined} />;
}