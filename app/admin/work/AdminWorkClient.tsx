'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Globe, EyeOff, Sparkles, Star, Film, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Search } from '@/components/admin/Search';
import { Filters } from '@/components/admin/Filters';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField } from '@/components/admin/FormField';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { useToast } from '@/components/admin/Toast';

export interface WorkGalleryItem {
  id?: string;
  mediaUrl: string;
  mediaType?: string;
  caption?: string;
}

interface Work {
  id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  year: string;
  description: string;
  heroMedia?: string | null;
  video?: string | null;
  gallery?: WorkGalleryItem[];
  featured: boolean;
  status: string;
  order: number;
}

export interface AdminWorkClientProps {
  autoOpenNew?: boolean;
  editId?: string;
}

export default function AdminWorkClient({ autoOpenNew, editId }: AdminWorkClientProps = {}) {
  const { addToast } = useToast();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(!!autoOpenNew || !!editId);
  const [editingWork, setEditingWork] = useState<Partial<Work> | null>(
    autoOpenNew
      ? {
          title: '',
          slug: '',
          client: '',
          category: 'Commercial Direction',
          year: '2026',
          description: '',
          status: 'PUBLISHED',
          featured: true,
          gallery: [{ mediaUrl: '', mediaType: 'VIDEO', caption: 'Main Broadcast Film Cut' }],
        }
      : null
  );

  const [deletingWorkId, setDeletingWorkId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchWorks = () => {
    setLoading(true);
    fetch('/api/admin/works')
      .then((res) => res.json())
      .then((data) => {
        if (data.works) setWorks(data.works);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleAddGalleryVideo = () => {
    const current = editingWork?.gallery || [];
    setEditingWork({
      ...editingWork,
      gallery: [
        ...current,
        { mediaUrl: '', mediaType: 'VIDEO', caption: `Film Reel #${current.length + 1}` },
      ],
    });
  };

  const handleUpdateGalleryVideo = (index: number, field: keyof WorkGalleryItem, value: string) => {
    const current = [...(editingWork?.gallery || [])];
    if (current[index]) {
      current[index] = { ...current[index], [field]: value };
      setEditingWork({ ...editingWork, gallery: current });
    }
  };

  const handleRemoveGalleryVideo = (index: number) => {
    const current = (editingWork?.gallery || []).filter((_, i) => i !== index);
    setEditingWork({ ...editingWork, gallery: current });
  };

  const handleMoveGalleryVideo = (index: number, delta: number) => {
    const current = [...(editingWork?.gallery || [])];
    const target = index + delta;
    if (target < 0 || target >= current.length) return;
    const temp = current[index];
    current[index] = current[target];
    current[target] = temp;
    setEditingWork({ ...editingWork, gallery: current });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWork?.title || !editingWork?.slug) return;

    setSubmitting(true);
    const isEdit = Boolean(editingWork.id);
    const endpoint = isEdit ? `/api/admin/works/${editingWork.id}` : '/api/admin/works';
    const method = isEdit ? 'PATCH' : 'POST';

    const galleryPayload = (editingWork.gallery || []).filter((g) => g.mediaUrl && g.mediaUrl.trim() !== '');
    const primaryVideo = editingWork.video || (galleryPayload.length > 0 ? galleryPayload[0].mediaUrl : '');

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
          description: editingWork.description || 'Commercial project overview.',
          fullDescription: editingWork.description,
          heroMedia: editingWork.heroMedia,
          heroVideoUrl: primaryVideo,
          thumbnailUrl: editingWork.heroMedia,
          projectVideoUrl: primaryVideo,
          video: primaryVideo,
          gallery: galleryPayload,
          status: editingWork.status || 'PUBLISHED',
          featured: Boolean(editingWork.featured),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', isEdit ? 'Work Updated' : 'Work Created', `"${editingWork.title}" saved successfully.`);
        setIsModalOpen(false);
        setEditingWork(null);
        fetchWorks();
      } else {
        addToast('error', 'Operation Failed', data.error || 'Failed to save work item.');
      }
    } catch {
      addToast('error', 'Network Error', 'Connection failed while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (work: Work) => {
    const nextStatus = work.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/works/${work.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        addToast('success', 'Status Changed', `Set "${work.title}" to ${nextStatus}.`);
        fetchWorks();
      }
    } catch {
      addToast('error', 'Error', 'Failed to toggle status.');
    }
  };

  const handleToggleFeatured = async (work: Work) => {
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
          nextFeatured ? 'Featured On Home' : 'Removed From Featured',
          `Set "${work.title}" featured status to ${nextFeatured ? 'ON' : 'OFF'}.`
        );
        fetchWorks();
      }
    } catch {
      addToast('error', 'Error', 'Failed to toggle featured status.');
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
        addToast('success', 'Work Soft-Deleted', 'Item removed from active CMS list.');
        setDeletingWorkId(null);
        fetchWorks();
      } else {
        addToast('error', 'Delete Failed', 'Could not delete item.');
      }
    } catch {
      addToast('error', 'Error', 'Delete failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWorks = works.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'FEATURED'
        ? w.featured
        : w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Work>[] = [
    {
      key: 'title',
      header: 'Project Title',
      render: (w) => (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-bold text-white text-xs">{w.title}</span>
            {w.featured && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] font-mono text-[9px] font-bold rounded">
                FEATURED
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] text-gray-500">/{w.slug}</span>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client & Category',
      render: (w) => (
        <div className="flex flex-col text-left font-sans text-xs">
          <span className="text-gray-300 font-bold">{w.client}</span>
          <span className="font-mono text-[10px] text-gray-500">{w.category} ({w.year})</span>
        </div>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (w) => (
        <button
          onClick={() => handleToggleFeatured(w)}
          className={`p-1.5 rounded-lg border transition-all ${
            w.featured
              ? 'bg-[#ffd700]/10 border-[#ffd700]/40 text-[#ffd700] hover:bg-[#ffd700]/20'
              : 'border-white/10 text-gray-500 hover:text-white hover:bg-white/5'
          }`}
          title={w.featured ? 'Unfeature Project' : 'Feature Project on Home'}
        >
          <Star className={`w-4 h-4 ${w.featured ? 'fill-current' : ''}`} />
        </button>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (w) => <StatusBadge status={w.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (w) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusToggle(w)}
            className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title={w.status === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish to Live'}
          >
            {w.status === 'PUBLISHED' ? <EyeOff className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5 text-[#ffd700]" />}
          </button>
          <button
            onClick={() => {
              const existingGallery = (w as any).gallery && (w as any).gallery.length > 0
                ? (w as any).gallery.map((g: any) => ({
                    id: g.id,
                    mediaUrl: g.mediaUrl,
                    mediaType: g.mediaType || 'VIDEO',
                    caption: g.caption || '',
                  }))
                : (w as any).heroVideoUrl || w.video
                ? [{ mediaUrl: (w as any).heroVideoUrl || w.video, mediaType: 'VIDEO', caption: 'Main Broadcast Film Cut' }]
                : [];

              setEditingWork({
                ...w,
                heroMedia: w.heroMedia || (w as any).thumbnailUrl,
                video: (w as any).heroVideoUrl || (w as any).projectVideoUrl || w.video,
                gallery: existingGallery,
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-[#ffd700] hover:bg-white/5 transition-colors"
            title="Edit Work"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingWorkId(w.id)}
            className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete Work"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout pageTitle="Work Index">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Search value={searchQuery} onChange={setSearchQuery} placeholder="Search works by title or client..." />
            <Filters
              options={[
                { label: 'All', value: 'ALL' },
                { label: 'Featured', value: 'FEATURED' },
                { label: 'Published', value: 'PUBLISHED' },
                { label: 'Draft', value: 'DRAFT' },
              ]}
              activeValue={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          <button
            onClick={() => {
              setEditingWork({
                title: '',
                slug: '',
                client: '',
                category: 'Commercial Direction',
                year: '2026',
                description: '',
                status: 'PUBLISHED',
                featured: true,
                heroMedia: '',
                video: '',
                gallery: [{ mediaUrl: '', mediaType: 'VIDEO', caption: 'Main Broadcast Film Cut' }],
              });
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Work</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filteredWorks}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          emptyTitle="No Works Found"
          emptyDescription="No portfolio works match your current filters. Click 'Create New Work' to add one."
        />

        {isModalOpen && editingWork && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
              <h3 className="font-condensed text-3xl font-bold uppercase text-white tracking-wide mb-6">
                {editingWork.id ? 'Edit Work Item' : 'Create Work Item'}
              </h3>

              <form onSubmit={handleSave} className="flex flex-col gap-6">
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
                    placeholder="High-stakes broadcast commercial direction and cinematic storytelling..."
                    className="w-full bg-[#181818] text-white p-4 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700] resize-none"
                  />
                </FormField>

                <MediaPicker
                  label="HERO COVER IMAGE URL"
                  value={editingWork.heroMedia}
                  onChange={(url) => setEditingWork({ ...editingWork, heroMedia: url })}
                />

                <MediaPicker
                  label="PRIMARY HOVER / HERO VIDEO URL (UPLOAD FILE OR PASTE LINK)"
                  mediaType="video"
                  value={editingWork.video}
                  onChange={(url) => setEditingWork({ ...editingWork, video: url })}
                />

                {/* MULTIPLE VIDEO LINKS AND FILES SECTION */}
                <div className="flex flex-col gap-4 pt-4 border-t border-white/15 bg-[#161616]/60 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#ffd700]" />
                      <label className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd700]">
                        PROJECT GALLERY & VIDEO REELS (MULTIPLE VIDEOS / LINKS)
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddGalleryVideo}
                      className="px-3.5 py-1.5 rounded-xl border border-[#ffd700]/40 bg-[#ffd700]/10 hover:bg-[#ffd700]/25 text-[#ffd700] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Video / Link</span>
                    </button>
                  </div>

                  <p className="font-sans text-[11px] text-gray-400">
                    Add as many videos or film reels as you want. You can either <strong className="text-white">upload video files</strong> directly or <strong className="text-white">paste video links</strong> (MP4, YouTube, Vimeo, HLS, etc.).
                  </p>

                  {(!editingWork.gallery || editingWork.gallery.length === 0) ? (
                    <div className="py-6 text-center text-xs text-gray-500 font-mono border border-dashed border-white/15 rounded-xl">
                      No gallery videos added yet. Click &quot;Add Video / Link&quot; above to include multiple film reels.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {editingWork.gallery.map((vItem, index) => (
                        <div key={index} className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/15 flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#ffd700]">
                              Video Reel #{index + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveGalleryVideo(index, -1)}
                                  className="p-1 text-gray-400 hover:text-white transition-colors"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {index < (editingWork.gallery?.length || 0) - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveGalleryVideo(index, 1)}
                                  className="p-1 text-gray-400 hover:text-white transition-colors"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryVideo(index)}
                                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete Video"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <MediaPicker
                            label={`VIDEO #${index + 1} SOURCE`}
                            mediaType="video"
                            value={vItem.mediaUrl}
                            onChange={(url) => handleUpdateGalleryVideo(index, 'mediaUrl', url)}
                          />

                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[10px] font-bold uppercase text-gray-400">Reel Caption / Subtitle</label>
                            <input
                              type="text"
                              value={vItem.caption || ''}
                              onChange={(e) => handleUpdateGalleryVideo(index, 'caption', e.target.value)}
                              placeholder="e.g. Director's Cut • Behind The Scenes • Spot #2"
                              className="w-full bg-[#121212] text-white px-3.5 py-2 rounded-xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-sans font-bold text-gray-300">
                    <input
                      type="checkbox"
                      checked={Boolean(editingWork.featured)}
                      onChange={(e) => setEditingWork({ ...editingWork, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ffd700] focus:ring-[#ffd700]"
                    />
                    <span>Feature on Homepage (Featured Work Grid)</span>
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
                    className="px-6 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans text-xs font-bold uppercase tracking-wider hover:bg-white font-bold"
                  >
                    {submitting ? 'Saving Work...' : 'Save Work'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={Boolean(deletingWorkId)}
          title="Delete Work Item"
          message="Are you sure you want to soft-delete this work item? It will be removed from the CMS active listing."
          confirmLabel="Delete Item"
          onConfirm={handleDelete}
          onCancel={() => setDeletingWorkId(null)}
          isLoading={submitting}
        />
      </div>
    </AdminLayout>
  );
}