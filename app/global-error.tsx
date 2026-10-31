'use client';

import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#121212] border border-white/15 shadow-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold uppercase tracking-wider text-white font-mono">
            CRITICAL EXCEPTION<span className="text-[#ffd700]">.</span>
          </h2>

          <p className="mt-3 text-sm text-gray-300 font-light">
            A critical system fault occurred in the root layout.
          </p>

          <button
            onClick={() => reset()}
            className="mt-6 px-8 py-3.5 rounded-full bg-[#ffd700] text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Reset Root System
          </button>
        </div>
      </body>
    </html>
  );
}
