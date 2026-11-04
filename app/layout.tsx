import type { Metadata } from 'next';
import { Playfair_Display, Anton, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fontSerif = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const fontCondensed = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-condensed',
});

const fontSans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'C8C (Cre8tiveCove) — Creative Agency Platform',
  description:
    'Award-winning creative agency platform engineered with Next.js 16, GSAP, Lenis, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontCondensed.variable} ${fontSans.variable}`}
    >
      <head>
        <link
          rel="preload"
          href="/fonts/bueno.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f0e6] font-sans antialiased selection:bg-[#ffd700] selection:text-[#0a0a0a]">
        <SmoothScrollProvider>
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}