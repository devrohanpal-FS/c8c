'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function useScrollColorMorph() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const sections = document.querySelectorAll<HTMLElement>('[data-color]');

    if (sections.length === 0) {
      return () => clearTimeout(timer);
    }

    function applyTheme(bg: string, textColor: string, isLight: boolean) {
      gsap.to('body', {
        backgroundColor: bg,
        color: textColor,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (isLight) {
        document.documentElement.classList.add('light-theme');
        document.body.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
        document.body.classList.remove('light-theme');
      }
    }

    // Apply initial theme of the top section immediately on mount
    const firstSection = sections[0];
    if (firstSection) {
      const initialBg = firstSection.getAttribute('data-color') || '#0a0a0a';
      const cleanBg = initialBg.trim().toUpperCase();
      const isLightMode = cleanBg === '#FFFEF2' || cleanBg === '#FFF' || cleanBg === '#FFFFFF' || cleanBg === '#FFF8E7';
      const textColor = isLightMode ? '#0a0a0a' : '#f5f0e6';
      
      document.body.style.backgroundColor = initialBg;
      document.body.style.color = textColor;
      applyTheme(initialBg, textColor, isLightMode);
    }

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const targetBg = section.getAttribute('data-color') || '#0a0a0a';
      const cleanBg = targetBg.trim().toUpperCase();
      const isLightMode = cleanBg === '#FFFEF2' || cleanBg === '#FFF' || cleanBg === '#FFFFFF' || cleanBg === '#FFF8E7';
      const textColor = isLightMode ? '#0a0a0a' : '#f5f0e6';

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => applyTheme(targetBg, textColor, isLightMode),
        onEnterBack: () => applyTheme(targetBg, textColor, isLightMode),
      });

      triggers.push(trigger);
    });

    return () => {
      clearTimeout(timer);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);
}

export default useScrollColorMorph;
