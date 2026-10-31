import { Metadata } from 'next';
import ContactPageClient, { SiteSettingsContactInfo } from './ContactPageClient';
import { prisma } from '@/lib/db';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await prisma.sEO.findUnique({ where: { pageIdentifier: 'CONTACT' } });
    const settings = await prisma.siteSettings.findFirst();

    return {
      title: seo?.title || `Initiate Dialogue — ${settings?.siteName || 'CRE8TIVECOVE'}`,
      description: seo?.description || 'Get in touch with Cre8tiveCove for commercial direction, web engineering, brand strategy, and high-impact digital experiences.',
      openGraph: {
        title: seo?.ogTitle || seo?.title || 'Initiate Dialogue — CRE8TIVECOVE',
        description: seo?.ogDescription || seo?.description || undefined,
        images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
      },
    };
  } catch {
    return {
      title: 'Initiate Dialogue — CRE8TIVECOVE',
      description: 'Get in touch with Cre8tiveCove for commercial direction, web engineering, brand strategy, and high-impact digital experiences.',
    };
  }
}

export default async function ContactPage() {
  let siteSettings: SiteSettingsContactInfo | null = null;
  try {
    siteSettings = await prisma.siteSettings.findFirst({
      select: {
        email: true,
        phone: true,
        address: true,
        siteName: true,
      },
    });
  } catch {
    console.warn('[CMS CONTACT]: Server fetch fallback triggered');
  }

  return <ContactPageClient siteSettings={siteSettings} />;
}