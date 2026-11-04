import { Metadata } from 'next';
import WorkDetailClient from './WorkDetailClient';
import { getPublishedWorkBySlug } from '@/lib/services/publicContentService';
import { prisma } from '@/lib/db';

export const revalidate = 300; // Incremental Static Regeneration (5 minutes)

interface WorkSinglePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WorkSinglePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const work = await prisma.work.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { seo: true },
    });

    const settings = await prisma.siteSettings.findFirst();
    const siteName = settings?.siteName || 'CRE8TIVECOVE';

    if (work) {
      const title = work.seo?.title || `${work.title} — Case Study | ${siteName}`;
      const description = work.seo?.description || work.description || 'Commercial creative case study.';
      const ogImage = work.seo?.ogImage || work.heroMedia || work.thumbnailUrl;

      return {
        title,
        description,
        openGraph: {
          title: work.seo?.ogTitle || title,
          description: work.seo?.ogDescription || description,
          images: ogImage ? [{ url: ogImage }] : undefined,
        },
      };
    }
  } catch {
    // Fallback to slug title
  }

  const fallbackTitle = slug.replace(/-/g, ' ').toUpperCase();
  return {
    title: `${fallbackTitle} — Case Study | CRE8TIVECOVE`,
    description: `Detailed case study overview and creative direction breakdown for ${fallbackTitle}.`,
  };
}

export default async function WorkSinglePage({ params }: WorkSinglePageProps) {
  const { slug } = await params;
  let initialWork: Awaited<ReturnType<typeof getPublishedWorkBySlug>> = null;

  try {
    initialWork = await getPublishedWorkBySlug(slug);
  } catch {
    // Fallback handled on client
  }

  return <WorkDetailClient key={slug} slug={slug} initialWork={initialWork} />;
}
