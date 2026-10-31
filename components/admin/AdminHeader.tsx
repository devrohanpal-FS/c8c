'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Menu, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface AdminHeaderProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    avatar?: string | null;
  } | null;
  onToggleSidebar?: () => void;
  pageTitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onToggleSidebar,
  pageTitle = 'Dashboard',
}) => {
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || '/images/stock/stock-avatar.jpg');

  useEffect(() => {
    setAvatarSrc(user?.avatar || '/images/stock/stock-avatar.jpg');
  }, [user?.avatar]);
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <Link href="/admin/dashboard" className="hover:text-white transition-colors">CMS ADMIN</Link>
            <span>/</span>
            <span className="text-[#ffd700]">{pageTitle}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono text-gray-300 hover:text-white hover:border-white transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#ffd700]" />
        </Link>

        {}
        {user?.role && <StatusBadge status={user.role} size="sm" />}

        {}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
            <Image
              src={avatarSrc || '/images/stock/stock-avatar.jpg'}
              alt={user?.name || 'Admin User'}
              fill
              className="object-cover"
              onError={() => setAvatarSrc('/images/stock/stock-avatar.jpg')}
            />
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="font-sans text-xs font-bold text-white truncate max-w-[120px]">
              {user?.name || 'Admin'}
            </span>
            <span className="font-mono text-[10px] text-gray-400 truncate max-w-[120px]">
              {user?.email}
            </span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;