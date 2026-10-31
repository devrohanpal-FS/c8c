'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import CuboidMarquee from '@/components/CuboidMarquee';
import { getFeaturedWorkDetailBySlug, FeaturedWorkDetail, VideoMediaItem } from '@/lib/data/featuredWorkDetail';
import { useScrollColorMorph } from '@/lib/hooks/useScrollColorMorph';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import { parseVideoUrl } from '@/lib/utils';
import '../Work.css';

interface WorkDetailClientProps {
  slug: string;
  initialWork?: any;
}

function buildWorkDetail(dbWork: any, slug: string): FeaturedWorkDetail {
  const fallback = getFeaturedWorkDetailBySlug(slug);
  const dbVideos: VideoMediaItem[] = [];

  if (dbWork.gallery && Array.isArray(dbWork.gallery) && dbWork.gallery.length > 0) {
    dbWork.gallery.forEach((g: any, idx: number) => {
      if (g.mediaUrl && g.mediaUrl.trim() !== '') {
        dbVideos.push({
          id: g.id || `gal-${idx}`,
          title: g.caption || `Film Reel #${idx + 1}`,
          thumbnailUrl: dbWork.heroMedia || dbWork.thumbnailUrl || '/images/stock/stock-work.jpg',
          videoUrl: g.mediaUrl,
          caption: g.caption || `Film Reel #${idx + 1}`,
        });
      }
    });
  }

  if (dbVideos.length === 0 && (dbWork.heroVideoUrl || dbWork.projectVideoUrl)) {
    const vUrl = dbWork.heroVideoUrl || dbWork.projectVideoUrl;
    if (vUrl && vUrl.trim() !== '') {
      dbVideos.push({
        id: 'hero-1',
        title: dbWork.title,
        thumbnailUrl: dbWork.heroMedia || dbWork.thumbnailUrl || '/images/stock/stock-work.jpg',
        videoUrl: vUrl,
        caption: 'Main Broadcast Film Cut',
      });
    }
  }

  return {
    id: dbWork.id,
    slug: dbWork.slug,
    title: dbWork.title || fallback?.title || slug.replace(/-/g, ' ').toUpperCase(),
    subtitleTag: fallback?.subtitleTag || `+ ${dbWork.category?.toUpperCase() || 'BRAND & MOTION'} +`,
    client: dbWork.client || fallback?.client || 'Cre8tiveCove Partner',
    category: dbWork.category || fallback?.category || 'Commercial Direction',
    year: dbWork.year || fallback?.year || '2025',
    description: dbWork.description || fallback?.description || 'Commercial project overview.',
    fullDescription: dbWork.fullDescription || fallback?.fullDescription || dbWork.description || '',
    creativeDirectionHeader: fallback?.creativeDirectionHeader || 'CREATIVE DIRECTION & SCOPE',
    creativeDirectionBody1: dbWork.strategy || fallback?.creativeDirectionBody1 || dbWork.description || '',
    creativeDirectionSubhead: fallback?.creativeDirectionSubhead || 'EXECUTION & ART DIRECTION',
    creativeDirectionBody2: dbWork.artDirection || fallback?.creativeDirectionBody2 || 'Cinematography and high-voltage visual identity.',
    tagline: fallback?.tagline || `Because when you craft with passion, you really do move people.`,
    videos: dbVideos.length > 0 ? dbVideos : (fallback?.videos || []),
    quote: fallback?.quote,
    services: dbWork.services ? dbWork.services.split(',').map((s: string) => s.trim()) : (fallback?.services || ['Commercial Direction']),
    credits: dbWork.credits || fallback?.credits || 'Creative Direction & Production: Cre8tiveCove Team',
    nextProject: fallback?.nextProject || {
      slug: 'warivo-new-ev-scooter',
      title: 'WARIVO NEW EV SCOOTER',
      category: 'Automotive & Product Launch',
      thumbnailUrl: '/uploads/media_1790317167178_9f8fd034136f906b.webp',
    },
  };
}

function WorkVideoPosterImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || '/images/stock/stock-work.jpg');

  useEffect(() => {
    setImgSrc(src || '/images/stock/stock-work.jpg');
  }, [src]);

  return (
    <Image
      src={imgSrc || '/images/stock/stock-work.jpg'}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 90vw"
      className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"
      onError={() => setImgSrc('/images/stock/stock-work.jpg')}
    />
  );
}

function NextProjectCard({ nextProject }: { nextProject: { slug: string; title: string; category: string; thumbnailUrl: string } }) {
  const [imgSrc, setImgSrc] = useState(nextProject.thumbnailUrl || '/images/stock/stock-work.jpg');

  useEffect(() => {
    setImgSrc(nextProject.thumbnailUrl || '/images/stock/stock-work.jpg');
  }, [nextProject.thumbnailUrl]);

  return (
    <Link href={`/work/${nextProject.slug}`} className="block group">
      <div className="relative w-full h-[45vh] md:h-[55vh] rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
        <Image
          src={imgSrc || '/images/stock/stock-work.jpg'}
          alt={nextProject.title}
          fill
          sizes="95vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
          onError={() => setImgSrc('/images/stock/stock-work.jpg')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-8 md:bottom-14 md:left-14 z-10">
          <span className="px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-[#C0FF4A] uppercase tracking-widest mb-3 inline-block">
            {nextProject.category}
          </span>
          <h2 className="font-condensed text-4xl sm:text-7xl md:text-8xl font-black uppercase text-[#f5f0e6] tracking-tight leading-none group-hover:translate-x-2 transition-transform duration-500">
            {nextProject.title}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export const WorkDetailClient: React.FC<WorkDetailClientProps> = ({ slug, initialWork }) => {
  const [workData, setWorkData] = useState<FeaturedWorkDetail | null>(() => {
    if (initialWork) {
      return buildWorkDetail(initialWork, slug);
    }
    return getFeaturedWorkDetailBySlug(slug) || null;
  });
  const [loading, setLoading] = useState(!workData);
  const [isPlayingInline, setIsPlayingInline] = useState<Record<string, boolean>>({});
  const [isMutedInline, setIsMutedInline] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useScrollColorMorph();
  useScrollReveal();

  useEffect(() => {
    if (initialWork) return; // Already initialized from server data

    const fallback = getFeaturedWorkDetailBySlug(slug);

    fetch(`/api/work/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found in DB');
        return res.json();
      })
      .then((data) => {
        if (data.work) {
          const dbWork = data.work;
          const dbVideos: VideoMediaItem[] = [];

          if (dbWork.gallery && Array.isArray(dbWork.gallery) && dbWork.gallery.length > 0) {
            dbWork.gallery.forEach((g: any, idx: number) => {
              if (g.mediaUrl && g.mediaUrl.trim() !== '') {
                dbVideos.push({
                  id: g.id || `gal-${idx}`,
                  title: g.caption || `Film Reel #${idx + 1}`,
                  thumbnailUrl: dbWork.heroMedia || dbWork.thumbnailUrl || '/images/stock/stock-work.jpg',
                  videoUrl: g.mediaUrl,
                  caption: g.caption || `Film Reel #${idx + 1}`,
                });
              }
            });
          }

          if (dbVideos.length === 0 && (dbWork.heroVideoUrl || dbWork.projectVideoUrl)) {
            const vUrl = dbWork.heroVideoUrl || dbWork.projectVideoUrl;
            if (vUrl && vUrl.trim() !== '') {
              dbVideos.push({
                id: 'hero-1',
                title: dbWork.title,
                thumbnailUrl: dbWork.heroMedia || dbWork.thumbnailUrl || '/images/stock/stock-work.jpg',
                videoUrl: vUrl,
                caption: 'Main Broadcast Film Cut',
              });
            }
          }

          const merged: FeaturedWorkDetail = {
            id: dbWork.id,
            slug: dbWork.slug,
            title: dbWork.title || fallback?.title || slug.replace(/-/g, ' ').toUpperCase(),
            subtitleTag: fallback?.subtitleTag || `+ ${dbWork.category?.toUpperCase() || 'BRAND & MOTION'} +`,
            client: dbWork.client || fallback?.client || 'Cre8tiveCove Partner',
            category: dbWork.category || fallback?.category || 'Commercial Direction',
            year: dbWork.year || fallback?.year || '2025',
            description: dbWork.description || fallback?.description || '',
            fullDescription: dbWork.fullDescription || fallback?.fullDescription || '',
            creativeDirectionHeader: fallback?.creativeDirectionHeader || 'CREATIVE DIRECTION',
            creativeDirectionBody1: dbWork.fullDescription || fallback?.creativeDirectionBody1 || dbWork.description,
            creativeDirectionSubhead: fallback?.creativeDirectionSubhead || 'SO WE CREATED A CAMPAIGN',
            creativeDirectionBody2: fallback?.creativeDirectionBody2 || 'We developed dynamic broadcast spots and high-concept motion graphics to drive maximum audience connection.',
            tagline: fallback?.tagline || `${dbWork.title}: DEFINING MODERN COMMERCIAL CINEMA`,
            videos: dbVideos.length > 0 ? dbVideos : (fallback?.videos || []),
            quote: fallback?.quote || {
              text: 'Working with Cre8tiveCove was easily the most seamless and rewarding creative partnership our marketing team has ever experienced.',
              author: dbWork.client || 'CLIENT LEAD',
              role: 'EXECUTIVE CREATIVE DIRECTOR',
              company: dbWork.client || 'Cre8tiveCove Partner'
            },
            services: dbWork.services
              ? dbWork.services.split(',').map((s: string) => s.trim())
              : (fallback?.services || ['Creative Concept Development', 'Production & Post-Production', 'Animation & VFX', 'Scriptwriting']),
            credits: dbWork.credits || fallback?.credits,
            nextProject: fallback?.nextProject || {
              slug: 'skyla-credit-union',
              title: 'SKYLA CREDIT UNION',
              category: 'Brand Strategy & Film',
              thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80'
            }
          };
          setWorkData(merged);
        } else if (fallback) {
          setWorkData(fallback);
        }
      })
      .catch(() => {
        if (fallback) {
          setWorkData(fallback);
        }
      })
      .finally(() => setLoading(false));
  }, [slug, initialWork]);

  const toggleVideoPlay = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    if (isPlayingInline[videoId]) {
      video.pause();
      setIsPlayingInline((prev) => ({ ...prev, [videoId]: false }));
    } else {
      video.play().catch(() => { });
      setIsPlayingInline((prev) => ({ ...prev, [videoId]: true }));
    }
  };

  const toggleVideoMute = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    const video = videoRefs.current[videoId];
    if (!video) return;
    video.muted = !video.muted;
    setIsMutedInline((prev) => ({ ...prev, [videoId]: video.muted }));
  };

  if (loading && !workData) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#fffef2] text-[#0a0a0a] flex items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            <p className="font-mono text-xs uppercase tracking-widest text-black/60">Loading Case Study...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!workData) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#fffef2] text-[#0a0a0a] pt-36 pb-32 px-6 flex flex-col items-center justify-center text-center">
          <span className="px-4 py-1.5 rounded-full bg-black/10 text-xs font-mono uppercase tracking-widest mb-6">
            PROJECT ARCHIVED OR NOT FOUND
          </span>
          <h1 className="font-condensed text-5xl sm:text-7xl font-black uppercase tracking-tight mb-4">
            PROJECT NOT FOUND
          </h1>
          <p className="font-sans text-gray-600 max-w-md mb-8">
            The requested case study is either private, currently being updated, or does not exist.
          </p>
          <Link
            href="/work"
            className="arrow_btn"
          >
            <ArrowLeft className="w-4 h-4" /> Return to All Work
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="work-detail-page w-full min-h-screen bg-[#FFFEF2] text-[#0a0a0a]">

        {/* SECTION 1: OFF-WHITE CREAM HERO (#FFFEF2) */}
        <div id="challange" data-color="#FFFEF2" className="w-full bg-[#FFFEF2] text-[#0a0a0a] pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-12">
          <header className="max-w-auto mx-auto text-center flex flex-col items-center relative mb-12">

            {/* BACK BUTTON LINK */}
            <div className="w-full flex justify-start mb-6" data-reveal="slideup">
              <Link href="/work" className="arrow_btn">
                <ArrowLeft className="w-4 h-4" />
                <span>FILMS</span>
              </Link>
            </div>

            {/* TITLE */}
            <h1 data-reveal="title" className="font-condensed text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tight leading-[0.88] text-[#0a0a0a] text-center drop-shadow-sm mb-4">
              {workData.title}
            </h1>

            {/* CLIENT / SUBTITLE */}
            <div data-reveal="slideup" data-delay="0.1" className="font-mono text-sm sm:text-lg font-bold tracking-[0.25em] text-black/70 uppercase text-center mb-6">
              - {workData.client} -
            </div>
          </header>

          {/* MEDIA STACK WITH PLAY BUTTON */}
          <section className="px-4 sm:px-6 md:px-12 max-w-auto mx-auto mt-8 mb-24 flex flex-col gap-8 md:gap-12">
            {workData.videos.map((videoItem, idx) => {
              const parsed = parseVideoUrl(videoItem.videoUrl);
              const isPlaying = !!isPlayingInline[videoItem.id];
              const isMuted = isMutedInline[videoItem.id] !== false;
              const posterSrc =
                videoItem.thumbnailUrl ||
                parsed.defaultThumbnail ||
                '/images/stock/stock-work.jpg';

              const handleContainerClick = () => {
                if (parsed.type === 'direct') {
                  toggleVideoPlay(videoItem.id);
                } else {
                  setIsPlayingInline((prev) => ({ ...prev, [videoItem.id]: !prev[videoItem.id] }));
                }
              };

              return (
                <div
                  key={videoItem.id || idx}
                  data-reveal="card"
                  data-delay={idx * 0.1}
                  className="video-card-container relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-2xl group border border-black/10 cursor-pointer"
                  onClick={handleContainerClick}
                >
                  <div className="relative w-full h-[68vh] bg-black flex items-center justify-center overflow-hidden">
                    {/* IFRAME FOR YOUTUBE / VIMEO WHEN PLAYING */}
                    {isPlaying && (parsed.type === 'youtube' || parsed.type === 'vimeo') ? (
                      <iframe
                        src={parsed.embedUrl}
                        title={videoItem.title || `Film Reel ${idx + 1}`}
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full h-full border-0 absolute inset-0 z-10"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        {parsed.type === 'direct' ? (
                          <video
                            ref={(el) => { videoRefs.current[videoItem.id] = el; }}
                            src={parsed.embedUrl}
                            poster={posterSrc}
                            loop
                            muted={isMuted}
                            playsInline
                            preload="none"
                            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
                              }`}
                          />
                        ) : (
                          <WorkVideoPosterImage
                            src={posterSrc}
                            alt={videoItem.title || 'Film Reel'}
                          />
                        )}

                        {/* ROTATOR RING PLAY BUTTON */}
                        {!isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors z-20">
                            <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                              {/* Animated Ring */}
                              <svg className="w-full h-full animate-spin-ring" viewBox="0 0 100 100">
                                <path
                                  id={`circlePath-${videoItem.id}`}
                                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                  fill="none"
                                />
                                <text className="text-[9px] font-mono font-bold uppercase fill-white tracking-widest">
                                  <textPath href={`#circlePath-${videoItem.id}`}>
                                    PLAY FILM • CRE8TIVECOVE • REEL #{idx + 1} •&nbsp;
                                  </textPath>
                                </text>
                              </svg>

                              {/* Center Play Button Glass */}
                              <button
                                type="button"
                                aria-label={`Play ${videoItem.title || 'Video'}`}
                                className="play-button-glass absolute w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-[#0a0a0a]"
                              >
                                <Play className="w-5 h-5 fill-black ml-0.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {isPlaying && (
                      <div
                        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-mono border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            if (parsed.type === 'direct') {
                              toggleVideoPlay(videoItem.id);
                            } else {
                              setIsPlayingInline((prev) => ({ ...prev, [videoItem.id]: false }));
                            }
                          }}
                          className="p-1 hover:text-[#C0FF4A] transition-colors flex items-center gap-1 font-bold"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Pause Film</span>
                        </button>
                        {parsed.type === 'direct' && (
                          <button
                            onClick={(e) => toggleVideoMute(e, videoItem.id)}
                            className="p-1 hover:text-[#C0FF4A] transition-colors"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {videoItem.caption && (
                    <div className="bg-[#121212] text-[#f5f0e6] px-6 py-3 flex items-center justify-between font-mono text-xs border-t border-white/10">
                      <span className="uppercase text-gray-400">{videoItem.caption}</span>
                      <span className="text-[#C0FF4A] flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3" /> FILM REEL #{idx + 1}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* CREATIVE DIRECTION NARRATIVE */}
          <section className="px-4 sm:px-6 md:px-12 max-w-auto mx-auto mb-24 text-[#0a0a0a]">
            <div className="mb-6" data-reveal="slideup">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-black/60">
                {workData.creativeDirectionHeader || 'CREATIVE DIRECTION'}
              </span>
            </div>

            {workData.creativeDirectionBody1 && (
              <p data-reveal="title" className="font-sans text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed tracking-tight text-[#1a1a1a] mb-10">
                {workData.creativeDirectionBody1}
              </p>
            )}

            {workData.creativeDirectionSubhead && (
              <h3 data-reveal="slideup" className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-black/70 mb-4">
                {workData.creativeDirectionSubhead}
              </h3>
            )}

            {workData.creativeDirectionBody2 && (
              <p data-reveal="slideup" data-delay="0.1" className="font-sans text-lg sm:text-xl font-normal leading-relaxed text-[#2a2a2a] mb-10">
                {workData.creativeDirectionBody2}
              </p>
            )}

            {workData.tagline && (
              <div className="pt-6 border-t border-black/15">
                <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-black/80">
                  {workData.tagline}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* SECTION 2: DARK TESTIMONIAL & FOOTER THEME (#0A0A0A) */}
        <div data-color="#0a0a0a" className="w-full bg-[#0a0a0a] text-[#f5f0e6] py-24 px-4 sm:px-8 md:px-16 border-t border-white/10">

          {/* CLIENT FEEDBACK QUOTE */}
          {workData.quote && (
            <section className="max-w-auto mx-auto mb-24" data-reveal="card">
              <div className="mb-8 border-b border-white/15 pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  WHAT THEY SAID
                </span>
              </div>
              <blockquote className="font-sans text-2xl sm:text-4xl lg:text-5xl font-medium leading-snug tracking-tight text-[#f5f0e6] mb-8">
                &ldquo;{workData.quote.text}&rdquo;
              </blockquote>
              <div className="font-mono text-xs sm:text-sm tracking-widest uppercase text-gray-400 pt-4 border-t border-white/10">
                <p className="text-white font-bold">{workData.quote.author}</p>
                <p className="text-gray-400">{workData.quote.role} — {workData.quote.company}</p>
              </div>
            </section>
          )}

          {/* SERVICES DELIVERED */}
          <section className="max-w-auto mx-auto mb-24">
            <div className="mb-8" data-reveal="slideup">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                WHAT WE DID
              </span>
            </div>

            <ul className="flex flex-col border-t border-white/15 pt-4">
              {workData.services.map((service, i) => (
                <li
                  key={i}
                  data-reveal="slideup"
                  data-delay={i * 0.08}
                  className={`font-serif text-2xl sm:text-4xl md:text-5xl font-normal tracking-wide cursor-default flex items-center justify-between py-5 border-b border-white/10 transition-colors duration-300 ${i === 0 ? 'text-white' : 'text-white/35 hover:text-white'
                    }`}
                >
                  <span>{service}</span>
                  <span className="font-mono text-xs uppercase text-gray-500">0{i + 1}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* NEXT CASE STUDY LINK */}
          {workData.nextProject && (
            <section className="max-w-auto mx-auto mb-20" data-reveal="card">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  NEXT PROJECT →
                </span>
                <Link
                  href={`/work/${workData.nextProject.slug}`}
                  className="font-mono text-xs uppercase tracking-widest text-[#C0FF4A] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Explore Story</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <NextProjectCard nextProject={workData.nextProject} />
            </section>
          )}

          {/* CUBOID MARQUEE STRIP */}
          <CuboidMarquee href="/work" text="SEE MORE WORK • CRE8TIVECOVE • LEAN MEAN STORYTELLING MACHINE •" />

          {/* ACCREDITATIONS FOOTER */}
          <div className="max-w-auto mx-auto pt-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <span className="font-condensed text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#f5f0e6]">
                CRE8TIVECOVE (C8C)
              </span>
              <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                Women Owned & Certified Creative Production Studio
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 font-mono text-xs uppercase tracking-widest text-[#f5f0e6] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C0FF4A]" />
                <span>WOMEN OWNED</span>
              </div>
              <div className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 font-mono text-xs uppercase tracking-widest text-[#f5f0e6]">
                WBENC CERTIFIED
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-[#C0FF4A] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg"
              >
                Inquire Project
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default WorkDetailClient;