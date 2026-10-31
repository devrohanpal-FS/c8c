'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { parseVideoUrl } from '@/lib/utils';
import './WorkCard.css';

export interface WorkProject {
  id: string;
  title: string;
  client: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  slug: string;
}

interface WorkCardProps {
  project: WorkProject;
}

export default function WorkCard({ project }: WorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const parsed = parseVideoUrl(project.videoUrl);

  useGSAP(
    () => {
      const card = cardRef.current;
      const image = imageRef.current;
      const title = titleRef.current;
      const category = categoryRef.current;
      if (!card || !image || !title) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // 1. Scroll-Triggered Entrance Animation: Card reveals, scales up, and clears into view smoothly
      gsap.fromTo(
        card,
        {
          opacity: 0.25,
          y: 75,
          scale: 0.94,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            end: 'top 58%',
            scrub: 0.8,
          },
        }
      );

      // 2. Cinematic Parallax Scroll on Image: Moves smoothly through the card viewport window
      gsap.fromTo(
        image,
        { scale: 1.15, yPercent: -8 },
        {
          scale: 1.02,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // 3. 3D Layered Typography Depth: Title floats forward with scrubbed parallax
      gsap.fromTo(
        title,
        { y: 55, opacity: 0.8 },
        {
          y: -25,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );

      // 4. Category Badge Entrance Animation on Scroll
      if (category) {
        gsap.fromTo(
          category,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    },
    { scope: cardRef }
  );

  // Play / Pause video when hover state changes
  useEffect(() => {
    if (parsed.type === 'direct' && videoRef.current) {
      if (isHovered) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.debug('Video autoplay interrupted or prevented:', error);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, parsed.type]);

  const initialPoster =
    project.thumbnailUrl ||
    parsed.defaultThumbnail ||
    '/images/stock/stock-work.jpg';

  const [imgSrc, setImgSrc] = useState(initialPoster);

  useEffect(() => {
    setImgSrc(project.thumbnailUrl || parsed.defaultThumbnail || '/images/stock/stock-work.jpg');
  }, [project.thumbnailUrl, parsed.defaultThumbnail]);

  return (
    <Link href={`/work/${project.slug}`} className="block w-full" data-animation="media">
      <div
        ref={cardRef}
        className="work-card-component relative w-full aspect-[16/9] min-h-[320px] max-h-[720px] rounded-3xl overflow-hidden cursor-pointer bg-black group shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail & Video Container */}
        <div ref={imageRef} className="absolute inset-0 w-full h-full bg-black">
          {/* Base cover image is ALWAYS in DOM so the card NEVER turns black */}
          <Image
            src={imgSrc || '/images/stock/stock-work.jpg'}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 95vw"
            className="video_thumbnail object-cover object-top"
            onError={() => setImgSrc('/images/stock/stock-work.jpg')}
          />

          {/* Direct Video: Mounted continuously in DOM, streams on hover */}
          {parsed.type === 'direct' && parsed.embedUrl && (
            <video
              ref={videoRef}
              src={parsed.embedUrl}
              muted
              loop
              playsInline
              preload="none"
              className={`home_work_bg_video absolute inset-0 w-full h-full object-cover object-top z-10 transition-opacity duration-700 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          )}

          {/* YouTube Embed on Hover */}
          {isHovered && parsed.type === 'youtube' && (
            <iframe
              src={`https://www.youtube.com/embed/${parsed.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${parsed.youtubeId}&playsinline=1`}
              title={project.title}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 pointer-events-none object-cover object-top z-10 transition-opacity duration-500 opacity-100"
            />
          )}

          {/* Vimeo Embed on Hover */}
          {isHovered && parsed.type === 'vimeo' && (
            <iframe
              src={`https://player.vimeo.com/video/${parsed.vimeoId}?autoplay=1&muted=1&background=1&loop=1`}
              title={project.title}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 pointer-events-none object-cover object-top z-10 transition-opacity duration-500 opacity-100"
            />
          )}
        </div>

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-70 z-20" />

        {/* Category Pill */}
        <div ref={categoryRef} className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
          <span className="px-4 py-1.5 rounded-full bg-black/70 border border-white/20 text-xs font-mono text-[#f5f0e6] uppercase tracking-widest font-bold">
            {project.category}
          </span>
        </div>

        {/* Title */}
        <div className="absolute bottom-10 left-8 md:bottom-16 md:left-16 z-20 max-w-4xl">
          <h2
            ref={titleRef}
            className="font-condensed text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-extrabold uppercase text-[#f5f0e6] tracking-tight leading-[0.9] drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
          >
            {project.title}
          </h2>
        </div>
      </div>
    </Link>
  );
}