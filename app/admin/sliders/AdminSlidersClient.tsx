'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import { useToast } from '@/components/admin/Toast';
import {
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  X,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string | null;
  tagline?: string | null;
  mediaUrl: string;
  mediaType: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaUrl?: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_SLIDE: Partial<HeroSlide> = {
  title: '',
  subtitle: '',
  tagline: 'CREATIVE DIRECTION',
  mediaUrl: '',
  mediaType: 'IMAGE',
  ctaText: 'EXPLORE WORK',
  ctaUrl: '/work',
  secondaryCtaText: '',
  secondaryCtaUrl: '',
  order: 1,
  active: true,
};

export default function AdminSlidersClient() {
  const { addToast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide>>(DEFAULT_SLIDE);

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sliders');
      if (!res.ok) throw new Error('Failed to load slides');
      const data = await res.json();
      if (data.slides) {
        setSlides(data.slides);
      }
    } catch {
      addToast('error', 'Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const handleOpenCreateModal = () => {
    setEditingSlide({
      ...DEFAULT_SLIDE,
      order: slides.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(DEFAULT_SLIDE);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSlide.title?.trim()) {
      addToast('error', 'Please enter a slide title');
      return;
    }
    if (!editingSlide.mediaUrl?.trim()) {
      addToast('error', 'Please select or upload a media visual for the slide');
      return;
    }

    try {
      setSaving(true);
      const isEdit = Boolean(editingSlide.id);
      const url = isEdit ? `/api/admin/sliders/${editingSlide.id}` : '/api/admin/sliders';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingSlide.title.trim(),
          subtitle: editingSlide.subtitle?.trim() || null,
          tagline: editingSlide.tagline?.trim() || 'CREATIVE DIRECTION',
          mediaUrl: editingSlide.mediaUrl.trim(),
          mediaType: editingSlide.mediaType || 'IMAGE',
          ctaText: editingSlide.ctaText?.trim() || 'EXPLORE WORK',
          ctaUrl: editingSlide.ctaUrl?.trim() || '/work',
          secondaryCtaText: editingSlide.secondaryCtaText?.trim() || null,
          secondaryCtaUrl: editingSlide.secondaryCtaUrl?.trim() || null,
          order: editingSlide.order ?? slides.length + 1,
          active: editingSlide.active ?? true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save slide');
      }

      addToast('success', isEdit ? 'Slide updated successfully!' : 'New slide created successfully!');
      handleCloseModal();
      fetchSlides();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Save failed';
      addToast('error', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the slide "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete slide');

      addToast('success', 'Slide deleted');
      fetchSlides();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      addToast('error', message);
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const newStatus = !slide.active;
      const res = await fetch(`/api/admin/sliders/${slide.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, active: newStatus } : s))
      );
      addToast('success', newStatus ? 'Slide activated' : 'Slide deactivated');
    } catch {
      addToast('error', 'Status update failed');
      fetchSlides();
    }
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((slide, idx) => ({
      id: slide.id,
      order: idx + 1,
    }));

    setSlides(reordered.map((slide, idx) => ({ ...slide, order: idx + 1 })));

    try {
      const res = await fetch('/api/admin/sliders/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });

      if (!res.ok) throw new Error('Reorder failed');
      addToast('success', 'Order updated');
    } catch {
      addToast('error', 'Failed to save slide order');
      fetchSlides();
    }
  };

  return (
    <AdminLayout pageTitle="Hero Sliders">
      <div className="max-w-5xl space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <SlidersHorizontal className="text-amber-400" size={24} />
              Homepage Hero Banner Sliders
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage the dynamic hero banner slider on the homepage. Reorder slides, configure visual backgrounds, badges, and Call-To-Action buttons.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchSlides}
              title="Refresh"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-amber-400/10 transition cursor-pointer"
            >
              <Plus size={16} /> Add New Slide
            </button>
          </div>
        </div>

        {/* Slides List */}
        {loading && slides.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-mono">Loading hero slides...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <Sparkles className="w-10 h-10 text-amber-400/50 mx-auto mb-3" />
            <h3 className="text-white font-bold text-base">No Hero Slides Configured</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              Add your first slider banner with high-impact visuals, headline, and CTA.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-300 transition cursor-pointer"
            >
              <Plus size={14} /> Create First Slide
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`relative p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  slide.active
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900/80 opacity-70'
                }`}
              >
                {/* Left section: Order + Media Preview + Info */}
                <div className="flex items-start md:items-center gap-4 flex-1">
                  {/* Order Controls */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveSlide(index, 'up')}
                      title="Move slide up"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <span className="font-mono text-xs font-bold text-amber-400 px-1 py-0.5">
                      {String(slide.order).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => handleMoveSlide(index, 'down')}
                      title="Move slide down"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                    {slide.mediaType === 'VIDEO' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                        <video
                          src={slide.mediaUrl}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <Film className="absolute top-1.5 left-1.5 w-4 h-4 text-amber-400 drop-shadow" />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={slide.mediaUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/stock/stock-hero.jpg';
                        }}
                      />
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-md rounded text-[9px] font-mono text-white/90 uppercase">
                      {slide.mediaType}
                    </span>
                  </div>

                  {/* Slide Content Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {slide.tagline && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-[10px] font-mono font-bold uppercase tracking-wider">
                          {slide.tagline}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                          slide.active
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : 'bg-red-950/80 text-red-400 border border-red-800/40'
                        }`}
                      >
                        {slide.active ? (
                          <>
                            <CheckCircle2 size={10} /> Active
                          </>
                        ) : (
                          <>
                            <XCircle size={10} /> Inactive
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-base truncate font-condensed tracking-wide">
                      {slide.title}
                    </h3>

                    {slide.subtitle && (
                      <p className="text-slate-400 text-xs line-clamp-1">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] font-mono text-slate-400">
                      {slide.ctaText && (
                        <span className="flex items-center gap-1 text-slate-300">
                          CTA: <strong className="text-amber-400">{slide.ctaText}</strong> ({slide.ctaUrl})
                        </span>
                      )}
                      {slide.secondaryCtaText && (
                        <span className="flex items-center gap-1 text-slate-400">
                          • 2nd: <strong className="text-slate-300">{slide.secondaryCtaText}</strong> ({slide.secondaryCtaUrl})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    title={slide.active ? 'Deactivate Slide' : 'Activate Slide'}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      slide.active
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300'
                    }`}
                  >
                    {slide.active ? 'Set Inactive' : 'Set Active'}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(slide)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
                    title="Edit Slide"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(slide.id, slide.title)}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 hover:text-red-300 transition cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT SLIDE MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="text-amber-400" size={20} />
                  <h2 className="text-lg font-bold text-white">
                    {editingSlide.id ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* Media Type & Picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Media Asset (Image or Video)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSlide({ ...editingSlide, mediaType: 'IMAGE' })
                        }
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                          editingSlide.mediaType === 'IMAGE'
                            ? 'bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ImageIcon size={13} /> Image
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSlide({ ...editingSlide, mediaType: 'VIDEO' })
                        }
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                          editingSlide.mediaType === 'VIDEO'
                            ? 'bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Film size={13} /> Video
                      </button>
                    </div>
                  </div>

                  <MediaPicker
                    label={
                      editingSlide.mediaType === 'VIDEO'
                        ? 'Select or Upload Slide Video (MP4 / WebM)'
                        : 'Select or Upload Slide Background Image'
                    }
                    value={editingSlide.mediaUrl || ''}
                    onChange={(url) => setEditingSlide({ ...editingSlide, mediaUrl: url })}
                    mediaType={editingSlide.mediaType === 'VIDEO' ? 'video' : 'image'}
                  />
                </div>

                {/* Tagline & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <FormField label="Category / Tagline Pill">
                      <input
                        type="text"
                        value={editingSlide.tagline || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, tagline: e.target.value })
                        }
                        placeholder="e.g. CREATIVE DIRECTION"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-mono uppercase focus:border-amber-400 focus:outline-none"
                      />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="Main Headline Title" required>
                      <input
                        type="text"
                        value={editingSlide.title || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, title: e.target.value })
                        }
                        placeholder="e.g. WE ARE CRE8TIVECOVE"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Subtitle / Description */}
                <FormField label="Subtitle / Narrative Text">
                  <textarea
                    rows={2}
                    value={editingSlide.subtitle || ''}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                    }
                    placeholder="e.g. Lean Mean Storytelling Machine & Bold Digital Studio"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </FormField>

                {/* CTA Buttons */}
                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-4">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    Call-To-Action (CTA) Buttons
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Primary CTA Button Label">
                      <input
                        type="text"
                        value={editingSlide.ctaText || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, ctaText: e.target.value })
                        }
                        placeholder="EXPLORE WORK"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </FormField>
                    <FormField label="Primary CTA Target URL">
                      <input
                        type="text"
                        value={editingSlide.ctaUrl || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, ctaUrl: e.target.value })
                        }
                        placeholder="/work"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Secondary Button Label (Optional)">
                      <input
                        type="text"
                        value={editingSlide.secondaryCtaText || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })
                        }
                        placeholder="ABOUT US"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </FormField>
                    <FormField label="Secondary Button Target URL">
                      <input
                        type="text"
                        value={editingSlide.secondaryCtaUrl || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, secondaryCtaUrl: e.target.value })
                        }
                        placeholder="/about"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Order & Active Status */}
                <div className="flex items-center gap-6 p-4 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-mono text-slate-300 uppercase">
                      Slide Order:
                    </label>
                    <input
                      type="number"
                      value={editingSlide.order ?? 1}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          order: parseInt(e.target.value, 10) || 1,
                        })
                      }
                      className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white text-xs text-center font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-200 text-xs font-bold select-none">
                    <input
                      type="checkbox"
                      checked={editingSlide.active ?? true}
                      onChange={(e) =>
                        setEditingSlide({ ...editingSlide, active: e.target.checked })
                      }
                      className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-400 w-4 h-4"
                    />
                    Active on Homepage
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-amber-400/10 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={14} />
                    {saving ? 'Saving...' : editingSlide.id ? 'Save Changes' : 'Create Slide'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
