import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white font-sans antialiased">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#121212] border border-white/15 shadow-2xl text-center flex flex-col items-center">
        <span className="font-mono text-5xl sm:text-6xl font-black text-[#ffd700] tracking-tighter mb-4">
          404
        </span>

        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
          PAGE NOT FOUND
        </h1>

        <p className="mt-3 text-sm text-gray-400 font-light leading-relaxed">
          The requested page could not be located on the server.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-full bg-[#ffd700] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-all"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link
            href="/work"
            className="flex-1 py-3 px-5 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> View Work
          </Link>
        </div>
      </div>
    </div>
  );
}
