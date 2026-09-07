'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowUp, Send, Sparkles, Instagram, Twitter, Linkedin, Video } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative bg-black pt-24 pb-12 px-6 md:px-12 border-t border-[rgba(255,215,0,0.15)] overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Top Big Call To Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-20 border-b border-[rgba(255,215,0,0.1)]">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-4">
              <Sparkles className="w-4 h-4" /> INITIATE COLLABORATION
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white font-['Syne'] leading-tight">
              HAVE A VISION?<br />
              <span className="text-gradient-gold">LET'S CRE8 THE UNSEEN.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-6">
            <a
              href="mailto:hello@c8c.agency"
              className="btn-gold text-base py-5 px-10"
            >
              hello@c8c.agency <ArrowUpRight className="w-5 h-5" />
            </a>
            <span className="text-xs text-gray-400 font-mono">
              EST. 2026 • RESPONSE TIME &lt; 4 HOURS
            </span>
          </div>
        </div>

        {/* Middle Links & Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-16 border-b border-[rgba(255,215,0,0.1)]">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-black font-extrabold font-['Syne']">
                C8
              </div>
              <span className="text-xl font-extrabold uppercase tracking-tight text-white font-['Syne']">
                C8C CRE8TIVECOVE
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm font-light leading-relaxed">
              An independent full-service creative agency pushing the envelope of digital craft, motion direction, and interactive 3D web experiences.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">Navigation</span>
              <a href="#work" className="text-sm text-gray-300 hover:text-white transition-colors">Work</a>
              <a href="#philosophy" className="text-sm text-gray-300 hover:text-white transition-colors">Philosophy</a>
              <a href="#clients" className="text-sm text-gray-300 hover:text-white transition-colors">Clients</a>
              <Link href="/admin" className="text-sm text-[var(--gold)] hover:underline">Admin CMS</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">Studios</span>
              <span className="text-sm text-gray-400">Tokyo — Shibuya</span>
              <span className="text-sm text-gray-400">New York — Soho</span>
              <span className="text-sm text-gray-400">Paris — Le Marais</span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
              The C8C Journal
            </span>
            <p className="text-sm text-gray-400">
              Receive curated insights on web animation, 3D craft, and agency culture once a month.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[rgba(255,215,0,0.15)] border border-[var(--gold)] rounded-lg text-xs font-bold text-[var(--gold)]">
                ✓ Welcome to the Cove. You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
                <button type="submit" className="p-3 bg-[var(--gold)] text-black rounded-lg hover:bg-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-mono">
          <div>
            © {new Date().getFullYear()} C8C CRE8TIVECOVE AGENCY. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[var(--gold)] transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors"><Video className="w-4 h-4" /></a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[var(--gold)] hover:text-white transition-colors"
          >
            BACK TO TOP <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
