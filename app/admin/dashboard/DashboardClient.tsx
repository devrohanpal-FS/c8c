'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Layers,
  Users,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { LoadingState } from '@/components/admin/LoadingState';

interface DashboardData {
  stats: {
    publishedWorks: number;
    draftWorks: number;
    activeServices: number;
    totalClients: number;
    newSubmissions: number;
  };
  recentWorks: Array<{
    id: string;
    title: string;
    client: string;
    category: string;
    status: string;
    updatedAt: string;
  }>;
  recentAuditLogs: Array<{
    id: string;
    action: string;
    entity: string;
    createdAt: string;
    user?: { name?: string; email?: string } | null;
  }>;
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.error) {
          setData(resData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="flex flex-col gap-10">
        {}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#161616] via-[#121212] to-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/15 text-[#ffd700] text-[10px] font-mono font-bold uppercase tracking-widest mb-3 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> AGENCY OVERVIEW
            </div>
            <h1 className="font-condensed text-4xl sm:text-5xl font-black uppercase text-white tracking-wide">
              CRE8TIVECOVE CMS HUB
            </h1>
            <p className="font-sans text-xs text-gray-400 mt-2 max-w-xl leading-relaxed">
              Manage portfolio work, agency service offerings, partner client directory, and client lead inquiries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/admin/work"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create Work</span>
            </Link>
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white font-sans font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              <span>Manage Services</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingState label="Fetching CMS Analytics..." />
        ) : (
          <>
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {}
              <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between gap-4 text-left shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold">PUBLISHED WORK</span>
                  <div className="w-8 h-8 rounded-full bg-[#ffd700]/15 text-[#ffd700] flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <span className="font-condensed text-5xl font-black text-white">{data?.stats.publishedWorks || 0}</span>
                <span className="font-mono text-[10px] text-[#ffd700] uppercase tracking-wider">Live on Public Website</span>
              </div>

              {}
              <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between gap-4 text-left shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold">DRAFT WORK</span>
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <span className="font-condensed text-5xl font-black text-white">{data?.stats.draftWorks || 0}</span>
                <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider">Unpublished Stage</span>
              </div>

              {}
              <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between gap-4 text-left shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold">SERVICES</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <span className="font-condensed text-5xl font-black text-white">{data?.stats.activeServices || 0}</span>
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">Active Offerings</span>
              </div>

              {}
              <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between gap-4 text-left shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold">CLIENTS</span>
                  <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <span className="font-condensed text-5xl font-black text-white">{data?.stats.totalClients || 0}</span>
                <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider">Roster Partners</span>
              </div>

              {}
              <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between gap-4 text-left shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold">NEW INQUIRIES</span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <span className="font-condensed text-5xl font-black text-white">{data?.stats.newSubmissions || 0}</span>
                <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider">Awaiting Response</span>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              {}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#121212] border border-white/10 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-condensed text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#ffd700]" />
                    <span>Recent Content Updates</span>
                  </h3>
                  <Link href="/admin/work" className="text-xs font-mono text-[#ffd700] hover:text-white transition-colors flex items-center gap-1">
                    <span>View All</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex flex-col divide-y divide-white/5">
                  {data?.recentWorks.map((work) => (
                    <div key={work.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex flex-col min-w-0">
                        <span className="font-sans text-xs font-bold text-white truncate">{work.title}</span>
                        <span className="font-mono text-[11px] text-gray-400">{work.client} • {work.category}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={work.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#121212] border border-white/10 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-condensed text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>Security Audit Activity</span>
                  </h3>
                  <Link href="/admin/audit-logs" className="text-xs font-mono text-amber-400 hover:text-white transition-colors flex items-center gap-1">
                    <span>Audit Log</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex flex-col divide-y divide-white/5">
                  {data?.recentAuditLogs.map((log) => (
                    <div key={log.id} className="py-3 flex flex-col gap-1 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-white uppercase">{log.action}</span>
                        <span className="font-mono text-[10px] text-gray-500">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="font-sans text-xs text-gray-400 truncate">
                        {log.user?.name || log.user?.email || 'System Operation'} ({log.entity})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}