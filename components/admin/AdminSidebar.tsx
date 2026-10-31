'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Users,
  MessageSquare,
  ShieldAlert,
  Settings,
  Quote,
  X,
  Home,
  Info,
  Sparkles,
  SlidersHorizontal,
  Camera,
} from 'lucide-react';
import { canManageUsers, canManageSettings } from '@/lib/permissions';

export interface AdminSidebarProps {
  userRole?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  userRole,
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hero Sliders', href: '/admin/sliders', icon: SlidersHorizontal },
    { label: 'Hero & Home', href: '/admin/home', icon: Home },
    { label: 'Featured Work', href: '/admin/featured-work', icon: Sparkles },
    { label: 'BTS Gallery', href: '/admin/bts', icon: Camera },
    { label: 'Work Index', href: '/admin/work', icon: Briefcase },
    { label: 'About Us', href: '/admin/about', icon: Info },
    { label: 'Services', href: '/admin/services', icon: Layers },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { label: 'Clients', href: '/admin/clients', icon: Users },
    { label: 'Inquiries', href: '/admin/submissions', icon: MessageSquare },
  ];

  if (canManageUsers(userRole)) {
    navLinks.push({ label: 'Users', href: '/admin/users', icon: Users });
    navLinks.push({ label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert });
  }

  if (canManageSettings(userRole)) {
    navLinks.push({ label: 'Settings', href: '/admin/settings', icon: Settings });
  }

  return (
    <>
      {}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0e0e0e] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Image
                src="/logow.png"
                alt="CRE8TIVECOVE Logo"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
              <span className="font-mono text-[9px] bg-[#ffd700] text-black px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                CMS
              </span>
            </Link>

            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {}
          <nav className="p-4 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest px-3 py-2 text-left font-bold">
              NAVIGATION
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#ffd700] text-[#0a0a0a] shadow-lg shadow-[#ffd700]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0a0a0a]' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {}
        <div className="p-4 border-t border-white/10 text-left">
          <div className="px-3 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
            <span className="text-[#ffd700] font-bold block mb-1">CRE8TIVECOVE CMS v1.0</span>
            <span className="text-[10px] text-gray-500 block">Strict Auth & RBAC Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;