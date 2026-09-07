'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollController() {
  useEffect(() => {
    // Dynamic background color transitions on sections
    const sections = document.querySelectorAll('[data-bg-color]');

    sections.forEach((section) => {
      const color = section.getAttribute('data-bg-color');
      if (!color) return;

      ScrollTrigger.create({
        trigger: section as HTMLElement,
        start: 'top 60%',
        end: 'bottom 60%',
        onEnter: () => {
          document.body.style.backgroundColor = color;
        },
        onEnterBack: () => {
          document.body.style.backgroundColor = color;
        },
      });
    });

    // Stagger text reveal for elements with .reveal-text
    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
