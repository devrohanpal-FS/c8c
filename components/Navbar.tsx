'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Volume2, VolumeX, Sparkles, UserCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'py-4 bg-glass border-b border-[rgba(255,215,0,0.15)]' : 'py-7 bg-transparent'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* C8C Brand Logo */}
          <Link href="/" className="group flex items-center gap-3 text-decoration-none">
            <div className="w-11 h-11 rounded-full bg-black border-2 border-[var(--gold)] flex items-center justify-center transition-transform duration-500 group-hover:rotate-[180deg] group-hover:shadow-[0_0_20px_var(--gold-glow)]">
              <Sparkles className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tighter text-white font-['Syne'] leading-none">
                C8C<span className="text-[var(--gold)]">.</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[var(--gold-muted)] font-bold uppercase">
                Cre8tiveCove
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <a
              href="#work"
              className="text-sm font-semibold uppercase tracking-widest text-gray-300 hover:text-[var(--gold)] transition-colors duration-300"
            >
              Selected Work
            </a>
            <a
              href="#philosophy"
              className="text-sm font-semibold uppercase tracking-widest text-gray-300 hover:text-[var(--gold)] transition-colors duration-300"
            >
              Philosophy
            </a>
            <a
              href="#clients"
              className="text-sm font-semibold uppercase tracking-widest text-gray-300 hover:text-[var(--gold)] transition-colors duration-300"
            >
              Clients & Reel
            </a>
            {session ? (
              <Link
                href="/admin"
                className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] flex items-center gap-2 border border-[var(--gold)] px-3 py-1.5 rounded-full bg-[rgba(255,215,0,0.1)]"
              >
                <UserCheck className="w-4 h-4" /> Admin Portal
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300"
              >
                Admin Login
              </Link>
            )}
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-4">
            {/* Audio Toggle Mock */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-full border border-[rgba(255,215,0,0.2)] bg-black/40 text-[var(--gold)] hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Contact CTA */}
            <a href="#contact" className="hidden sm:inline-flex btn-gold !py-2.5 !px-6 text-xs">
              Start Project
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Overlay Menu */}
      {isOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-center px-10 py-20 lg:hidden"
        >
          <div className="flex flex-col gap-8 text-center">
            <a
              href="#work"
              onClick={() => setIsOpen(false)}
              className="text-3xl font-black uppercase text-white hover:text-[var(--gold)] transition-colors font-['Syne']"
            >
              Selected Work
            </a>
            <a
              href="#philosophy"
              onClick={() => setIsOpen(false)}
              className="text-3xl font-black uppercase text-white hover:text-[var(--gold)] transition-colors font-['Syne']"
            >
              Philosophy
            </a>
            <a
              href="#clients"
              onClick={() => setIsOpen(false)}
              className="text-3xl font-black uppercase text-white hover:text-[var(--gold)] transition-colors font-['Syne']"
            >
              Clients
            </a>
            <Link
              href={session ? '/admin' : '/login'}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold uppercase text-[var(--gold)]"
            >
              {session ? 'Admin Portal' : 'Admin Login'}
            </Link>
            <div className="pt-8">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="btn-gold text-sm w-full py-4 text-center"
              >
                Start Project
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
