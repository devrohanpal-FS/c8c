'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import MobileMenuOverlay from './MobileMenuOverlay';
import './Navbar.css';

interface NavbarProps {
  darkTheme?: boolean;
}

export default function Navbar({ darkTheme = true }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const checkHeaderBackground = () => {
      const headerEl = document.getElementById('header');
      if (!headerEl) return;

      const headerRect = headerEl.getBoundingClientRect();
      const sampleY = headerRect.bottom + 20;
      const sampleX = window.innerWidth / 2;

      const targetEl = document.elementFromPoint(sampleX, sampleY) as HTMLElement | null;
      if (!targetEl) return;

      // Fast O(1) closest ancestor check for data-color (avoids layout thrashing)
      const colorContainer = targetEl.closest('[data-color]');
      if (colorContainer) {
        const clean = colorContainer.getAttribute('data-color')?.trim().toUpperCase();
        if (clean === '#FFFEF2' || clean === '#FFF' || clean === '#FFFFFF' || clean === '#FFF8E7' || clean === 'CREAM') {
          setIsLightSection((prev) => (!prev ? true : prev));
          return;
        } else if (clean === '#0A0A0A' || clean === '#000000' || clean === 'OBSIDIAN' || clean === 'DARK') {
          setIsLightSection((prev) => (prev ? false : prev));
          return;
        }
      }

      // Check document or section-level theme classes
      if (document.body.classList.contains('light-theme') || document.documentElement.classList.contains('light-theme')) {
        setIsLightSection((prev) => (!prev ? true : prev));
        return;
      }

      // Match explicit light background utility classes without computing styles in a loop
      try {
        const lightContainer = targetEl.closest(
          '.bg-white, .light-section, [data-theme="light"], [class*="bg-[#FFFEF2]"], [class*="bg-[#f5f0e6]"], [class*="bg-[#fff]"]'
        );
        if (lightContainer) {
          setIsLightSection((prev) => (!prev ? true : prev));
          return;
        }
      } catch {
        // Defensive fallback in case of selector parsing anomaly
      }

      // Default to dark theme for C8C obsidian aesthetic
      setIsLightSection((prev) => (prev ? false : prev));
    };

    const onScrollThrottled = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          checkHeaderBackground();
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    checkHeaderBackground();
    const timer = setTimeout(checkHeaderBackground, 100);

    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    window.addEventListener('resize', onScrollThrottled, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScrollThrottled);
      window.removeEventListener('resize', onScrollThrottled);
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (pathname?.startsWith('/admin')) return;
      if (!line1Ref.current || !line2Ref.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (menuOpen) {
        if (prefersReducedMotion) {
          gsap.set(line1Ref.current, { rotate: 45, y: 4 });
          gsap.set(line2Ref.current, { rotate: -45, y: -4 });
          return;
        }

        gsap.to(line1Ref.current, {
          rotate: 45,
          y: 4,
          duration: 0.45,
          ease: 'power3.inOut',
        });
        gsap.to(line2Ref.current, {
          rotate: -45,
          y: -4,
          duration: 0.45,
          ease: 'power3.inOut',
        });
      } else {
        if (prefersReducedMotion) {
          gsap.set(line1Ref.current, { rotate: 0, y: 0 });
          gsap.set(line2Ref.current, { rotate: 0, y: 0 });
          return;
        }

        gsap.to(line1Ref.current, {
          rotate: 0,
          y: 0,
          duration: 0.45,
          ease: 'power3.inOut',
        });
        gsap.to(line2Ref.current, {
          rotate: 0,
          y: 0,
          duration: 0.45,
          ease: 'power3.inOut',
        });
      }
    },
    { dependencies: [menuOpen, pathname], scope: buttonRef }
  );

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Determine whether to use light contrast (black logo & menu) vs dark contrast (white logo & menu)
  const isLight = !menuOpen && isLightSection;

  return (
    <>
      <header
        id="header"
        className={`navbar-component fixed top-0 left-0 w-full z-[200] py-6 px-6 md:px-12 flex items-center justify-between pointer-events-none transition-all duration-500 ${
          isLight ? 'is-light' : 'is-dark'
        }`}
      >
        {/* LOGO */}
        <Link href="/" className="pointer-events-auto flex items-center group relative" aria-label="Cre8tiveCove Homepage">
          {/* Black Logo for Light Backgrounds */}
          <Image
            src="/logo.png"
            alt="CRE8TIVECOVE Logo"
            width={200}
            height={60}
            className={`h-9 sm:h-11 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
              isLight ? 'block' : 'hidden'
            }`}
            priority
          />
          {/* White Logo (logow.png) for Black / Dark Backgrounds */}
          <Image
            src="/logow.png"
            alt="CRE8TIVECOVE Logo"
            width={200}
            height={60}
            className={`h-9 sm:h-11 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
              isLight ? 'hidden' : 'block'
            }`}
            priority
          />
        </Link>

        {/* HAMBURGER MENU BUTTON */}
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className={`pointer-events-auto p-3 flex flex-col gap-2 items-end justify-center cursor-pointer transition-colors duration-300 ${
            isLight ? 'text-[#0a0a0a]' : 'text-[#f5f0e6]'
          }`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          <span ref={line1Ref} className="w-7 h-[2px] bg-current block transform-gpu origin-center" />
          <span ref={line2Ref} className="w-7 h-[2px] bg-current block transform-gpu origin-center" />
        </button>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}