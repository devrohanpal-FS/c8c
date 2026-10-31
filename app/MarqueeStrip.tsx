'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import PrimaryButton from '@/components/PrimaryButton';

interface MarqueeStripProps {
  text?: string;
  active?: boolean;
}

export default function MarqueeStrip({ active = true }: MarqueeStripProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: containerRef }
  );

  if (active === false) return null;

  return (
    <div
      ref={containerRef}
      className="w-full py-12 sm:py-16 flex flex-col gap-10 justify-center items-center overflow-hidden"
    >
      <PrimaryButton href="/work" variant="dark">
        See More Work
      </PrimaryButton>
    </div>
  );
}
