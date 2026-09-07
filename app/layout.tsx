import type { Metadata } from 'next';
import './globals.css';
import LenisProvider from '@/components/LenisProvider';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export const metadata: Metadata = {
  title: 'C8C (Cre8tiveCove) — Award-Winning Full-Stack Creative Agency',
  description:
    'C8C (Cre8tiveCove) is an elite creative agency engineering interactive 3D web experiences, motion direction, digital cinematography, and kinetic branding.',
  keywords: [
    'Cre8tiveCove',
    'C8C',
    'Creative Agency',
    'Next.js 14',
    'GSAP Animations',
    '3D WebGL',
    'Luxury Branding',
    'Motion Design',
  ],
  authors: [{ name: 'C8C Cre8tiveCove' }],
  openGraph: {
    title: 'C8C (Cre8tiveCove) — We Craft The Unseen',
    description:
      'Elite creative agency specializing in interactive 3D web experiences, motion direction, and digital luxury.',
    url: 'https://c8c.agency',
    siteName: 'C8C Cre8tiveCove',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'C8C Cre8tiveCove Showcase',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-['Outfit'] antialiased">
        <SessionProviderWrapper>
          <LenisProvider>{children}</LenisProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
