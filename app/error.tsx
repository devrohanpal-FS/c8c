'use client';

import { useEffect } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.error('[C8C APPLICATION ERROR]:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white font-sans antialiased">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#121212] border border-white/15 shadow-2xl text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold uppercase tracking-wider text-white font-mono">
          SYSTEM NOTICE<span className="text-[#ffd700]">.</span>
        </h2>

        <p className="mt-3 text-sm text-gray-300 font-light leading-relaxed">
          {process.env.NODE_ENV === 'development'
            ? error.message || 'An unexpected rendering fault occurred.'
            : 'An unexpected error occurred while processing your request. Please try again.'}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-5 rounded-full bg-[#ffd700] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/20"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
