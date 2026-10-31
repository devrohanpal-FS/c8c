'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');

      revealElements.forEach((el) => {
        // If element is already revealed or visible, don't re-hide
        if (el.classList.contains('revealed')) return;

        const revealType = el.getAttribute('data-reveal');
        const delay = parseFloat(el.getAttribute('data-delay') || '0');

        let initialY = 30;
        let duration = 0.8;
        let ease = 'power3.out';

        if (revealType === 'title' || revealType === 'heading') {
          initialY = 40;
          duration = 0.9;
        } else if (revealType === 'card' || revealType === 'image') {
          initialY = 30;
          duration = 0.8;
        }

        gsap.fromTo(
          el,
          { opacity: 0, y: initialY },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease,
            onComplete: () => {
              el.classList.add('revealed');
              gsap.set(el, { clearProps: 'transform,opacity' });
            },
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              once: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);
}
