'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

import PageWrapper from '@/components/PageWrapper';
import HeroSection from './HeroSection';
import FeaturedWorkGrid from './FeaturedWorkGrid';
import MarqueeStrip from './MarqueeStrip';
import ImageCollageStrip from './ImageCollageStrip';
import ClientLogosSection from './ClientLogosSection';
import './Home.css';

export interface ThemeConfig {
  name: string;
  background: string;
  text: string;
  subtext: string;
  border: string;
}

export const THEME_REGISTRY: Record<string, ThemeConfig> = {
  dark: {
    name: 'dark',
    background: 'rgb(0, 0, 0)',
    text: 'rgb(245, 240, 230)',
    subtext: 'rgba(245, 240, 230, 0.6)',
    border: 'rgba(255, 255, 255, 0.15)',
  },
  cream: {
    name: 'cream',
    background: 'rgb(245, 240, 230)',
    text: 'rgb(10, 10, 10)',
    subtext: 'rgba(10, 10, 10, 0.6)',
    border: 'rgba(10, 10, 10, 0.15)',
  },
};

export interface HomePageClientProps {
  cmsContent?: any;
  featuredWorks?: any[];
  collageItems?: any[];
  clients?: any[];
  siteSettings?: any;
  heroSlides?: any[];
}

export default function HomePageClient({
  cmsContent,
  featuredWorks,
  collageItems,
  clients,
  siteSettings,
  heroSlides,
}: HomePageClientProps = {}) {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heroEl = document.getElementById('hero-section');
      const headingEl = document.getElementById('heading-section') || document.getElementById('heding-section');
      const workEl = document.getElementById('work-section');

      if (heroEl && (headingEl || workEl)) {
        const targetSurfaces = [heroEl, headingEl, workEl].filter(Boolean);

        const applyTheme = (theme: ThemeConfig) => {
          gsap.to(targetSurfaces, {
            backgroundColor: theme.background,
            color: theme.text,
            duration: 0.8,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });

          const themeTexts = pageRef.current?.querySelectorAll('.theme-text-target');
          if (themeTexts && themeTexts.length > 0) {
            gsap.to(themeTexts, {
              color: theme.text,
              duration: 0.8,
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          }

          const themeSubtexts = pageRef.current?.querySelectorAll('.theme-subtext-target');
          if (themeSubtexts && themeSubtexts.length > 0) {
            gsap.to(themeSubtexts, {
              color: theme.subtext,
              duration: 0.8,
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          }

          const themeBorders = pageRef.current?.querySelectorAll('.theme-border-target');
          if (themeBorders && themeBorders.length > 0) {
            gsap.to(themeBorders, {
              borderColor: theme.border,
              duration: 0.8,
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          }
        };

        ScrollTrigger.create({
          trigger: heroEl,
          start: '50% top',
          onEnter: () => applyTheme(THEME_REGISTRY.cream),
          onLeaveBack: () => applyTheme(THEME_REGISTRY.dark),
        });
      }
    },
    { scope: pageRef }
  );

  return (
    <PageWrapper>
      <div ref={pageRef} className="home-page relative w-full bg-[#0a0a0a]">
        <div id="hero-section" className="relative w-full bg-[#0a0a0a]">
          <HeroSection cmsContent={cmsContent} heroSlides={heroSlides} />
        </div>

        <div id="work-section" className="relative w-full">
          <FeaturedWorkGrid projects={featuredWorks} />
          <MarqueeStrip text={cmsContent?.marqueeText} active={cmsContent?.marqueeActive} />
          <ImageCollageStrip
            items={collageItems}
            cultureTag={cmsContent?.cultureTag}
            cultureTitle={cmsContent?.cultureTitle}
          />
        </div>

        <div id="clients-section" className="relative w-full">
          <ClientLogosSection clientList={clients} />
        </div>
      </div>
    </PageWrapper>
  );
}