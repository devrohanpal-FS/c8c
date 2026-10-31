'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  BrainCircuit,
  Bot,
  MessageSquare,
  Cpu,
  Layers,
  Webhook,
  Compass,
  Camera,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import CuboidMarquee from '@/components/CuboidMarquee';
import './Technology.css';

interface TechServiceItem {
  id: string;
  slug: string;
  number: string;
  categoryTag: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  iconName?: string;
}

function TechCardImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || '/images/stock/stock-tech.jpg');

  useEffect(() => {
    setImgSrc(src || '/images/stock/stock-tech.jpg');
  }, [src]);

  return (
    <Image
      src={imgSrc || '/images/stock/stock-tech.jpg'}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 400px"
      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
      onError={() => setImgSrc('/images/stock/stock-tech.jpg')}
    />
  );
}

const defaultTechServices: TechServiceItem[] = [
  {
    id: 't1',
    slug: 'web-development',
    number: '01',
    categoryTag: 'Full-Stack Engineering',
    title: 'Web Development',
    description: 'Next.js web apps and digital flagships built for speed, SEO dominance, and people with zero patience for slow load times.',
    tags: ['Next.js 14/15', 'Full-Stack React', 'Headless CMS', 'Sub-Second Speeds'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    iconName: 'laptop',
  },
  {
    id: 't2',
    slug: 'mobile-app-development',
    number: '02',
    categoryTag: 'Mobile Architecture',
    title: 'Mobile App Development',
    description: 'iOS & Android apps that feel like butter in the hand. Built with React Native & Flutter, zero bloat, and rock-solid offline sync.',
    tags: ['iOS & Android', 'React Native / Flutter', 'Offline-First Sync', 'App Store Launch'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    iconName: 'mobile',
  },
  {
    id: 't3',
    slug: 'ai-solutions',
    number: '03',
    categoryTag: 'Applied Machine Intelligence',
    title: 'AI Solutions',
    description: 'Skip the generic wrapper gimmicks. We build custom RAG pipelines and private AI engines trained on your company’s proprietary data.',
    tags: ['Enterprise RAG', 'Private LLMs', 'Semantic Search', 'Zero Hallucinations'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    iconName: 'brain',
  },
  {
    id: 't4',
    slug: 'ai-agents',
    number: '04',
    categoryTag: 'Autonomous Workflows',
    title: 'AI Agents',
    description: 'Autonomous digital teammates that qualify incoming leads, answer customer questions at 3 AM, and update your CRM on autopilot.',
    tags: ['Sales SDR Agents', '24/7 Support Bots', 'CRM Automation', 'Function Calling'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    iconName: 'bot',
  },
  {
    id: 't5',
    slug: 'whatsapp-solutions',
    number: '05',
    categoryTag: 'Conversational Commerce',
    title: 'WhatsApp Solutions',
    description: 'Turn WhatsApp into your highest-converting sales channel. Official Meta Cloud APIs, automated cart recovery, and instant AI chat.',
    tags: ['Meta Cloud API', 'Green Tick Verification', 'Cart Recovery', 'CRM Sync'],
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80',
    iconName: 'whatsapp',
  },
  {
    id: 't6',
    slug: 'automation',
    number: '06',
    categoryTag: 'Process Engineering',
    title: 'Automation',
    description: 'Stop paying humans to copy-paste between spreadsheets. We automate complex workflows with self-hosted n8n and AI document parsing.',
    tags: ['Self-Hosted n8n', 'Invoice & PDF OCR', 'Zero Per-Task Fees', 'Zapier Replacement'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    iconName: 'cpu',
  },
  {
    id: 't7',
    slug: 'software-saas-development',
    number: '07',
    categoryTag: 'Scalable Systems',
    title: 'Software & SaaS Development',
    description: 'Custom SaaS platforms, internal ERPs, and booking engines built from scratch to handle real scale without crashing on launch day.',
    tags: ['Multi-Tenant SaaS', 'Custom ERP / CRM', 'Stripe Billing', 'PostgreSQL Scale'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    iconName: 'layers',
  },
  {
    id: 't8',
    slug: 'api-integrations',
    number: '08',
    categoryTag: 'System Connectivity',
    title: 'API & Integrations',
    description: 'We connect your payment gateways, CRMs, logistics, and legacy databases into one synchronized, fail-safe system.',
    tags: ['Stripe / Razorpay', 'Custom Webhooks', 'REST & GraphQL', 'Fail-Safe Queues'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    iconName: 'webhook',
  },
  {
    id: 't9',
    slug: 'digital-experience-virtual-tours',
    number: '09',
    categoryTag: 'Spatial Realism',
    title: 'Digital Experience & Virtual Tours',
    description: 'Interactive 3D web spaces and digital showrooms your customers can explore right in their browser without downloading an app.',
    tags: ['3D WebGL Configurator', 'Virtual Showrooms', 'Interactive Hotspots', 'Browser-Based VR'],
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
    iconName: 'compass',
  },
  {
    id: 't10',
    slug: '360-panorama-virtual-tours',
    number: '10',
    categoryTag: 'Ultra-HD Capture',
    title: '360° Panorama & Virtual Tours',
    description: 'Crystal-clear 8K HDR virtual walkthroughs for luxury real estate, resorts, and Google Maps that turn lookers into bookers.',
    tags: ['8K HDR Photography', 'Google Street View', 'Real Estate Tours', 'Resort Showcases'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    iconName: 'camera',
  },
  {
    id: 't11',
    slug: 'maintenance-support',
    number: '11',
    categoryTag: 'Mission-Critical SLA',
    title: 'Maintenance & Support',
    description: 'Sleep easy knowing senior engineers are monitoring your servers 24/7, patching security flaws, and fixing bugs before users notice.',
    tags: ['24/7 Health Monitoring', 'Security Patches', 'Guaranteed SLA', 'Speed Tuning'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    iconName: 'shield',
  },
];

function getCategoryIcon(iconName?: string) {
  const iconProps = { className: 'w-4 h-4 text-black' };
  switch (iconName) {
    case 'laptop':
      return <Code2 {...iconProps} />;
    case 'mobile':
      return <Smartphone {...iconProps} />;
    case 'brain':
      return <BrainCircuit {...iconProps} />;
    case 'bot':
      return <Bot {...iconProps} />;
    case 'whatsapp':
      return <MessageSquare {...iconProps} />;
    case 'cpu':
      return <Cpu {...iconProps} />;
    case 'layers':
      return <Layers {...iconProps} />;
    case 'webhook':
      return <Webhook {...iconProps} />;
    case 'compass':
      return <Compass {...iconProps} />;
    case 'camera':
      return <Camera {...iconProps} />;
    case 'shield':
      return <ShieldCheck {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
}

interface TechnologyPageClientProps {
  initialServices?: any[];
  siteSettings?: any;
}

export default function TechnologyPageClient({
  initialServices,
}: TechnologyPageClientProps) {
  const [dbServices, setDbServices] = useState<any[]>(initialServices || []);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    fetch('/api/public/services?category=TECHNOLOGY')
      .then((res) => res.json())
      .then((data) => {
        if (data.services && Array.isArray(data.services) && data.services.length > 0) {
          setDbServices(data.services);
        }
      })
      .catch(() => {});
  }, []);

  const activeServices: TechServiceItem[] =
    dbServices.length > 0
      ? dbServices.map((s, idx) => {
          let tagsList: string[] = [];
          if (s.tags) {
            tagsList = s.tags.split(/[•,]/).map((t: string) => t.trim()).filter(Boolean);
          } else {
            const fallbackItem = defaultTechServices.find((d) => d.slug === s.slug);
            tagsList = fallbackItem?.tags || ['Custom Architecture', 'High Performance'];
          }

          const fallback = defaultTechServices.find((d) => d.slug === s.slug);

          return {
            id: s.id || `tech-${idx}`,
            slug: s.slug || fallback?.slug || `tech-${idx}`,
            number: String(idx + 1).padStart(2, '0'),
            categoryTag: fallback?.categoryTag || 'Digital Architecture',
            title: s.title || fallback?.title || 'Technology Service',
            description: s.description || fallback?.description || '',
            tags: tagsList,
            image: s.image || fallback?.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
            iconName: fallback?.iconName || 'laptop',
          };
        })
      : defaultTechServices;

  return (
    <PageWrapper>
      {/* SMOOTH READING SCROLL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#ffd700] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <div ref={containerRef} className="technology-services-page w-full min-h-screen bg-[#f5f0e6] text-[#0a0a0a] selection:bg-[#ffd700] selection:text-black">

        {/* HERO SECTION */}
        <section className="relative pt-32 sm:pt-44 pb-16 px-6 md:px-16 border-b border-black/10 text-left">
          <div className="max-w-[1600px] mx-auto">
            
            {/* TOP NAVIGATION / CATEGORY SWITCHER */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link
                href="/services"
                className="px-5 py-2 rounded-full border border-black/15 bg-white/70 hover:bg-black hover:text-[#f5f0e6] font-mono text-xs uppercase tracking-widest transition-all duration-300 font-semibold shadow-sm"
              >
                Creative & Film Services
              </Link>
              <div className="px-5 py-2 rounded-full bg-black text-[#ffd700] border border-black font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
                <span>Technology Services ({activeServices.length})</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
              <div className="max-w-4xl">
                <span className="font-mono text-xs sm:text-sm text-black/50 font-bold uppercase tracking-[0.25em] block mb-4">
                  [ CRE8TIVECOVE — APPLIED TECH & DIGITAL CRAFT ]
                </span>

                <h1 className="font-condensed text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] font-black uppercase leading-[0.85] tracking-tight text-[#0a0a0a]">
                  WE BUILD CODE<br />THAT SELLS.
                </h1>
              </div>

              <div className="lg:max-w-md pb-2">
                <p className="font-sans text-base sm:text-lg text-black/75 leading-relaxed border-l-2 border-black/20 pl-6">
                  No buzzword soup. No bloated slide decks. We engineer lightning-fast web apps, autonomous AI agents that do real work, and 360° virtual spaces that turn casual visitors into loyal clients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MINIMALIST MODERN CARDS SECTION */}
        <section className="py-20 md:py-28 px-6 md:px-16">
          <div className="max-w-[1600px] mx-auto">

            {/* SECTION HEADER & STATS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 mb-12">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
                <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-black/70">
                  OUR CAPABILITIES ({activeServices.length} DISCIPLINES)
                </span>
              </div>
              <span className="font-mono text-xs text-black/40 uppercase tracking-widest">
                SELECT ANY DISCIPLINE TO EXPLORE METHODOLOGY, TECH STACKS & CASE STUDIES
              </span>
            </div>

            {/* MODERN MINIMALIST CARDS STREAM */}
            <div className="flex flex-col gap-6 sm:gap-8">
              {activeServices.map((srv, idx) => (
                <motion.div
                  key={srv.id || idx}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
                >
                  <Link
                    href={`/services/${srv.slug}`}
                    className="group relative block bg-white/60 hover:bg-white border border-black/10 hover:border-black/30 rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                  >
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 sm:gap-10">
                      
                      {/* LEFT: MEDIA PREVIEW FRAME */}
                      <div className="relative w-full lg:w-[360px] xl:w-[400px] aspect-[16/10] sm:aspect-[16/9] lg:h-[220px] rounded-2xl overflow-hidden bg-[#121212] shrink-0 border border-black/10 shadow-sm">
                        <TechCardImage
                          src={srv.image}
                          alt={srv.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* CORNER ICON & NUMBER BADGE */}
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md">
                            {getCategoryIcon(srv.iconName)}
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[#ffd700] font-mono text-xs font-bold uppercase tracking-wider">
                            {srv.number}
                          </span>
                        </div>

                        {/* BOTTOM CAPTION */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                          <span className="font-mono text-[11px] font-semibold text-white/80 uppercase tracking-wider truncate">
                            {srv.categoryTag}
                          </span>
                          <span className="font-mono text-[10px] text-[#ffd700] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            EXPLORE BUILD &rarr;
                          </span>
                        </div>
                      </div>

                      {/* MIDDLE: MINIMALIST CONTENT */}
                      <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xs font-bold text-black/40 uppercase tracking-widest">
                            {srv.number} &mdash; {srv.categoryTag}
                          </span>
                        </div>

                        <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-[#0a0a0a] tracking-tight group-hover:text-black mb-3 transition-colors">
                          {srv.title}
                        </h2>

                        <p className="font-sans text-sm sm:text-base text-black/70 leading-relaxed font-light mb-6 max-w-3xl">
                          {srv.description}
                        </p>

                        {/* MINIMALIST TAG PILLS */}
                        <div className="flex flex-wrap items-center gap-2">
                          {srv.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] group-hover:bg-black/[0.08] border border-black/5 font-sans text-xs text-black/80 font-medium transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-black/40 group-hover:bg-black transition-colors" />
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* RIGHT: SLEEK CIRCULAR ARROW BUTTON */}
                      <div className="shrink-0 flex items-center lg:self-center pt-4 lg:pt-0 border-t lg:border-t-0 border-black/10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black/15 bg-white group-hover:bg-black text-black group-hover:text-[#ffd700] group-hover:border-black flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105">
                          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* CUBOID MARQUEE STRIP */}
        <CuboidMarquee href="/technology" text="FULL-STACK ENGINEERING • AUTONOMOUS AI AGENTS • 360° VIRTUAL SPACES • NEXT.JS 14 • CLOUD ARCHITECTURE •" />

        {/* MINIMALIST CAPABILITIES SUMMARY BANNER */}
        <section className="bg-[#0a0a0a] text-[#f5f0e6] py-24 px-6 md:px-16 border-t border-white/10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="border-l border-white/20 pl-6">
              <span className="font-mono text-xs text-[#ffd700] font-bold uppercase tracking-widest block mb-2">
                01 / SPEED & SCALE
              </span>
              <h3 className="font-sans text-xl font-bold text-white mb-2">Engineered for Zero Downtime</h3>
              <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                Next.js server-side rendering, Edge CDN caching, and clean TypeScript backends built to handle viral traffic spikes without breaking a sweat.
              </p>
            </div>

            <div className="border-l border-white/20 pl-6">
              <span className="font-mono text-xs text-[#ffd700] font-bold uppercase tracking-widest block mb-2">
                02 / REAL AI ROI
              </span>
              <h3 className="font-sans text-xl font-bold text-white mb-2">Intelligence, Not Gimmicks</h3>
              <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                Custom vector search, secure enterprise RAG, and autonomous agents that cut manual busywork and deliver measurable dollars back to your bottom line.
              </p>
            </div>

            <div className="border-l border-white/20 pl-6">
              <span className="font-mono text-xs text-[#ffd700] font-bold uppercase tracking-widest block mb-2">
                03 / SPATIAL REALISM
              </span>
              <h3 className="font-sans text-xl font-bold text-white mb-2">Spaces That Sell Themselves</h3>
              <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                Photorealistic 8K HDR walkthroughs and 3D web experiences that let global buyers walk through your properties before booking.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-[#0a0a0a] text-[#f5f0e6] pt-20 pb-20 px-6 md:px-16 text-center">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center">
            <span className="font-mono text-xs sm:text-sm text-[#ffd700] font-bold uppercase tracking-widest mb-6">
              HAVE A PRODUCT IN MIND? LET&apos;S TALK ARCHITECTURE.
            </span>

            <Link
              href="/contact"
              className="group font-condensed text-[9vw] sm:text-[10vw] md:text-[11vw] font-black uppercase text-[#f5f0e6] hover:text-[#ffd700] leading-[0.85] tracking-tighter text-center transition-all duration-500 block hover:scale-[1.01] mb-16"
            >
              START A TECH BUILD
            </Link>

            <div className="w-full pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                CRE8TIVECOVE (C8C) TECHNOLOGY DIVISION • ALL RIGHTS RESERVED
              </span>

              <div className="flex items-center gap-4">
                <Link
                  href="/services"
                  className="font-mono text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
                >
                  Creative Services
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/technology"
                  className="font-mono text-xs uppercase tracking-widest text-[#ffd700] hover:text-white font-bold transition-colors"
                >
                  Technology Services
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/contact"
                  className="font-mono text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
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
