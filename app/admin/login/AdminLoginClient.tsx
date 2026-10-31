'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { getSafeRedirectUrl } from '@/lib/security';

export default function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl');
  const safeCallbackUrl = getSafeRedirectUrl(rawCallback, '/admin/dashboard');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        if (res.error === 'CredentialsSignin' || res.error === 'CallbackRouteError') {
          setErrorMessage('Invalid email or password credentials.');
        } else {
          setErrorMessage(res.error);
        }
        setLoading(false);
      } else {
        router.push(safeCallbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage('Authentication service error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e6] font-sans antialiased flex flex-col items-center justify-center p-6 selection:bg-[#ffd700] selection:text-black">
      <div className="w-full max-w-md bg-[#121212] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#ffd700]/10 blur-3xl pointer-events-none" />

        {}
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/logow.png"
            alt="CRE8TIVECOVE Logo"
            width={180}
            height={50}
            className="h-10 w-auto object-contain mb-4"
            priority
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30 text-[10px] font-mono font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> CRE8TIVECOVE CMS AUTH
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-left">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          {}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              ADMIN EMAIL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cre8tivecove.com"
                className="w-full bg-[#181818] text-white pl-11 pr-4 py-3.5 rounded-2xl font-sans text-sm outline-none border border-white/15 focus:border-[#ffd700] transition-colors"
              />
            </div>
          </div>

          {}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#181818] text-white pl-11 pr-4 py-3.5 rounded-2xl font-sans text-sm outline-none border border-white/15 focus:border-[#ffd700] transition-colors"
              />
            </div>
          </div>

          {}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-4 rounded-2xl bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block">
            Protected Enterprise CMS • RBAC Security Active
          </span>
        </div>
      </div>
    </div>
  );
}