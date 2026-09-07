import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CuboidMarquee from '@/components/CuboidMarquee';
import VideoCard, { ProjectData } from '@/components/VideoCard';
import ScrollController from '@/components/ScrollController';
import Footer from '@/components/Footer';
import { Sparkles, Trophy, Zap, ShieldCheck, Eye, Layers } from 'lucide-react';

async function getProjects(): Promise<ProjectData[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return projects;
  } catch (error) {
    console.error('Failed to fetch projects from DB:', error);
    return [];
  }
}

export const revalidate = 0; // Dynamic server rendering

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="relative min-h-screen bg-black text-white font-['Outfit'] overflow-hidden">
      {/* GSAP & Scroll Engine */}
      <ScrollController />

      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* 3D Cuboid Marquee */}
      <CuboidMarquee />

      {/* SECTION 1: Selected Work Grid */}
      <section
        id="work"
        data-bg-color="#000000"
        className="relative py-24 px-6 md:px-12 max-w-[1600px] mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
              <Sparkles className="w-4 h-4" /> ARCHIVE 2025 - 2026
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-white font-['Syne']">
              SELECTED <span className="text-gradient-gold">PORTFOLIO</span>
            </h2>
          </div>
          <p className="text-sm text-gray-400 max-w-md font-light">
            Every piece engineered in the Cove is tailored for maximum visual intrigue, technical perfection, and measurable business momentum.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <VideoCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* SECTION 2: Agency Philosophy & Craft (Background Shifts to Charcoal #111111) */}
      <section
        id="philosophy"
        data-bg-color="#111111"
        className="relative py-32 px-6 md:px-12 border-t border-b border-[rgba(255,215,0,0.15)] bg-[#111111] transition-colors duration-700"
      >
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Kinetic Text */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
                <Layers className="w-4 h-4" /> THE C8C METHODOLOGY
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white font-['Syne'] leading-tight">
                WE DO NOT BUILD WEBSITES<span className="text-[var(--gold)]">.</span> <br />
                WE ERECT DIGITAL <span className="text-gradient-gold">MONUMENTS</span>.
              </h2>

              <p className="text-lg text-gray-300 font-light leading-relaxed">
                Modern audiences ignore bland templates. At Cre8tiveCove, we merge cinematic storytelling, procedural 3D graphics, and lightning-fast WebGL code to build digital experiences that hypnotize users and command industry authority.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="p-6 rounded-2xl bg-glass border border-[rgba(255,215,0,0.2)]">
                  <Zap className="w-8 h-8 text-[var(--gold)] mb-3" />
                  <h4 className="text-lg font-bold uppercase text-white font-['Syne']">Kinetic WebGL & GSAP</h4>
                  <p className="text-xs text-gray-400 mt-2">Fluid 60fps animations engineered for zero drop in frame rate across desktop & mobile.</p>
                </div>

                <div className="p-6 rounded-2xl bg-glass border border-[rgba(255,215,0,0.2)]">
                  <ShieldCheck className="w-8 h-8 text-[var(--gold)] mb-3" />
                  <h4 className="text-lg font-bold uppercase text-white font-['Syne']">Luxury Gold Standards</h4>
                  <p className="text-xs text-gray-400 mt-2">Pixel-perfect craftsmanship using bespoke color palettes, sound design, and custom typography.</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Card Box */}
            <div className="lg:col-span-5">
              <div className="relative p-8 rounded-3xl bg-glass-gold border-2 border-[var(--gold)] shadow-[0_0_50px_rgba(255,215,0,0.25)] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--gold)] uppercase">C8C CORE ENGINE</span>
                  <span className="w-3 h-3 rounded-full bg-[var(--gold)] animate-ping" />
                </div>

                <h3 className="text-2xl font-black uppercase text-white font-['Syne']">
                  Bespoke Interactive Direction
                </h3>

                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gold/10">
                    <span>Render Engine</span>
                    <span className="font-mono text-[var(--gold)] font-bold">Three.js / GSAP 3</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gold/10">
                    <span>Performance Target</span>
                    <span className="font-mono text-[var(--gold)] font-bold">100 / 100 Lighthouse</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gold/10">
                    <span>Security Protocol</span>
                    <span className="font-mono text-[var(--gold)] font-bold">NextAuth JWT Encrypted</span>
                  </div>
                </div>

                <a href="#contact" className="btn-gold text-center py-4 w-full mt-2">
                  Initiate Strategic Brief
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Client Roster & Accolades (Background Shifts to Dark Gold Slate #1a1708) */}
      <section
        id="clients"
        data-bg-color="#1a1708"
        className="relative py-28 px-6 md:px-12 bg-[#1a1708] transition-colors duration-700"
      >
        <div className="max-w-[1600px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-4">
            <Trophy className="w-4 h-4" /> GLOBAL RECOGNITION & PARTNERS
          </div>

          <h2 className="text-4xl sm:text-6xl font-black uppercase text-white font-['Syne'] max-w-4xl mx-auto">
            TRUSTED BY VISIONARY <span className="text-gradient-gold">BRANDS</span> WORLDWIDE
          </h2>

          {/* Client Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">
            {[
              'Aura Luxury',
              'Kuro Motors',
              'Valkyrie Paris',
              'Vacheron Horology',
              'Solaris Energy',
              'Synesthesia Sound',
            ].map((client, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-black/60 border border-[rgba(255,215,0,0.2)] flex items-center justify-center font-bold font-['Syne'] uppercase text-sm tracking-wider text-gray-300 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-all duration-300"
              >
                {client}
              </div>
            ))}
          </div>

          {/* Award Stats Bar */}
          <div className="mt-16 p-8 rounded-3xl bg-black/80 border border-[rgba(255,215,0,0.2)] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-[var(--gold)] font-['Syne']">12x</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-1">
                Awwwards Site of the Day
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white font-['Syne']">6x</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-1">
                FWA of the Month
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-[var(--gold)] font-['Syne']">4x</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-1">
                Webby Award Nominees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
