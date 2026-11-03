'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause, Sparkles, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export interface CultureSlideItem {
  id: string;
  title: string;
  subtitle: string;
  mediaUrl: string;
  linkUrl: string;
  buttonText: string;
  badge?: string;
}

const defaultSlides: CultureSlideItem[] = [
  {
    id: 'cs-1',
    title: 'RETRO TECH 1',
    subtitle: 'Y2K Heritage & Hardware Ethos',
    mediaUrl: '/images/BTS/1.jpg',
    linkUrl: '/about',
    buttonText: 'View Story',
    badge: '01 CULTURE',
  },
  {
    id: 'cs-2',
    title: 'RETRO TECH 2',
    subtitle: 'Analog Circuits & Tactile Cinema',
    mediaUrl: '/images/BTS/2.jpg',
    linkUrl: '/services',
    buttonText: 'View Disciplines',
    badge: '02 CRAFT',
  },
  {
    id: 'cs-3',
    title: 'CYBER MATRIX',
    subtitle: '3D Motion & Spatial Realism',
    mediaUrl: '/images/BTS/3.jpg',
    linkUrl: '/technology',
    buttonText: 'Explore Tech',
    badge: '03 APPLIED',
  },
  {
    id: 'cs-4',
    title: 'GAMING SETUP',
    subtitle: 'Unapologetic Creative Energy',
    mediaUrl: '/images/BTS/4.jpg',
    linkUrl: '/about',
    buttonText: 'Read Ethos',
    badge: '04 MANIFESTO',
  },
  {
    id: 'cs-5',
    title: 'CINEMATIC VISION',
    subtitle: 'Commercial Direction & Finishing',
    mediaUrl: '/images/BTS/5.jpg',
    linkUrl: '/work',
    buttonText: 'Selected Works',
    badge: '05 ARCHIVE',
  },
];

function CollageSlideImage({
  src,
  alt,
  isActive,
  priority,
}: {
  src: string;
  alt: string;
  isActive: boolean;
  priority: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src || '/images/stock/stock-bts.jpg');

  useEffect(() => {
    setImgSrc(src || '/images/stock/stock-bts.jpg');
  }, [src]);

  return (
    <Image
      src={imgSrc || '/images/stock/stock-bts.jpg'}
      alt={alt}
      fill
      sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 600px"
      className={`object-cover transition-transform duration-700 ${
        isActive ? 'scale-100 hover:scale-105' : 'scale-105'
      }`}
      priority={priority}
      onError={() => setImgSrc('/images/stock/stock-bts.jpg')}
    />
  );
}

export interface ImageCollageStripProps {
  items?: CultureSlideItem[];
  cultureTag?: string;
  cultureTitle?: string;
}

export default function ImageCollageStrip({
  items,
  cultureTag,
  cultureTitle,
}: ImageCollageStripProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Combine items from CMS without forcing generic fallback titles when left blank
  const slides: CultureSlideItem[] = React.useMemo(() => {
    if (items && Array.isArray(items) && items.length > 0) {
      return items.map((item, idx) => ({
        id: item.id || `bts-slide-${idx}`,
        title: item.title || '',
        subtitle: item.subtitle || '',
        mediaUrl: item.mediaUrl,
        linkUrl: item.linkUrl || item.mediaUrl,
        buttonText: item.buttonText || 'View Photo',
        badge: item.badge || `0${idx + 1} BTS`,
      }));
    }
    return defaultSlides;
  }, [items]);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-slide effect (every 3.8 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch / Drag event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragCurrentX - dragStartX;
      if (diff > 50) {
        prevSlide();
      } else if (diff < -50) {
        nextSlide();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX !== null) {
      setDragCurrentX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragCurrentX - dragStartX;
      if (diff > 50) {
        prevSlide();
      } else if (diff < -50) {
        nextSlide();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
  };

  // Scroll color morph transition
  useGSAP(
    () => {
      const sectionEl = containerRef.current;
      if (!sectionEl) return;

      const headingEl = sectionEl.querySelector('h2');
      const subtitleEl = sectionEl.querySelector('.culture-tag');

      const colorTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 50%',
          toggleActions: 'play reverse play reverse',
        },
      });

      colorTl.to(
        sectionEl,
        {
          backgroundColor: '#ffd700',
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0
      );

      if (headingEl) {
        colorTl.to(
          headingEl,
          {
            color: '#0a0a0a',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        );
      }

      if (subtitleEl) {
        colorTl.to(
          subtitleEl,
          {
            color: '#262626',
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
    <section
      id="culturesection"
      ref={containerRef}
      className="relative py-28 sm:py-36 px-4 sm:px-8 md:px-12 bg-transparent text-inherit overflow-hidden select-none transition-colors duration-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleMouseUp();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* SECTION HEADER */}
      <div className="max-w-[1400px] mx-auto text-center mb-12 sm:mb-16">
        <span className="culture-tag text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.3em] text-gray-500 block mb-3">
          {cultureTag || 'THE CULTURE'}
        </span>
        <h2 className="font-condensed text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-current leading-none drop-shadow-sm">
          {cultureTitle || 'BEHIND THE LENS BEYOND THE STORY'}
        </h2>
      </div>

      {/* 3D COVERFLOW SLIDER STAGE */}
      <div className="relative w-full max-w-[1700px] mx-auto h-[340px] sm:h-[460px] md:h-[550px] lg:h-[660px] flex items-center justify-center">
        {slides.map((slide, idx) => {
          // Calculate relative circular distance from current center card
          let diff = (idx - currentIndex) % total;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff -= total;

          const isActive = diff === 0;
          const isLeft1 = diff === -1;
          const isRight1 = diff === 1;
          const isLeft2 = diff === -2;
          const isRight2 = diff === 2;
          const isVisible = Math.abs(diff) <= 2;

          let transformStyle = '';
          let zIndex = 10;
          let opacity = 0;
          let filter = 'blur(6px)';

          if (isActive) {
            transformStyle = 'translateX(-50%) translateY(0) scale(1) translateZ(0)';
            zIndex = 30;
            opacity = 1;
            filter = 'blur(0px)';
          } else if (isLeft1) {
            transformStyle =
              'translateX(calc(-50% - clamp(160px, 26vw, 420px))) translateY(8px) scale(0.86) perspective(1000px) rotateY(12deg)';
            zIndex = 20;
            opacity = 0.75;
            filter = 'blur(2.5px)';
          } else if (isRight1) {
            transformStyle =
              'translateX(calc(-50% + clamp(160px, 26vw, 420px))) translateY(8px) scale(0.86) perspective(1000px) rotateY(-12deg)';
            zIndex = 20;
            opacity = 0.75;
            filter = 'blur(2.5px)';
          } else if (isLeft2) {
            transformStyle =
              'translateX(calc(-50% - clamp(300px, 46vw, 760px))) translateY(16px) scale(0.72) perspective(1000px) rotateY(22deg)';
            zIndex = 10;
            opacity = 0.35;
            filter = 'blur(5px)';
          } else if (isRight2) {
            transformStyle =
              'translateX(calc(-50% + clamp(300px, 46vw, 760px))) translateY(16px) scale(0.72) perspective(1000px) rotateY(-22deg)';
            zIndex = 10;
            opacity = 0.35;
            filter = 'blur(5px)';
          } else {
            transformStyle = diff < 0 ? 'translateX(-150%) scale(0.6)' : 'translateX(150%) scale(0.6)';
            zIndex = 5;
            opacity = 0;
            filter = 'blur(10px)';
          }

          return (
            <div
              key={slide.id}
              onClick={() => {
                if (!isActive) goToSlide(idx);
              }}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                filter,
                transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className={`absolute top-0 left-1/2 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] aspect-square rounded-[2rem] sm:rounded-[2.4rem] lg:rounded-[2.8rem] overflow-hidden bg-black shadow-2xl transition-all duration-700 cursor-pointer ${isActive
                ? 'cursor-default ring-2 ring-white/50 shadow-[0_30px_70px_rgba(0,0,0,0.55)]'
                : 'hover:opacity-95'
                }`}
            >
              {/* IMAGE */}
              <div className="relative w-full h-full">
                <CollageSlideImage
                  src={slide.mediaUrl}
                  alt={slide.title}
                  isActive={isActive}
                  priority={idx <= 2}
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10" />



                {/* BOTTOM CONTENT INFO */}
                <div
                  className={`absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 z-10 flex flex-col gap-2.5 sm:gap-3.5 text-left transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-85 translate-y-2'
                    }`}
                >
                  {(slide.title || slide.subtitle) && (
                    <div>
                      {slide.title && (
                        <h3 className="font-condensed text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-none drop-shadow-md mb-1.5 sm:mb-2">
                          {slide.title}
                        </h3>
                      )}
                      {slide.subtitle && (
                        <p className="font-sans text-xs sm:text-sm md:text-base text-gray-300 font-medium truncate">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    {/* <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxUrl(slide.mediaUrl);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 bg-white/10 hover:bg-[#ffd700] text-white hover:text-black backdrop-blur-md text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-xl group cursor-pointer"
                    >
                      <span>{slide.buttonText || 'View Photo'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button> */}

                    {/* {isActive && (
                      <span className="text-[11px] font-mono text-[#ffd700] uppercase tracking-widest font-bold hidden sm:inline-block">
                        [{idx + 1}/{total}]
                      </span>
                    )} */}
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {/* NAVIGATION BUTTON - PREVIOUS */}
        {/* <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-6 md:left-12 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-md cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
        </button> */}

        {/* NAVIGATION BUTTON - NEXT */}
        {/* <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-6 md:right-12 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-md cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 translate-x-0.5" />
        </button> */}
      </div>

      {/* BOTTOM CONTROLS & PAGINATION BAR */}
      {/* <div className="max-w-md mx-auto mt-8 sm:mt-12 flex items-center justify-center gap-4 z-40 relative">
       
        <button
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume Auto Slide' : 'Pause Auto Slide'}
          className="p-2 rounded-full border border-black/20 bg-black/10 hover:bg-black hover:text-[#ffd700] text-black transition-all flex items-center justify-center text-xs font-mono"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        
        <div className="flex items-center gap-2">
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => goToSlide(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${dotIdx === currentIndex
                ? 'w-8 bg-black shadow-md'
                : 'w-2.5 bg-black/30 hover:bg-black/60'
                }`}
            />
          ))}
        </div>

       
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/70">
          {isPaused ? 'PAUSED' : 'AUTO-SLIDING'}
        </span>
      </div> */}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 cursor-pointer animate-fadeIn"
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>
          <div className="relative max-w-[94vw] max-h-[88vh] w-[90vw] h-[80vh] flex items-center justify-center pointer-events-none">
            <Image
              src={lightboxUrl}
              alt="Behind The Scenes Still"
              fill
              sizes="94vw"
              priority
              className="object-contain rounded-2xl shadow-2xl border border-white/20 pointer-events-auto"
              unoptimized={lightboxUrl.startsWith('data:') || lightboxUrl.startsWith('blob:')}
            />
          </div>
        </div>
      )}
    </section>
  );
}