import { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';
import { prisma } from '@/lib/db';

export const revalidate = 300; // Incremental Static Regeneration (5 minutes)

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await prisma.sEO.findUnique({ where: { pageIdentifier: 'SERVICES' } });
    const settings = await prisma.siteSettings.findFirst();

    return {
      title: seo?.title || `Capabilities & Services — ${settings?.siteName || 'CRE8TIVECOVE'}`,
      description: seo?.description || 'Explore Cre8tiveCove capabilities in commercial direction, 3D WebGL motion, brand strategy, and post-production.',
      openGraph: {
        title: seo?.ogTitle || seo?.title || 'Capabilities & Services — CRE8TIVECOVE',
        description: seo?.ogDescription || seo?.description || undefined,
        images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
      },
    };
  } catch {
    return {
      title: 'Capabilities & Services — CRE8TIVECOVE',
      description: 'Explore Cre8tiveCove capabilities in commercial direction, 3D WebGL motion, brand strategy, and post-production.',
    };
  }
}

export default async function ServicesPage() {
  let cmsServices: any[] = [];
  let processSteps: any[] = [];
  let testimonials: any[] = [];
  let clients: any[] = [];
  let siteSettings: any = null;

  try {
    const [servicesData, steps, testimonialList, clientList, settings] = await Promise.all([
      prisma.service.findMany({
        where: { active: true, status: 'PUBLISHED', deletedAt: null },
        orderBy: { order: 'asc' },
      }),
      prisma.processStep.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      }),
      prisma.testimonial.findMany({
        where: { active: true, status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
      }),
      prisma.client.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { order: 'asc' },
      }),
      prisma.siteSettings.findFirst(),
    ]);

    cmsServices = servicesData.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      desc: s.description,
      fullDesc: s.fullDescription,
      image: s.image,
      video: s.hoverVideo,
    }));

    processSteps = steps.map((p) => ({
      number: p.stepNumber,
      title: p.title,
      description: p.description,
    }));

    testimonials = testimonialList.map((t) => ({
      id: t.id,
      name: t.name,
      designation: t.designation,
      company: t.company,
      quote: t.quote,
      avatar: t.avatar,
    }));

    clients = clientList.map((c) => ({
      id: c.id,
      name: c.name,
      logo: c.logo,
      website: c.website,
    }));
    siteSettings = settings;
  } catch (err) {
    console.warn('[CMS SERVICES]: Server fetch fallback triggered');
  }

  return (
    <ServicesPageClient
      initialServices={cmsServices.length > 0 ? cmsServices : undefined}
      processSteps={processSteps.length > 0 ? processSteps : undefined}
      testimonials={testimonials}
      clients={clients}
      siteSettings={siteSettings}
    />
  );
}