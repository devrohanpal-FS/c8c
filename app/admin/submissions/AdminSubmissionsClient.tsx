'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, Calendar, DollarSign } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  businessName?: string | null;
  helpDetails: string;
  budget?: string | null;
  consentGiven?: boolean;
  consentAt?: string | null;
  consentVersion?: string | null;
  consentPurpose?: string | null;
  status: string;
  createdAt: string;
}

export default function AdminSubmissionsClient() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.submissions) setSubmissions(data.submissions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: Column<ContactSubmission>[] = [
    {
      key: 'name',
      header: 'Contact Name & Email',
      render: (s) => (
        <div className="flex flex-col text-left">
          <span className="font-sans font-bold text-white text-xs">{s.name}</span>
          <a href={`mailto:${s.email}`} className="font-mono text-[11px] text-[#ffd700] hover:underline flex items-center gap-1">
            <Mail className="w-3 h-3" /> {s.email}
          </a>
        </div>
      ),
    },
    {
      key: 'businessName',
      header: 'Business & Budget',
      render: (s) => (
        <div className="flex flex-col text-left font-sans text-xs">
          <span className="text-gray-300 font-bold">{s.businessName || 'N/A'}</span>
          {s.budget && (
            <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-0.5">
              <DollarSign className="w-3 h-3" /> Budget: {s.budget}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'helpDetails',
      header: 'Project Inquiry Details',
      render: (s) => (
        <span className="font-sans text-xs text-gray-300 truncate max-w-sm block">
          {s.helpDetails}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <StatusBadge status={s.status} size="sm" />,
    },
    {
      key: 'consent',
      header: 'Consent',
      render: (s) => (
        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
            s.consentGiven
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
              : 'bg-zinc-800 text-gray-400 border border-white/10'
          }`}
        >
          {s.consentGiven ? `✓ ${s.consentVersion || 'Given'}` : 'Legacy / None'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received Date',
      render: (s) => (
        <span className="font-mono text-[11px] text-gray-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-500" />
          {new Date(s.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout pageTitle="Inquiries">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="font-condensed text-3xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            <span>Inbound Lead Inquiries</span>
          </h2>
        </div>

        <DataTable
          columns={columns}
          data={submissions}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          emptyTitle="No Lead Inquiries Yet"
          emptyDescription="Submissions sent through the contact form will appear here."
        />
      </div>
    </AdminLayout>
  );
}