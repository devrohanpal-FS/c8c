'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    // Admin routes do not use inertial smooth scrolling
    if (pathnameRef.current?.startsWith('/admin')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll position and refresh triggers on route change without destroying instance
  useEffect(() => {
    if (lenisRef.current && !pathname?.startsWith('/admin')) {
      lenisRef.current.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return <>{children}</>;
}