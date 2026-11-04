'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Layers,
  Zap,
  Clock,
  Check,
  ChevronRight,
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import CuboidMarquee from '@/components/CuboidMarquee';
import {
  getServiceDetailBySlug,
  ServiceDetailData,
} from '@/lib/data/serviceDetails';
import { useScrollColorMorph } from '@/lib/hooks/useScrollColorMorph';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import { parseVideoUrl } from '@/lib/utils';
import '../Services.css';

function SafeServiceImage({
  src,
  alt,
  className,
  fallback = '/images/stock/stock-service.jpg',
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <Image
      src={imgSrc || fallback}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
}

import type { Service } from '@prisma/client';

export interface ServiceDetailClientProps {
  slug: string;
  initialDbService?: Service | null;
}

export default function ServiceDetailClient({
  slug,
  initialDbService,
}: ServiceDetailClientProps) {
  const [service, setService] = useState<ServiceDetailData | null>(() => {
    const fallback = getServiceDetailBySlug(slug);
    if (initialDbService && fallback) {
      return {
        ...fallback,
        title: initialDbService.title || fallback.title,
        overview: initialDbService.description || fallback.overview,
        tagline: initialDbService.description || fallback.tagline,
        heroVideo: initialDbService.hoverVideo || fallback.heroVideo,
        heroImage: initialDbService.image || fallback.heroImage,
        fullOverviewParagraphs: initialDbService.fullDescription
          ? [initialDbService.fullDescription, ...fallback.fullOverviewParagraphs.slice(1)]
          : fallback.fullOverviewParagraphs,
      };
    }
    return fallback;
  });

  const [loading, setLoading] = useState(!service);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useScrollColorMorph();
  useScrollReveal();

  useEffect(() => {
    // Reset video playback state on slug change
    setIsPlaying(false);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        // Ignore errors on unmounting elements
      }
    }

    const fallback = getServiceDetailBySlug(slug);

    if (initialDbService && fallback) {
      setService({
        ...fallback,
        title: initialDbService.title || fallback.title,
        overview: initialDbService.description || fallback.overview,
        tagline: initialDbService.description || fallback.tagline,
        heroVideo: initialDbService.hoverVideo || fallback.heroVideo,
        heroImage: initialDbService.image || fallback.heroImage,
        fullOverviewParagraphs: initialDbService.fullDescription
          ? [initialDbService.fullDescription, ...fallback.fullOverviewParagraphs.slice(1)]
          : fallback.fullOverviewParagraphs,
      });
      setLoading(false);
      return;
    }

    fetch(`/api/public/services/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found in DB');
        return res.json();
      })
      .then((data) => {
        if (data.service && fallback) {
          const db = data.service;
          setService({
            ...fallback,
            title: db.title || fallback.title,
            overview: db.description || fallback.overview,
            tagline: db.description || fallback.tagline,
            heroVideo: db.hoverVideo || fallback.heroVideo,
            heroImage: db.image || fallback.heroImage,
            fullOverviewParagraphs: db.fullDescription
              ? [db.fullDescription, ...fallback.fullOverviewParagraphs.slice(1)]
              : fallback.fullOverviewParagraphs,
          });
        } else if (fallback) {
          setService(fallback);
        }
      })
      .catch(() => {
        if (fallback) setService(fallback);
      })
      .finally(() => setLoading(false));
  }, [slug, initialDbService]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  if (loading && !service) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#f5f0e6] text-[#0a0a0a] flex items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            <p className="font-mono text-xs uppercase tracking-widest text-black/60">Loading Capability...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!service) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#f5f0e6] text-[#0a0a0a] pt-36 pb-32 px-6 flex flex-col items-center justify-center text-center">
          <span className="px-4 py-1.5 rounded-full bg-black/10 text-xs font-mono uppercase tracking-widest mb-6">
            CAPABILITY NOT FOUND
          </span>
          <h1 className="font-condensed text-5xl sm:text-7xl font-black uppercase tracking-tight mb-4">
            SERVICE UNAVAILABLE
          </h1>
          <p className="font-sans text-gray-600 max-w-md mb-8">
            The requested capability is currently being updated or has been moved.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-[#ffd700] hover:text-black transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Capabilities
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const parsedVideo = parseVideoUrl(service.heroVideo);

  return (
    <PageWrapper>
      <div className="service-detail-page w-full min-h-screen bg-[#f5f0e6] text-[#0a0a0a]">

        {/* SECTION 1: HERO OVERVIEW (#f5f0e6 CREAM) */}
        <section
          data-color="#f5f0e6"
          className="w-full bg-[#f5f0e6] text-[#0a0a0a] pt-28 sm:pt-36 md:pt-44 pb-20 px-6 md:px-16 border-b border-black/10"
        >
          <div className="max-w-[1600px] mx-auto">
            {/* BACK BUTTON */}
            <div className="w-full flex justify-between items-center mb-8 sm:mb-12" data-reveal="slideup">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 hover:bg-black text-black hover:text-[#f5f0e6] border border-black/10 transition-all font-mono text-xs uppercase tracking-widest group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>ALL Services</span>
              </Link>

              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                <span className="w-2 h-2 rounded-full bg-[#e8813a] animate-pulse" />
                <span>SERVICES // {service.categoryNumber}</span>
              </div>
            </div>

            {/* TITLE & BADGE */}
            <div className="max-w-5xl">
              <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-black/50 block mb-4">
                {service.subtitle}
              </span>

              <h1
                data-reveal="title"
                className="font-condensed text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black uppercase leading-[0.9] tracking-tight text-[#0a0a0a] mb-8"
              >
                {service.title}
              </h1>

              <p
                data-reveal="slideup"
                data-delay="0.1"
                className="font-sans text-xl sm:text-2xl md:text-3xl font-normal leading-snug text-black/90 max-w-4xl border-l-2 border-black/20 pl-6 sm:pl-8 py-2"
              >
                {service.tagline}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: SHOWCASE MEDIA PLAYER */}
        <section className="bg-[#f5f0e6] pb-24 px-6 md:px-16">
          <div className="max-w-[1600px] mx-auto">
            <div
              data-reveal="card"
              className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:h-[620px] rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-black/10 group cursor-pointer"
              onClick={togglePlay}
            >
              {parsedVideo.type === 'direct' ? (
                <video
                  ref={videoRef}
                  src={parsedVideo.embedUrl}
                  poster={service.heroImage}
                  loop
                  muted={isMuted}
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover"
                />
              ) : (
                <SafeServiceImage
                  src={service.heroImage}
                  alt={service.title}
                  sizes="100vw"
                  className="object-cover"
                  fallback="/images/stock/stock-hero.jpg"
                />
              )}

              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors pointer-events-none" />

              {/* ROTATING BADGE & PLAY BUTTON */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                    <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                      <path
                        id={`serviceCircle-${service.id}`}
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                      />
                      <text className="text-[9px] font-mono font-bold uppercase fill-white tracking-widest">
                        <textPath href={`#serviceCircle-${service.id}`}>
                          REEL • CRE8TIVECOVE • {service.categoryNumber} • PLAY •&nbsp;
                        </textPath>
                      </text>
                    </svg>
                    <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black translate-x-0.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* MEDIA CONTROLS BAR */}
              <div
                className="absolute bottom-6 right-6 z-20 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-mono border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={togglePlay}
                  className="p-1 hover:text-[#ffd700] transition-colors flex items-center gap-1.5 font-bold"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Showcase'}</span>
                </button>
                {parsedVideo.type === 'direct' && (
                  <button
                    onClick={toggleMute}
                    className="p-1 hover:text-[#ffd700] transition-colors border-l border-white/20 pl-3"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* FLOATING CORNER BADGE */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-[#ffd700] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SHOWCASE REEL</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: EDITORIAL NARRATIVE & CREATIVE APPROACH */}
        <section className="bg-[#f5f0e6] py-20 md:py-28 px-6 md:px-16 border-t border-black/10">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-black" />
              <span className="font-mono text-xs sm:text-sm text-black font-bold uppercase tracking-widest">
                PHILOSOPHY & APPROACH
              </span>
            </div>

            <h2 className="font-serif italic text-4xl sm:text-6xl md:text-7xl text-black font-normal leading-[1.05] tracking-tight">
              &ldquo;{service.overview}&rdquo;
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 font-sans text-base sm:text-lg text-black/85 leading-relaxed">
              {service.fullOverviewParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: CORE CAPABILITIES DEEP-DIVE (#0a0a0a DARK LUXURY) */}
        <section
          data-color="#0a0a0a"
          className="w-full bg-[#0a0a0a] text-[#f5f0e6] py-28 px-6 md:px-16 border-t border-white/10"
        >
          <div className="max-w-[1600px] mx-auto">
            <div className="pb-4 border-b border-white/20 mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest block mb-2">
                  WHAT WE DELIVER
                </span>
                <h3 className="font-condensed text-4xl sm:text-6xl font-black uppercase text-[#f5f0e6] tracking-tight">
                  SPECIALIZED DISCIPLINES
                </h3>
              </div>
              <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                [ 04 FOCUS AREAS ]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.capabilities.map((cap, idx) => (
                <div
                  key={idx}
                  data-reveal="card"
                  data-delay={idx * 0.1}
                  className="group relative p-8 sm:p-12 rounded-3xl bg-[#121212] border border-white/10 hover:border-[#ffd700]/50 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-mono text-sm font-bold text-[#ffd700] px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        0{idx + 1}
                      </span>
                      <Zap className="w-5 h-5 text-gray-500 group-hover:text-[#ffd700] transition-colors" />
                    </div>

                    <h4 className="font-condensed text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight mb-4 group-hover:text-[#ffd700] transition-colors">
                      {cap.title}
                    </h4>

                    <p className="font-sans text-base sm:text-lg text-gray-300 leading-relaxed mb-8">
                      {cap.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
                    {cap.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="font-mono text-[11px] sm:text-xs uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10 group-hover:border-white/20 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: THE 4-STEP EXECUTION ROADMAP (#0a0a0a) */}
        <section className="bg-[#0a0a0a] text-[#f5f0e6] py-24 px-6 md:px-16 border-t border-white/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="pb-4 border-b border-white/20 mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest block mb-2">
                  OUR METHODOLOGY
                </span>
                <h3 className="font-condensed text-4xl sm:text-6xl font-black uppercase text-[#f5f0e6] tracking-tight">
                  HOW WE DELIVER
                </h3>
              </div>
              <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                [ PRODUCTION PHASES ]
              </span>
            </div>

            <div className="flex flex-col">
              {service.processSteps.map((step, idx) => (
                <div
                  key={idx}
                  data-reveal="slideup"
                  data-delay={idx * 0.1}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-12 border-b border-white/15 group hover:bg-white/[0.02] transition-colors px-4 rounded-xl"
                >
                  <div className="md:col-span-2 font-mono text-3xl sm:text-4xl font-bold text-white/40 group-hover:text-[#ffd700] transition-colors">
                    [{step.stepNumber}]
                  </div>

                  <div className="md:col-span-4">
                    <h4 className="font-condensed text-3xl sm:text-5xl font-black uppercase text-[#f5f0e6] leading-tight tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                      {step.title}
                    </h4>
                    {step.duration && (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#ffd700] uppercase tracking-widest mt-2">
                        <Clock className="w-3.5 h-3.5" /> {step.duration}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-6 font-sans text-base sm:text-lg text-gray-300 leading-relaxed pt-2">
                    {step.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: DELIVERABLES CHECKLIST (#f5f0e6 CREAM) */}
        <section
          data-color="#f5f0e6"
          className="w-full bg-[#f5f0e6] text-[#0a0a0a] py-28 px-6 md:px-16 border-t border-black/10"
        >
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs sm:text-sm text-black/60 font-bold uppercase tracking-widest block mb-4">
                TANGIBLE ASSETS
              </span>
              <h3 className="font-condensed text-4xl sm:text-6xl font-black uppercase text-[#0a0a0a] tracking-tight leading-none mb-6">
                EVERYTHING INCLUDED IN THE FINAL PACKAGE
              </h3>
              <p className="font-sans text-lg text-black/80 leading-relaxed mb-8">
                No surprises, no hidden line items. You receive complete ownership of all production files, design libraries, master exports, and implementation guidelines.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-[#e8813a] hover:text-white transition-all shadow-xl font-bold"
              >
                <span>REQUEST DETAILED SCOPE</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 bg-white/60 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-black/10 shadow-lg">
              <ul className="flex flex-col divide-y divide-black/10">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="py-4 sm:py-5 flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-sans text-base sm:text-xl font-medium text-[#0a0a0a]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 7: FEATURED WORK / RELEVANT CASE STUDIES (#0a0a0a) */}
        {service.relatedWorks && service.relatedWorks.length > 0 && (
          <section
            data-color="#0a0a0a"
            className="w-full bg-[#0a0a0a] text-[#f5f0e6] py-28 px-6 md:px-16 border-t border-white/10"
          >
            <div className="max-w-[1600px] mx-auto">
              <div className="pb-4 border-b border-white/20 mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest block mb-2">
                    PROOF OF WORK
                  </span>
                  <h3 className="font-condensed text-4xl sm:text-6xl font-black uppercase text-[#f5f0e6] tracking-tight">
                    FEATURED CASE STUDIES
                  </h3>
                </div>
                <Link
                  href="/work"
                  className="font-mono text-xs uppercase tracking-widest text-[#ffd700] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>VIEW ALL PROJECTS</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {service.relatedWorks.map((work, idx) => (
                  <Link
                    key={idx}
                    href={`/work/${work.slug}`}
                    className="group block relative rounded-3xl overflow-hidden bg-[#121212] border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-500"
                  >
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <SafeServiceImage
                        src={work.image}
                        alt={work.title}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                        fallback="/images/stock/stock-work.jpg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#ffd700] group-hover:text-black transition-all">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-[#ffd700] uppercase tracking-widest mb-3 inline-block">
                          {work.category}
                        </span>
                        <h4 className="font-condensed text-3xl sm:text-5xl font-black uppercase text-[#f5f0e6] tracking-tight group-hover:translate-x-1 transition-transform">
                          {work.title}
                        </h4>
                        <p className="font-mono text-xs text-gray-400 uppercase tracking-wider mt-1">
                          Client: {work.client}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: CLIENT QUOTE */}
        {service.quote && (
          <section className="bg-[#0a0a0a] text-[#f5f0e6] py-24 px-6 md:px-16 border-t border-white/10">
            <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-8">
              <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest block">
                CLIENT VERDICT
              </span>

              <blockquote className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#f5f0e6] leading-tight font-normal py-8 border-y border-white/15 my-2">
                &ldquo;{service.quote.text}&rdquo;
              </blockquote>

              <div className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gray-400">
                <span className="text-white font-bold">{service.quote.author}</span> — {service.quote.role}, {service.quote.company}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 9: NEXT SERVICE SWITCHER CARD */}
        {service.nextService && (
          <section className="bg-[#0a0a0a] py-20 px-6 md:px-16 border-t border-white/10">
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  NEXT CAPABILITY →
                </span>
                <Link
                  href={`/services/${service.nextService.slug}`}
                  className="font-mono text-xs uppercase tracking-widest text-[#ffd700] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <Link
                href={`/services/${service.nextService.slug}`}
                className="block group"
              >
                <div className="relative w-full h-[38vh] sm:h-[45vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
                  <SafeServiceImage
                    src={service.nextService.image}
                    alt={service.nextService.title}
                    sizes="95vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-85"
                    fallback="/images/stock/stock-service.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-[#ffd700] uppercase tracking-widest mb-3 inline-block">
                      CAPABILITY // {service.nextService.number}
                    </span>
                    <h2 className="font-condensed text-3xl sm:text-6xl md:text-7xl font-black uppercase text-[#f5f0e6] tracking-tight leading-none group-hover:translate-x-2 transition-transform duration-500">
                      {service.nextService.title}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* CUBOID MARQUEE STRIP */}
        <CuboidMarquee href="/services" text="STRATEGY • CREATIVE DIRECTION • DIGITAL CRAFT • WEIRD ENERGY •" />

        {/* SECTION 10: BOTTOM CTA BANNER */}
        <section className="bg-[#0a0a0a] text-[#f5f0e6] pt-28 pb-20 px-6 md:px-16 text-center border-t border-white/10">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center">
            <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest mb-6">
              HAVE A PROJECT IN MIND?
            </span>

            <Link
              href="/contact"
              className="group font-condensed text-[9vw] sm:text-[10vw] md:text-[11vw] font-black uppercase text-[#f5f0e6] hover:text-[#ffd700] leading-[0.85] tracking-tighter text-center transition-all duration-500 block hover:scale-[1.01] mb-16"
            >
              LET&apos;S MAKE IT HAPPEN
            </Link>

            <div className="w-full pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                CRE8TIVECOVE (C8C) • ALL RIGHTS RESERVED
              </span>

              <div className="flex items-center gap-4">
                <Link
                  href="/services"
                  className="font-mono text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
                >
                  All Capabilities
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/work"
                  className="font-mono text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
                >
                  Work Index
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/contact"
                  className="font-mono text-xs uppercase tracking-widest text-[#ffd700] hover:text-white font-bold transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
