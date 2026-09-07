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
    console.error('C8C Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-['Outfit']">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#0a0a0a] border-2 border-[var(--gold)] shadow-[0_0_60px_rgba(255,215,0,0.25)] text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black uppercase font-['Syne']">
          ANOMALY DETECTED<span className="text-[var(--gold)]">.</span>
        </h2>

        <p className="mt-3 text-sm text-gray-300 font-light">
          {error.message || 'An unexpected rendering fault occurred inside the C8C Engine.'}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => reset()}
            className="btn-gold flex-1 py-3 text-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
          <Link
            href="/"
            className="btn-outline-gold flex-1 py-3 text-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
