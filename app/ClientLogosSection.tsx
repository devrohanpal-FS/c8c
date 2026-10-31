'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export interface ClientItem {
  id?: string;
  name: string;
  logo?: string | null;
  website?: string | null;
}

const defaultClients: ClientItem[] = [
  { name: 'Indian Railways', logo: '/images/clients/indian-railways-logo.png' },
  { name: 'Hindustan Petroleum', logo: '/images/clients/hp-hindustan-petroleum-logo.png' },
  { name: 'Axis Max Life Insurance', logo: '/images/clients/axis-max-life-insurance-logo.png' },
  { name: 'State Bank of India', logo: '/images/clients/sbi-logo.webp' },
  { name: 'Bharat Petroleum', logo: '/images/clients/bharat-petroleum-logo.png' },
  { name: 'Bharat Gas', logo: '/images/clients/bharat-gas-logo.webp' },
  { name: 'WARIVO Motors', logo: '/images/clients/warivo-motors-logo.png' },
  { name: 'Barco', logo: '/images/clients/barco-logo.png' },
  { name: 'Bajaj Allianz', logo: '/images/clients/bajaj-allianz-logo.png' },
  { name: 'NeuroEquilibrium', logo: '/images/clients/neuro-equilibrium-logo.png' },
];

function ClientLogoItem({ name, logo }: { name: string; logo?: string | null }) {
  const [imgSrc, setImgSrc] = useState(logo || '/images/stock/stock-logo.png');
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-24 sm:h-32 md:h-40 flex items-center justify-center">
      {imgSrc && !hasError ? (
        <Image
          src={imgSrc}
          alt={name}
          width={320}
          height={160}
          unoptimized
          onError={() => {
            if (imgSrc !== '/images/stock/stock-logo.png') {
              setImgSrc('/images/stock/stock-logo.png');
            } else {
              setHasError(true);
            }
          }}
          className="max-h-24 sm:max-h-32 md:max-h-[10rem] w-auto max-w-[260px] object-contain p-[7px] shadow-md group-hover:brightness-105 transition-all"
        />
      ) : (
        <div className="px-6 py-3 rounded-2xl bg-black/5 border border-black/15 shadow-sm flex items-center justify-center text-center">
          <span className="font-condensed font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-wider text-[#0a0a0a]/90 whitespace-nowrap">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}

export interface ClientLogosSectionProps {
  clientList?: (string | ClientItem)[];
  className?: string;
}

export default function ClientLogosSection({ clientList, className }: ClientLogosSectionProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const validIncomingClients = (clientList || []).filter((c) => {
    if (!c) return false;
    const name = typeof c === 'string' ? c : c.name;
    return Boolean(name && name.trim().length > 0);
  });

  const activeClients = validIncomingClients.length > 0 ? validIncomingClients : defaultClients;

  useGSAP(
    () => {
      if (!containerRef.current || !panelRef.current || !activeClients || activeClients.length === 0) return;

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panelRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const sectionEl = containerRef.current;
      const labelEl = sectionEl.querySelector('span');
      const panelEl = panelRef.current;

      const colorTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          toggleActions: 'play reverse play reverse',
        },
      });

      colorTl.to(
        sectionEl,
        {
          backgroundColor: '#000000',
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0
      );

      if (labelEl) {
        colorTl.to(
          labelEl,
          {
            color: '#f5f0e6',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        );
      }

      if (panelEl) {
        colorTl.to(
          panelEl,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        );
      }
    },
    { scope: containerRef }
  );

  if (!activeClients || activeClients.length === 0) {
    return null;
  }

  return (
    <section
      id="clients-section"
      ref={containerRef}
      className={`relative py-20 sm:py-24 bg-[#ffd700] text-[#0a0a0a] font-sans overflow-hidden w-full ${className || ''}`}
    >
      {/* SECTION LABEL */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
        <span className="font-condensed text-xl sm:text-2xl uppercase tracking-wider text-[#0a0a0a] font-extrabold block">
          FEATURED CLIENTS
        </span>
      </div>

      {/* SLIDER PANEL - FILL WIDTH */}
      <div
        ref={panelRef}
        className="w-full relative bg-white border-y border-[#0a0a0a]/10 shadow-xl overflow-hidden py-8 sm:py-10"
      >
        {/* LEFT & RIGHT FADE GRADIENTS */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* INFINITE SLIDER TRACK */}
        <div className="flex w-max items-center animate-infinite-scroll hover:[animation-play-state:paused]">
          {[...activeClients, ...activeClients, ...activeClients].map((client, idx) => {
            const isString = typeof client === 'string';
            const name = isString ? client : client.name;
            const logo = isString ? null : client.logo;

            if (!name) return null;

            return (
              <div
                key={idx}
                className="flex-shrink-0 flex items-center justify-center px-6 sm:px-10 md:px-14 min-h-[100px] sm:min-h-[130px] md:min-h-[160px] transition-transform duration-300 hover:scale-105"
              >
                <ClientLogoItem name={name} logo={logo} />
              </div>
            );
          })}
        </div>
      </div>

      {/* INLINE CSS FOR SEAMLESS INFINITE SLIDER */}
      <style jsx>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333333%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 25s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}