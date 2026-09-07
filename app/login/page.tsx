'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('admin@c8c.agency');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError('Invalid credentials. Please check your admin login details.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border-2 border-[var(--gold)] rounded-3xl p-8 shadow-[0_0_60px_rgba(255,215,0,0.2)]">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <Link href="/" className="w-12 h-12 rounded-full bg-black border-2 border-[var(--gold)] flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-[var(--gold)]" />
        </Link>
        <h1 className="text-2xl font-black uppercase text-white font-['Syne']">
          C8C CMS PORTAL<span className="text-[var(--gold)]">.</span>
        </h1>
        <p className="text-xs text-gray-400 font-mono mt-1">
          SECURE JWT AUTHENTICATION
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-red-300 text-xs font-bold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Account Hint */}
      <div className="mb-6 p-3 rounded-xl bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)] text-[11px] text-[var(--gold)] font-mono text-center">
        Demo Admin: <strong className="text-white">admin@c8c.agency</strong> / <strong className="text-white">admin123</strong>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-mono">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)] transition-colors"
              placeholder="admin@c8c.agency"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-mono">
            Master Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)] transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gold py-4 w-full mt-4 text-sm font-bold flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-[var(--gold)] transition-colors">
          ← Return to C8C Homepage
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[var(--gold)]/10 rounded-full blur-[120px] pointer-events-none" />
      <Suspense fallback={<div className="text-gray-400 font-mono">Loading Authentication Portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
