'use client';

import { useEffect } from 'react';
import { X, Play, Film } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl transition-all duration-300"
    >
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-2xl border-2 border-[var(--gold)] shadow-[0_0_80px_rgba(255,215,0,0.3)] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,215,0,0.2)] bg-black/60">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-['Syne']">
              {title || 'C8C Showreel 2026'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-gray-700 hover:border-[var(--gold)] text-gray-300 hover:text-[var(--gold)] transition-colors"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
