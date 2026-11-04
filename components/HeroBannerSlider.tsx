'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export interface HeroSlideData {
  id: string;
  title: string;
  subtitle?: string | null;
  tagline?: string | null;
  mediaUrl: string;
  mediaType?: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaUrl?: string | null;
  order?: number;
  active?: boolean;
}

interface HeroBannerSliderProps {
  slides?: HeroSlideData[];
  autoPlayInterval?: number; // in milliseconds, default 5000
}

function HeroSlideImage({
  src,
  alt,
  autoPlayInterval,
  isPaused,
}: {
  src: string;
  alt: string;
  autoPlayInterval: number;
  isPaused: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src || '/images/stock/stock-hero.jpg');

  useEffect(() => {
    setImgSrc(src || '/images/stock/stock-hero.jpg');
  }, [src]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden will-change-transform origin-center"
      style={{
        animation: `kenBurnsZoom ${autoPlayInterval}ms linear forwards`,
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
    >
      <Image
        src={imgSrc || '/images/stock/stock-hero.jpg'}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        onError={() => setImgSrc('/images/stock/stock-hero.jpg')}
      />
    </div>
  );
}

export default function HeroBannerSlider({
  slides: propSlides = [],
  autoPlayInterval = 5000,
}: HeroBannerSliderProps) {
  const slides = (propSlides || []).filter((s) => s.active !== false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Next Slide handler
  const handleNext = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Prev Slide handler
  const handlePrev = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Jump to specific slide
  const handleGoTo = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Direct, reliable Auto-slide timer (advances every autoPlayInterval ms unless paused)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, slides.length, handleNext, currentIndex]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex] || slides[0];

  // Slide Animation Variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: customDelay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div
      className="hero-banner-slider relative w-full h-[90vh] min-h-[600px] max-h-[960px] bg-[#0a0a0a] overflow-hidden select-none flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Homepage Hero Banner Slider"
    >
      {/* BACKGROUND MEDIA WITH KEN BURNS CONTINUOUS ZOOM (SYNCED TO PROGRESS BAR) */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentSlide.id || currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {currentSlide.mediaType === 'VIDEO' ? (
            <div
              key={`media-${currentSlide.id || currentIndex}`}
              className="absolute inset-0 w-full h-full overflow-hidden will-change-transform origin-center"
              style={{
                animation: `kenBurnsZoom ${autoPlayInterval}ms linear forwards`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              <video
                src={currentSlide.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (
            <HeroSlideImage
              key={`media-${currentSlide.id || currentIndex}`}
              src={currentSlide.mediaUrl}
              alt={currentSlide.title}
              autoPlayInterval={autoPlayInterval}
              isPaused={isPaused}
            />
          )}

          {/* SUBTLE OVERLAYS - KEEPING IMAGE CRISP & VIBRANT WHILE ENSURING TEXT CONTRAST */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/75 via-transparent to-black/25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20 w-full max-w-[1500px] mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-end pb-12 sm:pb-16 h-full">
        <AnimatePresence mode="wait">
          <div key={currentSlide.id || currentIndex} className="max-w-4xl space-y-4 sm:space-y-6">
            {/* Tagline Badge */}
            {currentSlide.tagline && (
              <motion.div
                custom={0.1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/30 backdrop-blur-md shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#ffd700]">
                  {currentSlide.tagline}
                </span>
              </motion.div>
            )}

            {/* Headline Title */}
            <motion.h1
              custom={0.2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-condensed font-extrabold text-white uppercase tracking-wider leading-[0.96] text-3xl sm:text-5xl md:text-6xl lg:text-[72px] drop-shadow-2xl"
            >
              {currentSlide.title}
            </motion.h1>

            {/* Subtitle / Narrative */}
            {currentSlide.subtitle && (
              <motion.p
                custom={0.3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-sm sm:text-lg md:text-xl text-[#f5f0e6]/90 font-light max-w-2xl leading-relaxed drop-shadow"
              >
                {currentSlide.subtitle}
              </motion.p>
            )}

            {/* Action Buttons (CTAs) */}
            <motion.div
              custom={0.4}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4"
            >
              {currentSlide.ctaText && (
                <Link
                  href={currentSlide.ctaUrl || '/work'}
                  className="group relative inline-flex items-center gap-3.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:scale-105 shadow-[0_10px_30px_rgba(255,215,0,0.3)]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a0a0a] text-[#ffd700] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <span>{currentSlide.ctaText}</span>
                </Link>
              )}

              {currentSlide.secondaryCtaText && (
                <Link
                  href={currentSlide.secondaryCtaUrl || '/about'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-widest border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105"
                >
                  <span>{currentSlide.secondaryCtaText}</span>
                </Link>
              )}
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {/* AUTOPLAY PLAY / PAUSE BUTTON */}
      <div className="absolute bottom-8 right-6 sm:bottom-12 sm:right-12 z-30 pointer-events-auto">
        <button
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume banner autoplay' : 'Pause banner autoplay'}
          title={isPaused ? 'Resume Autoplay' : 'Pause Autoplay'}
          className="group relative flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 bg-black/60 hover:bg-black/85 backdrop-blur-md text-white hover:border-[#ffd700]/60 transition-all duration-300 shadow-2xl cursor-pointer active:scale-95"
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
              isPaused
                ? 'bg-[#ffd700] text-black shadow-[0_0_12px_rgba(255,215,0,0.5)]'
                : 'bg-white/15 text-white group-hover:bg-white/25'
            }`}
          >
            {isPaused ? (
              <Play className="w-3 h-3 ml-0.5 fill-current" />
            ) : (
              <Pause className="w-3 h-3 fill-current" />
            )}
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-gray-200 group-hover:text-white transition-colors">
            {isPaused ? 'PLAY' : 'PAUSE'}
          </span>
        </button>
      </div>

      {/* BOTTOM CONTROLS BAR: TEMPORARILY HIDDEN PER USER REQUEST */}
      {/* 
      <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-30 px-6 sm:px-12 md:px-16 pointer-events-auto">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-6 border-t border-white/15 pt-5">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-md">
            {slides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id || idx}
                  onClick={() => handleGoTo(idx)}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className="group relative h-2.5 py-1 flex-1 cursor-pointer"
                >
                  <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden group-hover:bg-white/30 transition-colors">
                    {isActive ? (
                      <div
                        className="h-full bg-[#ffd700] rounded-full transition-all duration-75"
                        style={{ width: `${progress}%` }}
                      />
                    ) : idx < currentIndex ? (
                      <div className="h-full w-full bg-white/60 rounded-full" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="font-mono text-xs sm:text-sm text-gray-400 font-bold tracking-widest flex items-center gap-1.5 shrink-0">
            <span className="text-[#ffd700] text-sm sm:text-base">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/40">/</span>
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#ffd700] hover:text-black hover:border-[#ffd700] transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#ffd700] hover:text-black hover:border-[#ffd700] transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      */}
    </div>
  );
}
