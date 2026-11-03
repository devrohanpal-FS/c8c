'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Sparkles,
  Film,
  Flame,
  Box,
  Video,
  Camera,
} from 'lucide-react';

import PageWrapper from '@/components/PageWrapper';
import SectionWrapper from '@/components/SectionWrapper';
import { parseVideoUrl } from '@/lib/utils';
import './Work.css';

export interface WorkItem {
  id: string;
  number: string;
  title: string;
  client: string;
  category: string;
  slug: string;
  image: string;
  video: string;
  featured?: boolean;
}

const workArchive: WorkItem[] = [
  {
    id: '1',
    number: '01',
    title: 'TVC- SBI Foreign Card',
    client: 'State Bank of India (SBI)',
    category: 'TVC & Commercials',
    slug: 'tvc-sbi-foreign-card',
    image: '/uploads/media_1789716925770_1926afe5529db945.webp',
    video: '/uploads/media_1789641018034_c785dac94a320847.mp4',
    featured: true,
  },
  {
    id: '2',
    number: '02',
    title: 'WARIVO New EV Scooter',
    client: 'WARIVO Motors',
    category: 'TVC & Commercials',
    slug: 'warivo-new-ev-scooter',
    image: '/uploads/media_1790317167178_9f8fd034136f906b.webp',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: true,
  },
  {
    id: '3',
    number: '03',
    title: 'Digital Ad - ECODET',
    client: 'ECODET',
    category: 'Brand Campaigns',
    slug: 'digital-ad-ecodet',
    image: '/uploads/media_1789712476931_2390ae4a260c6b9f.png',
    video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    featured: true,
  },
  {
    id: '4',
    number: '04',
    title: 'Drone Flythrough',
    client: 'Real Estate & Architecture Studio',
    category: 'Corporate AV & Testimonials',
    slug: 'drone-flythrough',
    image: '/uploads/media_1789645040441_8156aa071d1b958d.jpg',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    featured: true,
  },
  {
    id: '5',
    number: '05',
    title: 'Neuro Equilibrium Vertigo Clinic',
    client: 'NeuroEquilibrium Diagnostic Systems',
    category: 'Corporate AV & Testimonials',
    slug: 'neuro-equilibrium-vertigo-clinic',
    image: '/uploads/media_1790317263343_1a8f8ea6fd90b213.webp',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: true,
  },
  {
    id: '6',
    number: '06',
    title: 'Barco at GITEX GLOBAL 2025 Dubai',
    client: 'Barco Visual Solutions',
    category: 'CGI & AI Commercials',
    slug: 'barco-at-gitex-global-2025-dubai',
    image: '/uploads/media_1789640757160_d4e2ed81fbdc0699.png',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    featured: true,
  },
  {
    id: '7',
    number: '07',
    title: 'Bajaj Insurance',
    client: 'Bajaj Allianz',
    category: 'Brand Campaigns',
    slug: 'bajaj-insurance',
    image: '/uploads/media_1790317334958_9020ba24327380de.webp',
    video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    featured: true,
  },
  {
    id: '8',
    number: '08',
    title: 'Bharat Gas',
    client: 'Bharat Petroleum (BPCL)',
    category: 'Brand Campaigns',
    slug: 'bharat-gas',
    image: '/uploads/media_1789716642256_dbd919690b02362a.webp',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    featured: true,
  },
  {
    id: '9',
    number: '09',
    title: 'SBI YONO Logo Launch',
    client: 'SBI YONO',
    category: 'Brand Campaigns',
    slug: 'sbi-yono-logo-launch',
    image: '/uploads/media_1789645370035_7d71477fba6f51e1.png',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    featured: true,
  },
  {
    id: '10',
    number: '10',
    title: 'Xtended Space Through',
    client: 'Xtended Space',
    category: 'Corporate AV & Testimonials',
    slug: 'xtended-space-through',
    image: '/uploads/media_1789645284182_7ee3f75c6acdfd77.png',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: false,
  },
  {
    id: '11',
    number: '11',
    title: 'GST Motion Explainer',
    client: 'Ministry of Finance',
    category: 'CGI & AI Commercials',
    slug: 'gst',
    image: '/uploads/media_1789645418345_61ded377282767a6.png',
    video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    featured: false,
  },
  {
    id: '12',
    number: '12',
    title: 'The Players Club',
    client: 'SC Education Lottery',
    category: 'TVC & Commercials',
    slug: 'the-players-club',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: true,
  },
  {
    id: '13',
    number: '13',
    title: 'Skyla Credit Union',
    client: 'Skyla Financial',
    category: 'Brand Campaigns',
    slug: 'skyla-credit-union',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: true,
  },
  {
    id: '14',
    number: '14',
    title: 'Conversations',
    client: 'DAODAS',
    category: 'Brand Campaigns',
    slug: 'conversations',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    featured: true,
  },
  {
    id: '15',
    number: '15',
    title: 'Midlands Tech',
    client: 'Follow Your Inner Maverick',
    category: 'CGI & AI Commercials',
    slug: 'midlands-tech',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    featured: true,
  },
  {
    id: '16',
    number: '16',
    title: "Work Doesn't Work",
    client: 'SC DHEC',
    category: 'TVC & Commercials',
    slug: 'work-doesnt-work',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: true,
  },
  {
    id: '17',
    number: '17',
    title: 'Vogue Luxe Fashion Editorial',
    client: 'Vogue & High Fashion Studio',
    category: 'Photoshoot',
    slug: 'vogue-luxe-fashion-editorial',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: true,
  },
  {
    id: '18',
    number: '18',
    title: 'Aura Premium Product Line',
    client: 'Aura Lifestyle & Cosmetics',
    category: 'Photoshoot',
    slug: 'aura-premium-product-line',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    featured: false,
  },
];

export interface CategoryItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WORK_CATEGORIES: CategoryItem[] = [
  { key: 'All', label: 'All', icon: Sparkles },
  { key: 'TVC & Commercials', label: 'TVC & Commercials', icon: Film },
  { key: 'Brand Campaigns', label: 'Brand Campaigns', icon: Flame },
  { key: 'CGI & AI Commercials', label: 'CGI & AI Commercials', icon: Box },
  { key: 'Corporate AV & Testimonials', label: 'Corporate AV & Testimonials', icon: Video },
  { key: 'Photoshoot', label: 'Photoshoot', icon: Camera },
];

/**
 * Format project title into clean Title Case while preserving uppercase acronyms
 */
function formatWorkTitle(title: string): string {
  if (!title) return '';
  const trimmed = title.trim();

  const acronyms = new Set([
    'SBI', 'EV', 'ECODET', 'FPV', 'GITEX', 'BPCL', 'YONO', 'GST', 'VFX', 'TVC',
    '3D', 'AI', 'UI', 'UX', 'C8C', 'DHEC', 'DAODAS', 'SC'
  ]);

  const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'with']);

  const isAllUpper = trimmed === trimmed.toUpperCase();
  if (!isAllUpper) {
    return trimmed;
  }

  const words = trimmed.toLowerCase().split(/\s+/);
  return words
    .map((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      if (acronyms.has(cleanWord)) {
        return word.toUpperCase();
      }
      if (index > 0 && minorWords.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Helper to match category cleanly
 */
function matchesCategory(work: WorkItem, selectedCategory: string): boolean {
  if (selectedCategory === 'All') return true;

  const cat = (work.category || '').toLowerCase().trim();
  const title = (work.title || '').toLowerCase().trim();
  const sel = selectedCategory.toLowerCase().trim();

  // 1. Exact or direct string inclusion
  if (cat === sel || cat.includes(sel) || sel.includes(cat)) {
    return true;
  }

  // 2. TVC & Commercials
  if (selectedCategory === 'TVC & Commercials') {
    return (
      cat.includes('tvc') ||
      cat.includes('commercial') ||
      cat.includes('film') ||
      cat.includes('automotive') ||
      cat.includes('cinematography') ||
      title.includes('tvc') ||
      title.includes('warivo') ||
      title.includes('players') ||
      title.includes('work doesn')
    );
  }

  // 3. Brand Campaigns
  if (selectedCategory === 'Brand Campaigns') {
    return (
      cat.includes('campaign') ||
      cat.includes('brand') ||
      cat.includes('strategy') ||
      cat.includes('identity') ||
      cat.includes('advertising') ||
      title.includes('bharat') ||
      title.includes('bajaj') ||
      title.includes('ecodet') ||
      title.includes('yono') ||
      title.includes('conversations') ||
      title.includes('skyla')
    );
  }

  // 4. CGI & AI Commercials
  if (selectedCategory === 'CGI & AI Commercials') {
    return (
      cat.includes('cgi') ||
      cat.includes('ai') ||
      cat.includes('3d') ||
      cat.includes('vfx') ||
      cat.includes('webgl') ||
      cat.includes('motion craft') ||
      cat.includes('motion graphics') ||
      cat.includes('explainer') ||
      title.includes('midlands') ||
      title.includes('gst')
    );
  }

  // 5. Corporate AV & Testimonials
  if (selectedCategory === 'Corporate AV & Testimonials') {
    return (
      cat.includes('corporate') ||
      cat.includes('av') ||
      cat.includes('testimonial') ||
      cat.includes('healthcare') ||
      cat.includes('event technology') ||
      cat.includes('aerial') ||
      cat.includes('drone') ||
      cat.includes('virtual tour') ||
      cat.includes('360') ||
      title.includes('neuro') ||
      title.includes('drone') ||
      title.includes('barco') ||
      title.includes('xtended')
    );
  }

  // 6. Photoshoot
  if (selectedCategory === 'Photoshoot') {
    return (
      cat.includes('photoshoot') ||
      cat.includes('photo') ||
      cat.includes('still') ||
      cat.includes('print') ||
      cat.includes('editorial') ||
      cat.includes('lifestyle') ||
      title.includes('photoshoot') ||
      title.includes('photo') ||
      title.includes('vogue') ||
      title.includes('aura')
    );
  }

  return false;
}

interface WorkCardProps {
  work: WorkItem;
  index: number;
}

function ShowcaseCard({ work, index }: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parsedVideo = parseVideoUrl(work.video);

  const displayTitle = formatWorkTitle(work.title);
  const posterImage =
    work.image ||
    parsedVideo.defaultThumbnail ||
    '/images/stock/stock-work.jpg';

  const [imgSrc, setImgSrc] = useState(posterImage);

  useEffect(() => {
    setImgSrc(work.image || parsedVideo.defaultThumbnail || '/images/stock/stock-work.jpg');
  }, [work.image, parsedVideo.defaultThumbnail]);

  useEffect(() => {
    if (parsedVideo.type === 'direct' && videoRef.current) {
      if (isHovered) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, parsedVideo.type]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25) }}
      className="work-showcase-card w-full"
    >
      <Link
        href={`/work/${work.slug}`}
        className="group block focus:outline-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Media Thumbnail Container */}
        <div className="relative aspect-[4/3.5] sm:aspect-square w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#131615] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.45)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] group-hover:border-white/[0.2] transition-all duration-500">
          {/* Base image */}
          <Image
            src={imgSrc || '/images/stock/stock-work.jpg'}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => setImgSrc('/images/stock/stock-work.jpg')}
          />

          {/* Direct Video preview on hover */}
          {parsedVideo.type === 'direct' && parsedVideo.embedUrl && (
            <video
              ref={videoRef}
              src={parsedVideo.embedUrl}
              muted
              loop
              playsInline
              preload="none"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          )}

          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />

          {/* Hover Arrow Badge */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-[#0a0a0a]/75 backdrop-blur-md border border-white/20 text-[#ffd700] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl pointer-events-none">
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Card Typography below media */}
        <div className="pt-4 sm:pt-5 pb-2 px-1">
          <h2 className="font-sans font-bold text-lg sm:text-xl lg:text-[22px] text-white tracking-tight leading-snug group-hover:text-[#ffd700] transition-colors duration-300 line-clamp-1">
            {displayTitle}
          </h2>

          <div className="text-sm sm:text-base text-neutral-400 font-normal mt-1 flex items-center justify-between">
            <span className="truncate">{work.category}</span>
            {work.featured && (
              <span
                className="w-2 h-2 rounded-full bg-[#ffd700] inline-block shadow-[0_0_8px_rgba(255,215,0,0.85)] flex-shrink-0"
                title="Featured Project"
              />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export interface WorkSummaryItem {
  id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  year?: string | null;
  desc?: string | null;
  media?: string | null;
  heroMedia?: string | null;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  heroVideoUrl?: string | null;
  projectVideoUrl?: string | null;
  featured?: boolean;
}

export interface WorkPageClientProps {
  initialWorks?: WorkSummaryItem[];
}

export default function WorkPageClient({ initialWorks }: WorkPageClientProps = {}) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [dbWorks, setDbWorks] = useState<WorkItem[]>(() => {
    if (initialWorks && initialWorks.length > 0) {
      return initialWorks.map((w: WorkSummaryItem, idx: number) => ({
        id: w.id || String(idx),
        number: String(idx + 1).padStart(2, '0'),
        title: w.title || '',
        client: w.client || 'CRE8TIVECOVE PARTNER',
        category: w.category || 'TVC & Commercials',
        slug: w.slug,
        image: w.media || w.thumbnailUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        video: w.videoUrl || w.projectVideoUrl || 'https://vjs.zencdn.net/v/oceans.mp4',
        featured: Boolean(w.featured),
      }));
    }
    return [];
  });

  useEffect(() => {
    fetch('/api/public/work')
      .then((res) => res.json())
      .then((data) => {
        if (data.works && Array.isArray(data.works) && data.works.length > 0) {
          const mapped: WorkItem[] = data.works.map((w: WorkSummaryItem, idx: number) => ({
            id: w.id,
            number: String(idx + 1).padStart(2, '0'),
            title: w.title || '',
            client: w.client || 'CRE8TIVECOVE PARTNER',
            category: w.category || 'TVC & Commercials',
            slug: w.slug,
            image: w.thumbnailUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
            video: w.heroVideoUrl || w.projectVideoUrl || 'https://vjs.zencdn.net/v/oceans.mp4',
            featured: Boolean(w.featured),
          }));
          setDbWorks(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const activeWorks = dbWorks.length > 0 ? dbWorks : workArchive;

  // Calculate live count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    WORK_CATEGORIES.forEach((cat) => {
      if (cat.key === 'All') {
        counts[cat.key] = activeWorks.length;
      } else {
        counts[cat.key] = activeWorks.filter((w) => matchesCategory(w, cat.key)).length;
      }
    });
    return counts;
  }, [activeWorks]);

  // Filter works by category
  const filteredWorks = useMemo(() => {
    return activeWorks.filter((work) => matchesCategory(work, activeCategory));
  }, [activeWorks, activeCategory]);

  return (
    <PageWrapper>
      <div className="work-page relative w-full min-h-screen bg-[#0a0a0a] text-[#f5f0e6] overflow-hidden">
        {/* Ambient Atmosphere Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#ffd700]/[0.03] rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Architectural Background Grid Lines */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-0">
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="border-x border-white/[0.04] h-full" />
            <div className="border-r border-white/[0.04] h-full hidden md:block" />
            <div className="border-r border-white/[0.04] h-full hidden lg:block" />
          </div>
        </div>

        {/* Header Section */}
        <SectionWrapper className="pt-32 sm:pt-36 md:pt-40 pb-6 sm:pb-10 px-4 sm:px-8 text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-[#ffd700] uppercase tracking-widest mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO & ARCHIVE</span>
          </div>

          <h1 className="font-condensed text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-none text-[#f5f0e6] mb-4">
            SELECTED WORK
          </h1>

          <p className="font-sans text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            A showcase of commercial films, brand identities, and high-impact digital experiences engineered by Cre8tiveCove.
          </p>
        </SectionWrapper>

        {/* Floating Category Filter Capsule Bar with Icons and Count Badges */}
        <div className="flex justify-center mb-10 sm:mb-14 px-4 relative z-20">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#111413]/90 backdrop-blur-xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.55)] max-w-full overflow-x-auto scrollbar-none">
            {WORK_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              const count = categoryCounts[cat.key] ?? 0;
              const IconComponent = cat.icon;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap focus:outline-none ${
                    isActive
                      ? 'text-[#0a0a0a] font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 rounded-full bg-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.35)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}

                  {/* Category Icon */}
                  <span
                    className={`relative z-10 transition-colors ${
                      isActive ? 'text-[#0a0a0a]' : 'text-neutral-400 group-hover:text-[#ffd700]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>

                  {/* Category Label */}
                  <span className="relative z-10">{cat.label}</span>

                  {/* Count Badge */}
                  <span
                    className={`relative z-10 text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#0a0a0a]/20 text-[#0a0a0a] font-bold'
                        : 'bg-white/10 text-neutral-400 group-hover:text-white'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Portfolio Cards Grid */}
        <SectionWrapper className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((item, index) => (
                <ShowcaseCard key={item.id} work={item} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredWorks.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-neutral-400 text-base mb-4 font-sans">
                No projects found under &ldquo;{activeCategory}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="px-6 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors"
              >
                Show All Projects
              </button>
            </div>
          )}

          {/* Bottom Inquiry CTA */}
          <div className="mt-24 sm:mt-32 text-center border-t border-white/10 pt-16 pb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-[#ffd700] mb-3">
              HAVE A VISION IN MIND?
            </p>
            <h2 className="font-condensed text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#f5f0e6] mb-6">
              LET&apos;S CREATE SOMETHING REMARKABLE
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#ffd700] text-[#0a0a0a] font-bold text-sm uppercase tracking-wider hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(255,215,0,0.3)]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </SectionWrapper>
      </div>
    </PageWrapper>
  );
}