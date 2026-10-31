'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Users,
  Star,
  Plus,
  Edit2,
  Trash2,
  Globe,
  ImageIcon,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/Toast';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';

interface ClientItem {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  website?: string | null;
  description?: string | null;
  featured: boolean;
  active: boolean;
  order: number;
}

export default function AdminClientsClient() {
  const { addToast } = useToast();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    website: '',
    description: '',
    featured: true,
    active: true,
    order: 0,
  });

  const fetchClients = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/clients')
      .then((res) => res.json())
      .then((data) => {
        if (data.clients) setClients(data.clients);
        setLoading(false);
      })
      .catch(() => {
        addToast('error', 'Fetch Failed', 'Failed to load client roster.');
        setLoading(false);
      });
  }, [addToast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      slug: '',
      logo: '',
      website: '',
      description: '',
      featured: true,
      active: true,
      order: clients.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ClientItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      logo: item.logo || '',
      website: item.website || '',
      description: item.description || '',
      featured: item.featured,
      active: item.active,
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingItem ? generatedSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('error', 'Validation Error', 'Client name is required.');
      return;
    }

    try {
      setSubmitting(true);
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/admin/clients/${editingItem.id}` : '/api/admin/clients';

      const payload = {
        name: formData.name.trim(),
        slug: (formData.slug || formData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        logo: formData.logo.trim() || null,
        website: formData.website.trim() || null,
        description: formData.description.trim() || null,
        featured: Boolean(formData.featured),
        active: Boolean(formData.active),
        order: Number(formData.order) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save client');
      }

      addToast('success', 'Saved Successfully', `Client partner ${editingItem ? 'updated' : 'created'} successfully!`);
      setModalOpen(false);
      fetchClients();
    } catch (err: any) {
      addToast('error', 'Operation Failed', err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`/api/admin/clients/${confirmDeleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      addToast('success', 'Client Removed', 'Client partner removed from CMS.');
      setConfirmDeleteId(null);
      fetchClients();
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message || 'Failed to delete client');
    }
  };

  const toggleFeatured = async (item: ClientItem) => {
    try {
      const res = await fetch(`/api/admin/clients/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, featured: !item.featured }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      addToast('success', 'Updated', `${item.name} featured state toggled.`);
      fetchClients();
    } catch (err: any) {
      addToast('error', 'Error', err.message);
    }
  };

  const toggleActive = async (item: ClientItem) => {
    try {
      const res = await fetch(`/api/admin/clients/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, active: !item.active }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      addToast('success', 'Updated', `${item.name} active status toggled.`);
      fetchClients();
    } catch (err: any) {
      addToast('error', 'Error', err.message);
    }
  };

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.active).length;
  const featuredClients = clients.filter((c) => c.featured && c.active).length;
  const withLogos = clients.filter((c) => !!c.logo).length;

  const columns: Column<ClientItem>[] = [
    {
      key: 'logo',
      header: 'Logo Preview',
      render: (c) => (
        <div className="w-24 h-12 rounded-lg bg-white p-1.5 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden">
          {c.logo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={c.logo}
                alt={c.name}
                width={120}
                height={50}
                unoptimized
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/stock/stock-logo.png';
                }}
              />
            </div>
          ) : (
            <span className="font-condensed font-black text-[10px] text-gray-800 uppercase tracking-wider text-center line-clamp-2">
              {c.name}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Client Partner',
      render: (c) => (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-white text-sm">{c.name}</span>
            {c.featured && (
              <span className="inline-flex items-center gap-1 bg-[#ffd700]/10 text-[#ffd700] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-[#ffd700]" /> FEATURED
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-gray-400">/{c.slug}</span>
        </div>
      ),
    },
    {
      key: 'website',
      header: 'Website',
      render: (c) =>
        c.website ? (
          <a
            href={c.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="max-w-[140px] truncate">{c.website.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        ) : (
          <span className="text-gray-500 text-xs font-mono">—</span>
        ),
    },
    {
      key: 'order',
      header: 'Order',
      render: (c) => (
        <span className="font-mono text-xs text-gray-300 bg-slate-800/80 px-2 py-1 rounded border border-white/5 font-bold">
          #{c.order}
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Slider Feature',
      render: (c) => (
        <button
          onClick={() => toggleFeatured(c)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 ${
            c.featured
              ? 'bg-[#ffd700] text-black hover:bg-amber-400 shadow-sm'
              : 'bg-slate-800 text-gray-400 hover:text-white'
          }`}
          title="Toggle Homepage Slider Visibility"
        >
          <Star className={`w-3 h-3 ${c.featured ? 'fill-black' : ''}`} />
          {c.featured ? 'On Slider' : 'Hidden'}
        </button>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (c) => (
        <button
          onClick={() => toggleActive(c)}
          title="Toggle Active Status"
          className="cursor-pointer"
        >
          <StatusBadge status={c.active ? 'ACTIVE' : 'ARCHIVED'} size="sm" />
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(item)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg hover:text-white transition-colors"
            title="Edit Client"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setConfirmDeleteId(item.id)}
            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
            title="Delete Client"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout pageTitle="Client Logos & Roster">
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="font-condensed text-3xl font-extrabold uppercase text-white tracking-wide flex items-center gap-3">
              <Users className="w-8 h-8 text-[#ffd700]" />
              <span>Partner Clients & Logos CMS</span>
            </h2>
            <p className="font-sans text-xs text-gray-400 mt-1">
              Manage client logos, order sequence, website links, and homepage marquee slider visibility.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#ffd700] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-400/20 active:scale-95"
          >
            <Plus size={16} /> Add Partner Client / Logo
          </button>
        </div>

        {/* METRICS / STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Total Clients</span>
            <span className="font-condensed text-3xl font-extrabold text-white">{totalClients}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Active Clients</span>
            <span className="font-condensed text-3xl font-extrabold text-emerald-400">{activeClients}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
            <span className="font-mono text-[10px] text-[#ffd700] uppercase tracking-widest">Slider Featured</span>
            <span className="font-condensed text-3xl font-extrabold text-[#ffd700] flex items-center gap-1.5">
              <Sparkles className="w-5 h-5" /> {featuredClients}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
            <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest">Logos Uploaded</span>
            <span className="font-condensed text-3xl font-extrabold text-purple-400 flex items-center gap-1.5">
              <ImageIcon className="w-5 h-5" /> {withLogos}
            </span>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden p-2">
          <DataTable
            columns={columns}
            data={clients}
            isLoading={loading}
            keyExtractor={(item) => item.id}
            emptyTitle="No Clients Configured"
            emptyDescription="Add your brand partners and client logos using the button above to showcase them in the homepage slider."
          />
        </div>

        {/* CREATE / EDIT MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
                    <Users size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase font-condensed tracking-wide">
                    {editingItem ? 'Edit Client Partner & Logo' : 'Add New Client Partner & Logo'}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* CLIENT NAME & SLUG */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="CLIENT / BRAND NAME" required>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-400 outline-none transition-colors"
                      placeholder="e.g. Bharat Petroleum"
                    />
                  </FormField>

                  <FormField label="IDENTIFIER SLUG" required>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-mono rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-400 outline-none transition-colors"
                      placeholder="e.g. bharat-petroleum"
                    />
                  </FormField>
                </div>

                {/* LOGO MEDIA PICKER */}
                <div className="border border-slate-800/80 bg-slate-950/60 p-4 rounded-xl space-y-3">
                  <MediaPicker
                    label="CLIENT LOGO IMAGE (PNG / SVG / WEBP)"
                    value={formData.logo}
                    onChange={(url) => setFormData({ ...formData, logo: url })}
                    mediaType="image"
                  />

                  {/* LOGO PREVIEW BOX */}
                  {formData.logo && (
                    <div className="mt-2 p-3 bg-white rounded-xl border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-32 flex items-center justify-center">
                          <Image
                            src={formData.logo}
                            alt="Logo preview"
                            width={128}
                            height={56}
                            unoptimized
                            className="max-h-14 max-w-32 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/stock/stock-logo.png';
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-900 block">Live Preview</span>
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px] block">
                            {formData.logo}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="text-xs font-mono text-rose-600 hover:text-rose-800 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition-colors"
                      >
                        Remove Logo
                      </button>
                    </div>
                  )}
                </div>

                {/* WEBSITE URL & DISPLAY ORDER */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <FormField label="WEBSITE URL">
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-400 outline-none transition-colors"
                        placeholder="https://company.com"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="ORDER / PRIORITY">
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-400 outline-none transition-colors"
                        placeholder="1"
                        min="0"
                      />
                    </FormField>
                  </div>
                </div>

                {/* DESCRIPTION / NOTES */}
                <FormField label="DESCRIPTION / CAMPAIGN NOTES">
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-sm focus:border-amber-400 outline-none transition-colors"
                    placeholder="Brief description of brand collaboration or industry segment..."
                  />
                </FormField>

                {/* TOGGLES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Feature in Homepage Slider</span>
                      <span className="text-[11px] text-gray-400 block">Display logo in the active marquee slider</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Active Status</span>
                      <span className="text-[11px] text-gray-400 block">Visible on website and public API</span>
                    </div>
                  </label>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-mono uppercase text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[#ffd700] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
                  >
                    {submitting ? 'Saving...' : editingItem ? 'Update Client & Logo' : 'Save Client Partner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM DIALOG */}
        <ConfirmDialog
          isOpen={!!confirmDeleteId}
          title="Delete Client Partner"
          message="Are you sure you want to remove this client partner? This action will remove the logo from the CMS and homepage slider."
          confirmLabel="Delete Partner"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      </div>
    </AdminLayout>
  );
}