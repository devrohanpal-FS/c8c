'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import HeroBannerSlider, { HeroSlideData } from '@/components/HeroBannerSlider';
import type { HomePageData } from '@/app/HomePageClient';

interface HeroSectionProps {
  cmsContent?: HomePageData | null;
  heroSlides?: HeroSlideData[];
}

export default function HeroSection({ cmsContent, heroSlides }: HeroSectionProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineContainerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);

  const headlineText = cmsContent?.heroSubtitle || 'Featured Work';

  useGSAP(
    () => {
      if (!headlineContainerRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headlineContainerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      if (line1Ref.current) {
        tl.fromTo(
          line1Ref.current,
          {
            opacity: 0,
            y: 45,
            scale: 0.98,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative w-full bg-transparent text-inherit font-sans overflow-hidden">
      {/* 1. Best-in-class Hero Banner Slider */}
      <div className="relative w-full overflow-hidden">
        <HeroBannerSlider slides={heroSlides} autoPlayInterval={5000} />
      </div>

      {/* 2. Main Headline ("Featured Work") */}
      <div
        id="heading-section"
        ref={headlineContainerRef}
        className="max-w-6xl mx-auto text-center flex flex-col items-center pt-24 pb-14 px-6 md:px-12 will-change-transform"
      >
        <h2 className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.08] tracking-normal text-[#f5f0e6] max-w-5xl flex flex-col gap-3">
          <div ref={line1Ref} className="block whitespace-pre-line theme-text-target will-change-transform">
            {headlineText}
          </div>
        </h2>
      </div>

      {/* 3. Featured Work Sub-header Divider */}
      <div className="w-full max-w-[1600px] mx-auto pb-12 px-6 md:px-12">
        <div className="pt-8 border-t border-white/15 theme-border-target flex flex-row items-center justify-between gap-4">
          <span className="font-condensed text-xl sm:text-2xl uppercase tracking-wider text-[#f5f0e6] theme-text-target font-extrabold">
            SELECTED PROJECTS
          </span>
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest hidden sm:inline">
            CREATIVE DIRECTION & FILMS
          </span>
        </div>
      </div>
    </section>
  );
}