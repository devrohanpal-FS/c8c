'use client';

import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-['Outfit'] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0a0a0a] border-2 border-[var(--gold)] shadow-[0_0_60px_rgba(255,215,0,0.25)] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black uppercase font-['Syne']">
            ROOT SYSTEM ERROR<span className="text-[#ffd700]">.</span>
          </h2>

          <p className="mt-3 text-sm text-gray-300 font-light">
            A critical root layout exception occurred.
          </p>

          <button
            onClick={() => reset()}
            className="mt-6 px-8 py-4 rounded-full bg-[#ffd700] text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset Root System
          </button>
        </div>
      </body>
    </html>
  );
}
