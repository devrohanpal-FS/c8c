'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import './MobileMenuOverlay.css';

interface NavItem {
  id: string;
  number: string;
  label: string;
  href: string;
  subtitle: string;
  image?: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    number: '01',
    label: 'HOME',
    href: '/',
    subtitle: 'Main Creative Agency Hub',
    image: '',
  },
  {
    id: 'work',
    number: '02',
    label: 'WORK',
    href: '/work',
    subtitle: 'Archive of Commercial Films & Digital Crafts',
    image: '',
  },
  {
    id: 'about',
    number: '03',
    label: 'ABOUT',
    href: '/about',
    subtitle: 'Manifesto, Culture & Creative Ethos',
    image: '',
  },
  {
    id: 'services',
    number: '04',
    label: 'SERVICES',
    href: '/services',
    subtitle: 'Direction, 3D WebGL & Motion Art',
    image: '',
  },
  {
    id: 'technology',
    number: '05',
    label: 'TECHNOLOGY',
    href: '/technology',
    subtitle: 'Web, Mobile, AI Agents & Virtual Tours',
    image: '',
  },
  {
    id: 'contact',
    number: '06',
    label: 'CONTACT',
    href: '/contact',
    subtitle: 'Start a Project & General Inquiries',
    image: '',
  },
];

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const previewImgRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  const [activeItem, setActiveItem] = useState<NavItem>(navItems[0]);
  const [isRendered, setIsRendered] = useState<boolean>(isOpen);

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const studioAddress = settings?.address || 'Delhi, India';
  const studioPhone = settings?.phone || '+91 9999-659-129';
  const studioEmail = settings?.email || 'hello@cre8tivecove.com';
  const linkedin = settings?.linkedin || 'https://www.linkedin.com/company/cre8tivecove/';
  const instagram = settings?.instagram || 'https://www.instagram.com/cre8tivecove.cc/';
  const youtube = settings?.youtube || 'https://www.youtube.com/@CRE8TIVECOVE';


  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  useGSAP(
    () => {
      if (!overlayRef.current || !bgRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const validLinks = navLinksRef.current.filter(Boolean);

      if (isOpen) {

        const tl = gsap.timeline({
          onComplete: () => {

            if (validLinks[0]) validLinks[0].focus();
          },
        });

        if (prefersReducedMotion) {
          gsap.set(bgRef.current, { clipPath: 'circle(150% at 95% 5%)', opacity: 1 });
          gsap.set(validLinks, { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 });
          if (infoRef.current) gsap.set(infoRef.current, { opacity: 1 });
          return;
        }


        tl.fromTo(
          bgRef.current,
          {
            clipPath: 'circle(0% at 95% 5%)',
            opacity: 1,
          },
          {
            clipPath: 'circle(150% at 95% 5%)',
            duration: 0.75,
            ease: 'power3.inOut',
          }
        );


        if (bgTextRef.current) {
          tl.fromTo(
            bgTextRef.current,
            { opacity: 0, x: 80 },
            { opacity: 0.04, x: 0, duration: 1.2, ease: 'power2.out' },
            '-=0.5'
          );
        }


        if (validLinks.length > 0) {
          tl.fromTo(
            validLinks,
            {
              opacity: 0,
              y: 50,
              scale: 0.96,
              filter: 'blur(10px)',
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.8,
              stagger: 0.08,
              ease: 'power3.out',
            },
            '-=0.45'
          );
        }


        if (previewImgRef.current) {
          tl.fromTo(
            previewImgRef.current,
            {
              clipPath: 'inset(12% 12% 12% 12%)',
              scale: 1.08,
              opacity: 0,
              filter: 'blur(8px)',
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power3.out',
            },
            '-=0.6'
          );
        }


        if (infoRef.current) {
          tl.fromTo(
            infoRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.4'
          );
        }
      } else if (isRendered) {

        const tl = gsap.timeline({
          onComplete: () => {
            setIsRendered(false);
          },
        });

        if (prefersReducedMotion) {
          gsap.set(bgRef.current, { opacity: 0 });
          setIsRendered(false);
          return;
        }


        if (validLinks.length > 0) {
          tl.to(validLinks, {
            opacity: 0,
            y: -25,
            filter: 'blur(6px)',
            duration: 0.35,
            stagger: 0.04,
            ease: 'power2.in',
          });
        }

        if (previewImgRef.current) {
          tl.to(
            previewImgRef.current,
            {
              clipPath: 'inset(10% 10% 10% 10%)',
              opacity: 0,
              duration: 0.35,
              ease: 'power2.in',
            },
            '-=0.3'
          );
        }


        tl.to(bgRef.current, {
          clipPath: 'circle(0% at 95% 5%)',
          duration: 0.6,
          ease: 'power3.inOut',
        });
      }
    },
    { dependencies: [isOpen, isRendered], scope: overlayRef }
  );

  if (!isRendered) return null;

  return (
    <div
      ref={overlayRef}
      data-lenis-prevent
      tabIndex={-1}
      className={`mobile-menu-overlay fixed inset-0 z-[140] pointer-events-auto font-sans selection:bg-[#ffd700] selection:text-[#0a0a0a] ${
        isOpen ? 'visible' : 'pointer-events-none'
      }`}
    >
      {}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[#0a0a0a] text-[#f5f0e6] w-full h-full flex flex-col justify-between p-6 md:p-14 overflow-hidden border-b border-white/10 shadow-2xl"
      >
        {}
        <div
          ref={bgTextRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
        >
          <span className="font-condensed text-[35vw] font-black uppercase text-white tracking-tighter leading-none whitespace-nowrap opacity-[0.03]">
            CRE8TIVECOVE
          </span>
        </div>

        {}
        <div className="h-16 shrink-0 relative z-10" />

        {}
        <div className="relative z-10 w-full max-w-[1700px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8">
          {}
          <nav className="lg:col-span-7 flex flex-col gap-4 sm:gap-6 text-left" aria-label="Main Navigation">
            {navItems.map((item, idx) => {
              const isActive = activeItem.id === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setActiveItem(item)}
                  onFocus={() => setActiveItem(item)}
                  ref={(el) => {
                    navLinksRef.current[idx] = el;
                  }}
                  className="group inline-flex items-baseline gap-4 sm:gap-6 focus:outline-none"
                >
                  {}
                  <span className="text-xs sm:text-sm font-mono text-[#ffd700] uppercase tracking-widest font-bold shrink-0">
                    [{item.number}]
                  </span>

                  {}
                  <h3
                    className={`font-condensed text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black uppercase leading-[0.88] tracking-tight transition-all duration-300 ${
                      isActive
                        ? 'text-[#ffd700] translate-x-3'
                        : 'text-[#f5f0e6]/70 hover:text-white group-hover:translate-x-2'
                    }`}
                  >
                    {item.label}
                  </h3>

                  {}
                  <ArrowUpRight
                    className={`w-6 h-6 sm:w-8 sm:h-8 text-[#ffd700] transition-all duration-300 ${
                      isActive ? 'opacity-100 rotate-45 scale-110' : 'opacity-0 -rotate-45'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {}
            <div
              ref={previewImgRef}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl transition-all duration-500 hidden sm:block"
            >
              {navItems.map((item) => {
                const isCurrent = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      isCurrent
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 pointer-events-none z-0'
                    }`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        sizes="(max-width: 1200px) 100vw, 45vw"
                        className="object-cover"
                        priority={item.id === 'home'}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#181818] via-[#0d0d0d] to-[#050505] flex items-center justify-center p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.08)_0%,transparent_75%)]" />
                        <span className="font-condensed text-5xl lg:text-7xl font-black text-white/10 uppercase tracking-widest select-none">
                          {item.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-left z-30 pointer-events-none">
                <span className="text-xs font-mono text-[#ffd700] uppercase tracking-widest block font-bold mb-1 transition-all duration-300">
                  [{activeItem.number}] {activeItem.label} PREVIEW
                </span>
                <p className="text-sm font-sans text-gray-300 truncate transition-all duration-300">
                  {activeItem.subtitle}
                </p>
              </div>
            </div>

            {}
            <div ref={infoRef} className="grid grid-cols-2 gap-6 text-left pt-4 border-t border-white/10">
              <div>
                <span className="text-xs font-mono text-[#ffd700] uppercase tracking-widest block mb-2 font-bold">
                  STUDIO HQ
                </span>
                <p className="text-xs font-sans text-gray-400 leading-relaxed">
                  {studioAddress}
                  <br />
                  TEL: {studioPhone} • {studioEmail}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-[#ffd700] uppercase tracking-widest block mb-2 font-bold">
                  SOCIAL CHANNELS
                </span>
                <div className="flex flex-wrap gap-3 text-xs font-sans text-gray-400">
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                  <span>•</span>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                  <span>•</span>
                  <a href={youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="relative z-10 w-full overflow-hidden border-t border-white/10 pt-4 pb-2 shrink-0">
          <div className="flex whitespace-nowrap animate-marquee text-xs font-mono text-gray-400 uppercase tracking-widest">
            <span>C8C (CRE8TIVECOVE) • LEAN MEAN STORYTELLING MACHINE • WEIRD ENERGY SINCE Y2K •&nbsp;</span>
            <span>C8C (CRE8TIVECOVE) • LEAN MEAN STORYTELLING MACHINE • WEIRD ENERGY SINCE Y2K •&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
  );
}