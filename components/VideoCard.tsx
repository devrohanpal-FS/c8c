'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Play, ExternalLink, Sparkles } from 'lucide-react';
import VideoModal from './VideoModal';

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  client: string;
  year: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  featured?: boolean;
}

interface VideoCardProps {
  project: ProjectData;
}

export default function VideoCard({ project }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <div
        className="video-card-container group cursor-pointer bg-[#0c0c0c]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setModalOpen(true)}
      >
        {/* Media Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          {/* Thumbnail Image */}
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className={`object-cover transition-opacity duration-500 ${
              isPlaying ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Hover MP4 Video */}
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Play Badge */}
          <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-black transition-all">
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          </div>

          {/* Category Pill */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-[var(--gold)] border border-[rgba(255,215,0,0.3)] rounded-full backdrop-blur-md">
              {project.category}
            </span>
          </div>

          {/* Bottom Card Title Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="flex items-center gap-3 text-xs text-[var(--gold-muted)] font-bold uppercase tracking-wider mb-2">
              <span>{project.client}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-['Syne'] group-hover:text-[var(--gold)] transition-colors leading-tight">
              {project.title}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-gray-300 line-clamp-2 font-light">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Video Modal */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={project.videoUrl}
        title={`${project.title} — ${project.client}`}
      />
    </>
  );
}
