'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

import PageWrapper from '@/components/PageWrapper';
import ClientLogosSection from '@/app/ClientLogosSection';
import './Services.css';

function SafeCollageImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || '/images/stock/stock-service.jpg');

  useEffect(() => {
    setImgSrc(src || '/images/stock/stock-service.jpg');
  }, [src]);

  return (
    <Image
      src={imgSrc || '/images/stock/stock-service.jpg'}
      alt={alt}
      fill
      className={className}
      onError={() => setImgSrc('/images/stock/stock-service.jpg')}
    />
  );
}

interface ServiceVideoTextProps {
  slug: string;
  title: string;
  isSerif: boolean;
  videoUrl?: string;
  imageUrl: string;
  number: string;
  tagline?: string;
}

function ServiceVideoText({
  slug,
  title,
  imageUrl,
  number,
  tagline,
}: ServiceVideoTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/services/${slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block py-8 sm:py-12 border-b border-white/15 hover:border-white/40 transition-all duration-300 w-full cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-baseline gap-4 sm:gap-8">
          <span className="font-mono text-sm sm:text-base font-bold text-white/40 group-hover:text-[#ffd700] transition-colors shrink-0 pt-2 sm:pt-0">
            [{number}]
          </span>

          <div className="flex flex-col">
            <h2
              className={`font-sans font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight transition-all duration-300 select-none ${
                isHovered
                  ? 'scale-[1.01] drop-shadow-[0_15px_30px_rgba(255,215,0,0.2)]'
                  : 'text-white/90 group-hover:text-white'
              }`}
              style={
                isHovered
                  ? {
                      backgroundImage: `url(${imageUrl || '/images/stock/stock-service.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }
                  : undefined
              }
            >
              {title}
            </h2>

            {tagline && (
              <p className="font-mono text-xs sm:text-sm text-gray-400 group-hover:text-gray-200 uppercase tracking-wider mt-3 transition-colors max-w-2xl">
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* CTA HOVER PILL */}
        <div className="flex items-center gap-2 pl-8 md:pl-0 pt-2 md:pt-0">
          <div className="px-4 py-2 rounded-full border border-white/20 bg-white/5 font-mono text-xs uppercase tracking-widest text-white/60 group-hover:bg-[#ffd700] group-hover:text-black group-hover:border-[#ffd700] transition-all duration-300 flex items-center gap-1.5 font-bold shadow-lg">
            <span>EXPLORE</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

const defaultServiceItems = [
  {
    id: 's1',
    slug: 'brand-identity',
    title: 'Brand Identity & Creative Strategy',
    isSerif: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    number: '01',
    tagline: 'Master Logo Suite • Brand Guidelines Manual • Typography & Color Tokens',
  },
  {
    id: 's2',
    slug: 'cgi-3d-motion-design',
    title: 'CGI & 3D Motion Design',
    isSerif: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    number: '02',
    tagline: 'High-Resolution 3D Renders • 3D Motion Video Clips • Interactive 3D Assets',
  },
  {
    id: 's3',
    slug: 'video-production',
    title: 'Video Production & Commercial Shoots',
    isSerif: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    number: '03',
    tagline: 'Master Broadcast Film • Social Media Edits • Behind-The-Scenes Cut',
  },
  {
    id: 's4',
    slug: 'ai-ads-creatives',
    title: 'AI Ads & Creatives',
    isSerif: false,
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    number: '04',
    tagline: 'Generative Visuals • Hyper-Targeted Ad Creatives • AI Video Production • Rapid Iteration',
  },
  {
    id: 's5',
    slug: 'event-coverage-content-production',
    title: 'Event Coverage & Content Production',
    isSerif: false,
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    number: '05',
    tagline: 'Keynote & Panel Filming • Same-Day Social Reels • Highlight Films • Multi-Cam Live Feeds',
  },
  {
    id: 's6',
    slug: 'digital-content-campaign-strategy',
    title: 'Digital Content & Campaign Strategy',
    isSerif: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    number: '06',
    tagline: 'Omnichannel Campaign Strategy • Social Media Visuals • Infographics & Carousels • High-Converting Ad Copy',
  },
];

const defaultProcessRows = [
  {
    number: '01',
    title: 'Research\n& Strategy',
    description: 'We don’t just shoot scripts; we figure out why people will want to watch them.',
  },
  {
    number: '02',
    title: 'Concept &\nScriptwriting',
    description: 'Leaning on the research, we craft a storyline that paves the way for your product or service to swoop in for the save.',
  },
  {
    number: '03',
    title: 'Art Direction\n& Design',
    description: 'Our designers make sure all your assets are artfully connected so your campaign feels like an extension of your brand.',
  },
  {
    number: '04',
    title: 'Cast\nTalent',
    description: 'Whether we’re casting in Atlanta or Charlotte, NYC or LA, our director encourages actors to bring the unexpected to the table.',
  },
  {
    number: '05',
    title: 'Location',
    description: 'With the help of scouts and years of collecting fave locales, we determine where the most “wow” can happen.',
  },
  {
    number: '06',
    title: 'Pre-production',
    description: 'Whether your project is a one-day shoot or a weeklong production, we strategically match our A-list crew and equipment to your needs.',
  },
  {
    number: '07',
    title: 'Shoot Day',
    description: 'Welcome to game day. It’s time to serve up the perfect cocktail of Zen and excitement.',
  },
  {
    number: '08',
    title: 'Edit, Post\n& VFX',
    description: 'Now our editors create multiple storylines to best capture your script. VFX team is on deck to create surreal kingdoms.',
  },
  {
    number: '09',
    title: 'Release it\ninto the wild',
    description: 'We hand over your baby. Standing by to give you additional cuts, new renditions, whatever you need to maximize your investment.',
  },
];

interface ServicesPageClientProps {
  initialServices?: any[];
  processSteps?: any[];
  testimonials?: any[];
  clients?: any[];
  siteSettings?: any;
}

export default function ServicesPageClient({
  initialServices,
  processSteps,
  testimonials: initialTestimonials,
  clients: initialClients,
}: ServicesPageClientProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const [dbServices, setDbServices] = useState<any[]>(initialServices || []);
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials || []);
  const [clients, setClients] = useState<any[]>(initialClients || []);

  useEffect(() => {
    fetch('/api/public/services?category=CREATIVE')
      .then((res) => res.json())
      .then((data) => {
        if (data.services && Array.isArray(data.services) && data.services.length > 0) {
          setDbServices(data.services);
        }
      })
      .catch(() => { });

    fetch('/api/public/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => { });

    fetch('/api/public/clients')
      .then((res) => res.json())
      .then((data) => {
        if (data.clients && Array.isArray(data.clients)) {
          setClients(data.clients);
        }
      })
      .catch(() => { });
  }, []);

  const activeServiceItems =
    dbServices.length > 0
      ? dbServices.map((s, idx) => ({
        id: s.id,
        slug: s.slug || s.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: s.title || s.name,
        isSerif: idx % 2 === 1,
        videoUrl: s.video || s.hoverVideo || s.hoverVideoUrl || 'https://vjs.zencdn.net/v/oceans.mp4',
        imageUrl: s.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        number: String(idx + 1).padStart(2, '0'),
        tagline: s.description || s.tagline || 'Specialized Creative Capability',
      }))
      : defaultServiceItems;

  const activeProcessRows = defaultProcessRows;

  useGSAP(
    () => {
      gsap.fromTo(
        '.hero-heading',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-video-box',
        { opacity: 0, scale: 0.96, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' }
      );
    },
    { scope: containerRef }
  );

  return (
    <PageWrapper>
      <div ref={containerRef} className="services-page w-full font-sans text-black selection:bg-[#ffd700] selection:text-black">

        <section className="relative bg-[#f5f0e6] pt-32 sm:pt-40 pb-16 px-6 md:px-12 overflow-hidden text-center">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center">
            {/* CATEGORY SWITCHER */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6 z-20 relative">
              <div className="px-5 py-2 rounded-full bg-black text-[#ffd700] border border-black font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
                <span>Creative & Film Services</span>
              </div>
              <Link
                href="/technology"
                className="px-5 py-2 rounded-full border border-black/15 bg-white/70 hover:bg-black hover:text-[#f5f0e6] font-mono text-xs uppercase tracking-widest transition-all font-bold shadow-sm"
              >
                Technology Services (11) →
              </Link>
            </div>

            <h1 className="hero-heading font-condensed text-[12vw] sm:text-[13vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-normal text-black select-none text-center mb-[-3vw] sm:mb-[-4vw] z-10 relative">
              SO WHAT DO
              <br />
              Y&apos;ALL DO?
            </h1>

            <div className="hero-video-box w-full max-w-[1500px] mx-auto aspect-[16/9] sm:aspect-[21/9] md:h-[580px] lg:h-[640px] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden relative shadow-2xl z-0 border border-black/10">
              <video
                ref={heroVideoRef}
                src="https://vjs.zencdn.net/v/oceans.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />

              <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center justify-center">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                  <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <path
                      id="circlePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="text-[9px] font-mono font-bold uppercase fill-white tracking-widest">
                      <textPath href="#circlePath">
                        IRL CALL • LOL • LISTEN TO THIS LADY! •&nbsp;
                      </textPath>
                    </text>
                  </svg>
                  <button className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f0e6] py-20 md:py-32 px-6 md:px-16 text-left border-b border-black/10">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl text-black font-normal leading-[1.02] tracking-tight">
              We make stuff that sells stuff.
            </h2>

            <div className="flex flex-col gap-8 font-sans text-lg sm:text-2xl text-black/90 font-normal leading-relaxed max-w-4xl pt-4">
              <p>
                Usually, this translates to a commercial. Or a commercial campaign for broadcast or streaming channels. How do we do it? We get to know each other.
              </p>
              <p>
                From the moment we all decide we’re a good fit, we consider your team an extension of ours. We join forces with ad agencies, internal marketing teams and direct clients alike. What matters to us is that your team is ready to push it. To give a respectful nod to the rules, and then crush them.
              </p>
              <p className="font-medium text-black">
                And so, the fun begins.
              </p>
              <p>
                If you want to know more about our production process, give us a call. We’re happy to give you the play-by-play. Or, if you’re the rare bird that likes to read words, here’s an outline.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#0a0a0a] text-[#f5f0e6] py-28 px-6 md:px-16">
          <div className="max-w-[1600px] mx-auto">
            <div className="pb-4 border-b border-white/20 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest block mb-2">
                  THINGS WE DO WELL
                </span>
                <span className="font-sans text-sm text-gray-400">
                  Select any service to explore its methodology, deliverables, and case studies.
                </span>
              </div>
              <span className="font-mono text-xs text-gray-400 uppercase tracking-widest hidden sm:inline-block">
                [ {activeServiceItems.length} DISCIPLINES ]
              </span>
            </div>

            <div className="flex flex-col text-left">
              {activeServiceItems.map((item, idx) => (
                <ServiceVideoText
                  key={item.id || idx}
                  slug={item.slug}
                  title={item.title}
                  isSerif={item.isSerif}
                  videoUrl={item.videoUrl}
                  imageUrl={item.imageUrl}
                  number={item.number || String(idx + 1).padStart(2, '0')}
                  tagline={item.tagline}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0a0a0a] py-24 px-6 md:px-12 overflow-hidden border-b border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 relative py-12">
            <div className="w-full md:w-[380px] aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl transform md:-rotate-6 md:translate-x-12 z-10 border border-white/10">
              <SafeCollageImage
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
                alt="Collage Left"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="w-full md:w-[460px] aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl z-20 border border-white/20 scale-105">
              <SafeCollageImage
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Collage Center"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="w-full md:w-[380px] aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl transform md:rotate-6 md:-translate-x-12 z-10 border border-white/10">
              <SafeCollageImage
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
                alt="Collage Right"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#0a0a0a] text-[#f5f0e6] py-28 px-6 md:px-12 text-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
            <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest block">
              OUR PROCESS IS WHAT MAKES US DIFFERENT
            </span>

            <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#f5f0e6] leading-tight font-normal max-w-4xl py-12 border-y border-white/15 my-4">
              &ldquo;There&apos;s a good reason you have so much fun on the day of your shoot — you&apos;ve earned it.&rdquo;
            </h2>
          </div>
        </section>

        <section className="bg-[#f5f0e6] py-28 px-6 md:px-16 text-left border-b border-black/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="pb-4 border-b border-black/20 mb-16">
              <span className="font-mono text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-widest block">
                HOW IT USUALLY WORKS
              </span>
            </div>

            <div className="flex flex-col">
              {activeProcessRows.map((row: any) => (
                <div
                  key={row.number}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-12 border-b border-black/15 group hover:bg-black/[0.02] transition-colors duration-300"
                >
                  <div className="md:col-span-2 font-mono text-3xl sm:text-4xl font-bold text-black/40 group-hover:text-black transition-colors">
                    [{row.number}]
                  </div>

                  <div className="md:col-span-5 font-condensed text-4xl sm:text-6xl font-black uppercase text-black leading-none tracking-tight group-hover:translate-x-2 transition-transform duration-300 whitespace-pre-line">
                    {row.title}
                  </div>

                  <div className="md:col-span-5 font-sans text-base sm:text-lg text-black/80 leading-relaxed pt-2">
                    {row.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f0e6] py-28 px-6 md:px-16 text-center border-b border-black/10">
          <div className="max-w-5xl mx-auto">
            <h3 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-black leading-snug font-normal">
              &ldquo;Here&apos;s the deal. Whatever you do, whoever you do it with, it should lead to a good time. If you&apos;re not having fun, you&apos;re not doing great work.&rdquo;
            </h3>
          </div>
        </section>

        <section className="bg-[#f5f0e6] py-28 px-6 md:px-16 text-left">
          <div className="max-w-[1600px] mx-auto">
            <div className="pb-4 border-b border-black/20 mb-12">
              <span className="font-mono text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-widest block">
                CLIENT FEEDBACK
              </span>
            </div>

            <div className="max-w-5xl flex flex-col gap-12">
              {(testimonials && testimonials.length > 0 ? testimonials : [
                {
                  quote: "Working with Cre8tiveCove was easily the most seamless and rewarding creative partnership our marketing team has ever experienced. They took a complex message and turned it into an award-winning campaign that crushed our conversion metrics.",
                  name: "SARAH JENKINS",
                  designation: "VP OF BRAND MARKETING",
                  company: "SKYLA CREDIT UNION"
                }
              ]).map((t, idx) => (
                <div key={t.id || idx} className="flex flex-col gap-6">
                  <blockquote className="font-serif italic text-2xl sm:text-4xl text-black leading-relaxed font-normal">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <div className="font-mono text-xs sm:text-sm text-black font-bold uppercase tracking-wider">
                    {t.name} — {t.designation}, {t.company}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div id="clients-section" className="relative w-full">
          <ClientLogosSection clientList={clients} />
        </div>

        <section className="bg-[#0a0a0a] text-[#f5f0e6] pt-28 pb-16 px-6 md:px-16 text-center border-t border-white/10">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center">
            <Link
              href="/contact"
              className="group font-condensed text-[10vw] sm:text-[11vw] md:text-[12vw] font-black uppercase text-[#f5f0e6] hover:text-[#ffd700] leading-[0.85] tracking-tighter text-center transition-all duration-500 block hover:scale-[1.01] mb-20"
            >
              LET&apos;S TALK ABOUT A PROJECT
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}