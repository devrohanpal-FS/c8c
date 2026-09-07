'use client';

import { useState } from 'react';
import { Play, ArrowDownRight, Award, Zap, Globe } from 'lucide-react';
import VideoModal from './VideoModal';

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const showreelUrl = 'https://cdn.coverr.co/videos/coverr-abstract-glowing-neon-lights-5674/1080p.mp4';

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 overflow-hidden bg-black">
      {/* Background Video Stream */}
      <div className="absolute inset-0 z-0 opacity-40">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-75 contrast-125"
        >
          <source src={showreelUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[rgba(255,215,0,0.3)] bg-black/60 backdrop-blur-md w-max mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
            CRE8TIVECOVE AGENCY • TOKYO / NEW YORK / PARIS
          </span>
        </div>

        {/* Hero Title & Play Reel Button */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-black uppercase tracking-tighter leading-[0.9] text-white font-['Syne']">
              WE CRAFT THE <br />
              <span className="text-gradient-gold">UNSEEN DIGITAL</span> <br />
              EXPERIENCES<span className="text-[var(--gold)]">.</span>
            </h1>
            <p className="mt-8 text-lg sm:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed">
              C8C is an elite award-winning creative cove specializing in high-octane 3D interactive web experiences, kinetic brand direction, and digital cinematography.
            </p>
          </div>

          {/* Dual Ring Play Reel Button SVG */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end items-center mt-6 lg:mt-0">
            <button
              onClick={() => setModalOpen(true)}
              className="group relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label="Play C8C Showreel"
            >
              {/* Outer Rotating SVG Ring */}
              <svg className="absolute inset-0 w-full h-full ring-rotate-cw" viewBox="0 0 200 200">
                <path
                  id="circlePath"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  fill="none"
                />
                <text className="fill-[var(--gold)] text-[10.5px] font-bold uppercase tracking-[0.25em] font-['Syne']">
                  <textPath href="#circlePath" startOffset="0%">
                    • PLAY SHOWREEL 2026 • CRE8TIVECOVE AGENCY •
                  </textPath>
                </text>
              </svg>

              {/* Inner Counter Rotating Ring */}
              <div className="absolute inset-4 rounded-full border border-[rgba(255,215,0,0.3)] ring-rotate-ccw border-dashed" />

              {/* Center Play Button Circle */}
              <div className="w-20 h-20 rounded-full bg-[var(--gold)] group-hover:bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.5)] group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 fill-black translate-x-0.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Hero Bottom Metric Strip */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,215,0,0.15)] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--gold)] font-['Syne']">140+</span>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-1">
              Global Projects Executed
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">18</span>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-1">
              Awwwards & FWA Honors
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--gold)] font-['Syne']">99.4%</span>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-1">
              Client Satisfaction Rate
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">24/7</span>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-1">
              Global Delivery Studio
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox Video Modal */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={showreelUrl}
        title="C8C Master Showreel 2026"
      />
    </section>
  );
}
