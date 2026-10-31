'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Plus,
  Star,
  Edit2,
  Trash2,
  Globe,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search as SearchIcon,
  CheckCircle2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useToast } from '@/components/admin/Toast';

interface WorkItem {
  id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  year: string;
  description: string;
  heroMedia?: string | null;
  thumbnailUrl?: string | null;
  heroVideoUrl?: string | null;
  projectVideoUrl?: string | null;
  video?: string | null;
  featured: boolean;
  status: string;
  order: number;
}

export default function AdminFeaturedWorkClient() {
  const { addToast } = useToast();
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'featured' | 'promote'>('featured');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Partial<WorkItem> | null>(null);
  const [deletingWorkId, setDeletingWorkId] = useState<string | null>(null);

  const fetchWorks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/works');
      const data = await res.json();
      if (res.ok && data.works) {
        setWorks(data.works);
      }
    } catch {
      addToast('error', 'Error', 'Failed to fetch works data.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const featuredWorks = works
    .filter((w) => w.featured)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const nonFeaturedWorks = works.filter((w) => !w.featured);

  const filteredFeatured = featuredWorks.filter(
    (w) =>
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNonFeatured = nonFeaturedWorks.filter(
    (w) =>
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleFeatured = async (work: WorkItem) => {
    const nextFeatured = !work.featured;
    try {
      const res = await fetch(`/api/admin/works/${work.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      if (res.ok) {
        addToast(
          'success',
          nextFeatured ? 'Added to Featured' : 'Removed from Featured',
          `"${work.title}" ${nextFeatured ? 'is now featured on the home page' : 'removed from featured list'}.`
        );
        fetchWorks();
      } else {
        addToast('error', 'Update Failed', 'Could not update featured status.');
      }
    } catch {
      addToast('error', 'Error', 'Network error while updating status.');
    }
  };

  const handleOrderChange = async (work: WorkItem, newOrder: number) => {
    try {
      const res = await fetch(`/api/admin/works/${work.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });
      if (res.ok) {
        fetchWorks();
      }
    } catch {
      addToast('error', 'Error', 'Failed to reorder item.');
    }
  };

  const handleStatusToggle = async (work: WorkItem) => {
    const nextStatus = work.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/works/${work.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        addToast('success', 'Status Updated', `Set "${work.title}" status to ${nextStatus}.`);
        fetchWorks();
      }
    } catch {
      addToast('error', 'Error', 'Failed to toggle status.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWork?.title || !editingWork?.slug) return;

    setSubmitting(true);
    const isEdit = Boolean(editingWork.id);
    const endpoint = isEdit ? `/api/admin/works/${editingWork.id}` : '/api/admin/works';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingWork.title,
          slug: editingWork.slug,
          client: editingWork.client || 'Client Partner',
          category: editingWork.category || 'Commercial Direction',
          year: editingWork.year || '2026',
          description: editingWork.description || 'Featured creative direction overview.',
          fullDescription: editingWork.description,
          heroMedia: editingWork.heroMedia || editingWork.thumbnailUrl,
          heroVideoUrl: editingWork.heroVideoUrl || editingWork.video,
          thumbnailUrl: editingWork.heroMedia || editingWork.thumbnailUrl,
          projectVideoUrl: editingWork.heroVideoUrl || editingWork.video,
          status: editingWork.status || 'PUBLISHED',
          featured: editingWork.featured ?? true,
          order: editingWork.order ?? 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', isEdit ? 'Featured Work Saved' : 'Featured Work Created', `"${editingWork.title}" saved.`);
        setIsModalOpen(false);
        setEditingWork(null);
        fetchWorks();
      } else {
        addToast('error', 'Save Failed', data.error || 'Failed to save item.');
      }
    } catch {
      addToast('error', 'Network Error', 'Connection failed while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingWorkId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/works/${deletingWorkId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        addToast('success', 'Work Deleted', 'Work item removed from CMS.');
        setDeletingWorkId(null);
        fetchWorks();
      }
    } catch {
      addToast('error', 'Error', 'Failed to delete work item.');
    } finally {
      setSubmitting(false);
    }
  };

  const openNewModal = () => {
    setEditingWork({
      title: '',
      slug: '',
      client: '',
      category: 'Commercial Direction',
      year: '2026',
      description: '',
      heroMedia: '',
      heroVideoUrl: '',
      status: 'PUBLISHED',
      featured: true,
      order: featuredWorks.length + 1,
    });
    setIsModalOpen(true);
  };

  return (
    <AdminLayout pageTitle="Featured Work Management">
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        {/* Header Summary Card */}
        <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Homepage Showcase
            </div>
            <h1 className="font-condensed text-3xl font-bold uppercase text-white tracking-wide">
              Featured Work Collection
            </h1>
            <p className="text-gray-400 text-xs font-sans max-w-xl">
              Upload, manage, and feature your highest-impact creative projects directly on the homepage.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchWorks}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ffd700]' : ''}`} />
            </button>
            <button
              onClick={openNewModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#ffd700]/20 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Featured Work</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'featured'
                  ? 'bg-[#ffd700] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Featured ({featuredWorks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('promote')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'promote'
                  ? 'bg-[#ffd700] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Other Works ({nonFeaturedWorks.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title or client..."
              className="w-full bg-[#121212] text-white pl-10 pr-4 py-2.5 rounded-2xl font-sans text-xs outline-none border border-white/10 focus:border-[#ffd700]"
            />
          </div>
        </div>

        {/* Tab Content: Featured Works */}
        {activeTab === 'featured' && (
          <div className="flex flex-col gap-4">
            {filteredFeatured.length === 0 ? (
              <div className="bg-[#121212] border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4">
                <Star className="w-12 h-12 text-gray-600" />
                <h3 className="font-condensed text-xl font-bold uppercase text-white">No Featured Works Found</h3>
                <p className="text-gray-400 text-xs max-w-md">
                  {searchQuery ? 'No featured projects match your search.' : 'You have not marked any works as featured yet. Click below to upload one or select from your existing portfolio.'}
                </p>
                <button
                  onClick={openNewModal}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd700] text-black font-sans font-bold text-xs uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" /> Upload Featured Work
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFeatured.map((work, index) => {
                  const mediaSrc = work.heroMedia || work.thumbnailUrl || '/images/stock/stock-work.jpg';
                  const videoSrc = work.heroVideoUrl || work.projectVideoUrl || work.video;
                  return (
                    <div
                      key={work.id}
                      className="group bg-[#121212] border border-white/10 hover:border-[#ffd700]/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl"
                    >
                      {/* Media Card Top */}
                      <div className="relative aspect-[16/9] w-full bg-black/50 overflow-hidden">
                        {videoSrc ? (
                          <video
                            src={videoSrc}
                            poster={mediaSrc}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Image
                            src={mediaSrc}
                            alt={work.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/stock/stock-work.jpg';
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold bg-[#ffd700] text-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                            #{index + 1} FEATURED
                          </span>
                          <StatusBadge status={work.status} size="sm" />
                        </div>

                        <button
                          onClick={() => handleToggleFeatured(work)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#ffd700] hover:scale-110 transition-transform"
                          title="Unfeature Item"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 text-left">
                          <span className="font-mono text-[10px] text-gray-300 uppercase tracking-widest block">
                            {work.client} • {work.category}
                          </span>
                          <h3 className="font-condensed text-2xl font-bold uppercase text-white tracking-wide mt-0.5">
                            {work.title}
                          </h3>
                        </div>
                      </div>

                      {/* Controls Bottom */}
                      <div className="p-4 bg-[#161616] border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">Display Order:</span>
                          <div className="flex items-center gap-1">
                            <button
                              disabled={index === 0}
                              onClick={() => handleOrderChange(work, Math.max(0, (work.order || 0) - 1))}
                              className="p-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-xs font-bold text-white px-2">
                              {work.order ?? index + 1}
                            </span>
                            <button
                              disabled={index === filteredFeatured.length - 1}
                              onClick={() => handleOrderChange(work, (work.order || 0) + 1)}
                              className="p-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusToggle(work)}
                            className="p-1.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            title={work.status === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish Live'}
                          >
                            {work.status === 'PUBLISHED' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Globe className="w-4 h-4 text-[#ffd700]" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setEditingWork({
                                ...work,
                                heroMedia: work.heroMedia || work.thumbnailUrl,
                                heroVideoUrl: work.heroVideoUrl || work.projectVideoUrl || work.video,
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-xl border border-white/10 text-gray-400 hover:text-[#ffd700] hover:bg-white/5 transition-colors"
                            title="Edit Work"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingWorkId(work.id)}
                            className="p-1.5 rounded-xl border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Work"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Promote Non-Featured Works */}
        {activeTab === 'promote' && (
          <div className="flex flex-col gap-4">
            {filteredNonFeatured.length === 0 ? (
              <div className="bg-[#121212] border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <CheckCircle2 className="w-12 h-12 text-[#ffd700]" />
                <h3 className="font-condensed text-xl font-bold uppercase text-white">All Works Featured</h3>
                <p className="text-gray-400 text-xs">Every portfolio work item is currently featured on the home page.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredNonFeatured.map((work) => (
                  <div
                    key={work.id}
                    className="bg-[#121212] border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 text-left hover:border-white/20 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={work.status} size="sm" />
                        <span className="font-mono text-[10px] text-gray-500 font-bold">{work.year}</span>
                      </div>
                      <h4 className="font-sans font-bold text-white text-sm">{work.title}</h4>
                      <p className="font-mono text-[10px] text-gray-400">{work.client} • {work.category}</p>
                    </div>

                    <button
                      onClick={() => handleToggleFeatured(work)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/15 text-gray-300 font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#ffd700] hover:text-black transition-all"
                    >
                      <Star className="w-3.5 h-3.5" /> Feature on Homepage
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && editingWork && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
              <h3 className="font-condensed text-3xl font-bold uppercase text-white tracking-wide mb-6">
                {editingWork.id ? 'Edit Featured Work' : 'Upload New Featured Work'}
              </h3>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <FormField label="PROJECT TITLE" required>
                  <input
                    type="text"
                    required
                    value={editingWork.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingWork({ ...editingWork, title, slug });
                    }}
                    placeholder="e.g. THE PLAYERS CLUB"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <FormField label="URL SLUG" required>
                  <input
                    type="text"
                    required
                    value={editingWork.slug || ''}
                    onChange={(e) => setEditingWork({ ...editingWork, slug: e.target.value })}
                    placeholder="the-players-club"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="CLIENT PARTNER">
                    <input
                      type="text"
                      value={editingWork.client || ''}
                      onChange={(e) => setEditingWork({ ...editingWork, client: e.target.value })}
                      placeholder="e.g. SC Education Lottery"
                      className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                    />
                  </FormField>

                  <FormField label="CATEGORY">
                    <input
                      type="text"
                      value={editingWork.category || ''}
                      onChange={(e) => setEditingWork({ ...editingWork, category: e.target.value })}
                      placeholder="e.g. Commercial Direction"
                      className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                    />
                  </FormField>
                </div>

                <FormField label="DESCRIPTION">
                  <textarea
                    rows={3}
                    value={editingWork.description || ''}
                    onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })}
                    placeholder="Overview of this featured work..."
                    className="w-full bg-[#181818] text-white p-4 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700] resize-none"
                  />
                </FormField>

                <MediaPicker
                  label="FEATURED COVER IMAGE URL"
                  value={editingWork.heroMedia}
                  onChange={(url) => setEditingWork({ ...editingWork, heroMedia: url })}
                />

                <MediaPicker
                  label="BACKGROUND HOVER VIDEO URL (MP4 / WebM)"
                  mediaType="video"
                  value={editingWork.heroVideoUrl}
                  onChange={(url) => setEditingWork({ ...editingWork, heroVideoUrl: url })}
                />

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-sans font-bold text-gray-300">
                    <input
                      type="checkbox"
                      checked={Boolean(editingWork.featured)}
                      onChange={(e) => setEditingWork({ ...editingWork, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ffd700] focus:ring-[#ffd700]"
                    />
                    <span>Mark as Featured Work (Show on Homepage)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-white/20 text-gray-300 font-sans text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans text-xs font-bold uppercase tracking-wider hover:bg-white"
                  >
                    {submitting ? 'Saving...' : 'Save Featured Work'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={Boolean(deletingWorkId)}
          title="Delete Work Item"
          message="Are you sure you want to delete this work item? It will be removed from your CMS works list."
          confirmLabel="Delete Work"
          onConfirm={handleDelete}
          onCancel={() => setDeletingWorkId(null)}
          isLoading={submitting}
        />
      </div>
    </AdminLayout>
  );
}
