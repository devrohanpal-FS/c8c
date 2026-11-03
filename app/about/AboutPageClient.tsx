'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, Sparkles, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import PageWrapper from '@/components/PageWrapper';
import SectionWrapper from '@/components/SectionWrapper';
import ClientLogosSection, { ClientItem } from '@/app/ClientLogosSection';
import { parseVideoUrl } from '@/lib/utils';
import type { SiteSettings } from '@prisma/client';
import './About.css';

const statsData = [
  { value: '23 years', label: 'IN BUSINESS' },
  { value: '100+ Clients', label: 'WORLDWIDE' },
  { value: '200+ Awards', label: 'CREATIVE EXCELLENCE' },
  { value: '300+ Productions', label: 'COMPLETED FILMS' },
];

export interface AboutPageData {
  heroTitle?: string | null;
  heroContent?: string | null;
  backgroundUrl?: string | null;
  missionTitle?: string | null;
  missionBody?: string | null;
  companyStory?: string | null;
  historyBody?: string | null;
  credentials?: string | string[] | null;
  certifications?: string | string[] | null;
  ctaHeading?: string | null;
  ctaButtonText?: string | null;
  ctaButtonUrl?: string | null;
}

export interface AboutPageClientProps {
  cmsAbout?: AboutPageData | null;
  clients?: ClientItem[];
  siteSettings?: SiteSettings | null;
}

export default function AboutPageClient({ cmsAbout, clients, siteSettings }: AboutPageClientProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);

  const heroCardRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const reelVideoUrl = cmsAbout?.backgroundUrl || 'https://vjs.zencdn.net/v/oceans.mp4';
  const parsedVideo = parseVideoUrl(reelVideoUrl);
  const heroTitleText = cmsAbout?.heroTitle || 'WEIRD ENERGY SINCE Y2K';
  const companyStoryText = cmsAbout?.companyStory || 'Cre8tiveCove (C8C) was founded in 2000, on a commitment to create commercials and digital experiences that move people.';
  const historyBodyText = cmsAbout?.historyBody || 'Over the years, we’ve distinguished ourselves by our ability to capture deeply emotional performances and craft high-end visual identity systems.';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current || !heroBadgeRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    gsap.to(heroBadgeRef.current, {
      x: x * 0.65,
      y: y * 0.65,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!heroBadgeRef.current) return;
    gsap.to(heroBadgeRef.current, {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    });
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          '.about-hero-text',
          { opacity: 0, y: 50, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.15 }
        );

        tl.fromTo(
          '.about-hero-card',
          { opacity: 0, y: 60, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          '-=0.5'
        );
      }


      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 18,
          ease: 'none',
        });
      }


      const missionEl = document.getElementById('ourmission');
      const writeupEl = document.getElementById('writeup');

      if (missionEl && writeupEl) {
        const missionBgText = missionEl.querySelectorAll('.mission-background-text');
        const missionFgTexts = missionEl.querySelectorAll('.mission-fg-text');
        const writeupFgTexts = writeupEl.querySelectorAll('.writeup-fg-text, .writeup-card-text');

        const blackStateTl = gsap.timeline({
          scrollTrigger: {
            trigger: missionEl,
            start: '50% top',
            toggleActions: 'play none none reverse',
          },
        });

        blackStateTl
          .to(
            [missionEl, writeupEl],
            {
              backgroundColor: '#000000',
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0
          )
          .to(
            [missionFgTexts, writeupFgTexts],
            {
              color: '#f5f0e6',
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0
          )
          .to(
            missionBgText,
            {
              color: '#5f5e5a',
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0
          );
      }
    },
    { scope: containerRef }
  );

  return (
    <PageWrapper>
      <div ref={containerRef} className="about-page w-full">
        { }
        <SectionWrapper
          id="abouthead"
          bgColor="orange"
          textColor="obsidian"
          fullWidth
          animateIn={false}
          className="pt-36 pb-24 px-6 md:px-12 flex flex-col items-center justify-between min-h-[92vh]"
        >
          { }
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a] text-[#f5f0e6] text-xs font-mono uppercase tracking-widest mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" /> ABOUT CRE8TIVECOVE
          </div>

          { }
          <div style={{ zIndex: '9' }} className="max-w-7xl mx-auto text-center flex flex-col items-center relative z-10">
            <h1 className="about-hero-text font-condensed text-[12vw] sm:text-[14vw] lg:text-[8vw] font-black uppercase text-[#ffd700] leading-[1.2] tracking-normal drop-shadow-[0_10px_35px_rgba(0,0,0,0.3)] select-none">
              {heroTitleText}
            </h1>
          </div>

          { }
          <div
            ref={heroCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ marginTop: '-5em', zIndex: '1' }}
            className="about-hero-card relative z-20 w-full max-w-7xl mx-auto aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden bg-black shadow-[0_30px_70px_rgba(0,0,0,0.5)] my-12 flex items-center justify-center cursor-pointer group"
          >
            {parsedVideo.type === 'youtube' && parsedVideo.youtubeId ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${parsedVideo.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${parsedVideo.youtubeId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1`}
                  title="About Hero Background Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] object-cover pointer-events-none opacity-85 scale-110"
                />
              </div>
            ) : parsedVideo.type === 'vimeo' && parsedVideo.vimeoId ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <iframe
                  src={`https://player.vimeo.com/video/${parsedVideo.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                  title="About Hero Background Video"
                  allow="autoplay; fullscreen"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] object-cover pointer-events-none opacity-85"
                />
              </div>
            ) : (
              <video
                src={parsedVideo.embedUrl || reelVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

            <div
              ref={heroBadgeRef}
              onClick={() => setIsVideoModalOpen(true)}
              className="relative z-20 flex items-center justify-center cursor-pointer select-none transition-transform will-change-transform"
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 animate-spin-slow pointer-events-none">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-white fill-current font-mono font-bold uppercase tracking-[0.18em] drop-shadow-md"
                  style={{ fontSize: '8.5px' }}
                >
                  <path
                    id="aboutCirclePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text fill="#ffffff" style={{ fontSize: '8.5px', fontWeight: 'bold' }}>
                    <textPath href="#aboutCirclePath" startOffset="0%">
                      IT&apos;S ABOUT TO GET REAL WEIRD HERE • IT&apos;S ABOUT TO GET REAL WEIRD HERE •&nbsp;
                    </textPath>
                  </text>
                </svg>
              </div>

              <button
                aria-label="Play Reel Video"
                className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#0a0a0a] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-[#ffd700]"
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
              </button>
            </div>
          </div>
        </SectionWrapper>

        { }
        <SectionWrapper
          id="ourmission"
          bgColor="cream"
          textColor="obsidian"
          className="min-h-screen flex flex-col justify-center items-center overflow-hidden !transition-none"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <span className="mission-background-text font-condensed text-[30vw] font-black uppercase text-[#ebe9df] leading-none whitespace-nowrap !transition-none">
              OUR <br /> MISSION
            </span>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col gap-6 font-serif italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            <p className="mission-fg-text self-start text-left sm:translate-x-8 text-[#000000] !transition-none">
              Be brave enough to ask...
            </p>
            <p className="mission-fg-text self-end text-right text-4xl sm:text-6xl md:text-7xl font-normal sm:-translate-x-12 text-[#000000] !transition-none">
              will this work
            </p>
            <p className="mission-fg-text self-center text-center text-4xl sm:text-6xl md:text-7xl font-semibold text-[#e8813a] !transition-none">
              make a difference?
            </p>
          </div>
        </SectionWrapper>

        { }
        <SectionWrapper id="writeup" bgColor="cream" textColor="obsidian" className="py-32 px-6 md:px-12 !transition-none">
          <div className="max-w-6xl mx-auto m-0">
            { }
            <h2 className="writeup-fg-text font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.1] text-[#000000] mb-20 max-w-6xl tracking-tight !transition-none">
              {cmsAbout?.missionTitle || 'We’ve been around long enough to realize real life is funnier than anything you can make up.'}
            </h2>

            { }
            <div className="max-w-5xl space-y-12 font-sans text-xl sm:text-2xl md:text-3xl font-light leading-relaxed">
              <p className="writeup-fg-text text-[#000000]/90 !transition-none">
                {companyStoryText}
              </p>

              <p className="writeup-fg-text text-[#000000]/90 !transition-none">
                {historyBodyText}
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* FEATURED CLIENTS - DYNAMIC TICKER SLIDER FROM BACKEND ADMIN */}
        <div id="clients-section" className="relative w-full">
          <ClientLogosSection clientList={clients} />
        </div>

        { }
        <section id="stats" className="relative py-32 px-6 md:px-12 bg-[#ffd700] text-[#0a0a0a] overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col">
            <span className="font-condensed text-xl sm:text-2xl uppercase tracking-wider text-[#0a0a0a] font-extrabold block mb-16">
              BY THE NUMBERS
            </span>

            { }
            <div className="flex flex-col">
              {statsData.map((stat, idx) => (
                <div
                  key={idx}
                  className="py-10 border-b border-[#0a0a0a]/25 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 group"
                >
                  <h3 className="font-serif text-6xl sm:text-8xl md:text-9xl font-light text-[#0a0a0a] tracking-tight group-hover:translate-x-4 transition-transform duration-500">
                    {stat.value}
                  </h3>
                  <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#0a0a0a]/70">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          { }
          <div className="w-full overflow-hidden whitespace-nowrap mt-28 pt-8 border-t border-[#0a0a0a]/20">
            <Link href="/contact" className="block group cursor-pointer" aria-label="Let's talk about a project - Contact Us">
              <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
                <span className="font-condensed text-[12vw] sm:text-[14vw] font-black uppercase tracking-wider leading-none text-[#0a0a0a] group-hover:text-white transition-colors duration-300 pr-12">
                  ABOUT A PROJECT • LET’S TALK ABOUT A PROJECT • LET’S TALK •&nbsp;
                </span>
                <span className="font-condensed text-[12vw] sm:text-[14vw] font-black uppercase tracking-wider leading-none text-[#0a0a0a] group-hover:text-white transition-colors duration-300 pr-12">
                  ABOUT A PROJECT • LET’S TALK ABOUT A PROJECT • LET’S TALK •&nbsp;
                </span>
              </div>
            </Link>
          </div>
        </section>



        { }
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-8 right-8 z-10 p-3 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              {parsedVideo.type === 'youtube' && parsedVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${parsedVideo.youtubeId}?autoplay=1&controls=1&rel=0`}
                  title="About Showreel Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : parsedVideo.type === 'vimeo' && parsedVideo.vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${parsedVideo.vimeoId}?autoplay=1&controls=1`}
                  title="About Showreel Video"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  src={parsedVideo.embedUrl || reelVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}