'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  activeSectionId?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  useGSAP(
    () => {

      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn('relative min-h-screen w-full bg-[#0a0a0a] text-[#f5f0e6] font-sans selection:bg-[#ffd700] selection:text-[#0a0a0a]', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageWrapper;