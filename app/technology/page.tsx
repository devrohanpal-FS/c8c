import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import TechnologyPageClient from './TechnologyPageClient';

export const revalidate = 300; // Incremental Static Regeneration (5 minutes)

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return {
      title: `Technology Services & AI Solutions — ${settings?.siteName || 'CRE8TIVECOVE'}`,
      description: 'Explore Cre8tiveCove technology services in Web Development, Mobile Apps, AI Solutions, Autonomous AI Agents, WhatsApp Automation, and 360° Virtual Tours.',
      openGraph: {
        title: 'Technology Services & AI Solutions — CRE8TIVECOVE',
        description: 'Explore Cre8tiveCove technology capabilities in full-stack engineering, generative AI, and workflow automation.',
      },
    };
  } catch {
    return {
      title: 'Technology Services & AI Solutions — CRE8TIVECOVE',
      description: 'Explore Cre8tiveCove technology services in Web Development, Mobile Apps, AI Solutions, Autonomous AI Agents, and 360° Virtual Tours.',
    };
  }
}

export default async function TechnologyPage() {
  let techServices: any[] = [];
  let siteSettings: any = null;

  try {
    const [servicesData, settings] = await Promise.all([
      prisma.service.findMany({
        where: { active: true, status: 'PUBLISHED', deletedAt: null, category: 'TECHNOLOGY' },
        orderBy: { order: 'asc' },
      }),
      prisma.siteSettings.findFirst(),
    ]);

    techServices = servicesData;
    siteSettings = settings;
  } catch (err) {
    console.warn('[TECHNOLOGY SERVICES]: DB fetch fallback triggered');
  }

  return (
    <TechnologyPageClient
      initialServices={techServices.length > 0 ? techServices : undefined}
      siteSettings={siteSettings}
    />
  );
}
