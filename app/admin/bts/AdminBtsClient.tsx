'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import { useToast } from '@/components/admin/Toast';
import {
  Camera,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  X,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';

interface BtsItem {
  id: string;
  imageUrl: string;
  title?: string | null;
  caption?: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_BTS: Partial<BtsItem> = {
  imageUrl: '',
  title: '',
  caption: '',
  order: 1,
  active: true,
};

export default function AdminBtsClient() {
  const { addToast } = useToast();
  const [items, setItems] = useState<BtsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<BtsItem>>(DEFAULT_BTS);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bts');
      if (!res.ok) throw new Error('Failed to load BTS items');
      const data = await res.json();
      if (data.btsImages) {
        setItems(data.btsImages);
      }
    } catch {
      addToast('error', 'Failed to load BTS photos');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenCreateModal = () => {
    setEditingItem({
      ...DEFAULT_BTS,
      order: items.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BtsItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(DEFAULT_BTS);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem.imageUrl?.trim()) {
      addToast('error', 'Please select or upload a BTS photo');
      return;
    }

    try {
      setSaving(true);
      const isEdit = Boolean(editingItem.id);
      const url = isEdit ? `/api/admin/bts/${editingItem.id}` : '/api/admin/bts';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: editingItem.imageUrl.trim(),
          title: editingItem.title?.trim() || null, // Optional - blank allowed!
          caption: editingItem.caption?.trim() || null,
          order: editingItem.order ?? items.length + 1,
          active: editingItem.active ?? true,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save BTS photo');
      }

      addToast('success', isEdit ? 'BTS photo updated!' : 'New BTS photo added!');
      handleCloseModal();
      fetchItems();
    } catch (err: any) {
      addToast('error', err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, index: number) => {
    if (!confirm(`Are you sure you want to delete BTS Photo #${index + 1}?`)) return;

    try {
      const res = await fetch(`/api/admin/bts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete BTS photo');

      addToast('success', 'BTS photo deleted');
      fetchItems();
    } catch (err: any) {
      addToast('error', err.message || 'Delete failed');
    }
  };

  const handleToggleActive = async (item: BtsItem) => {
    try {
      const newStatus = !item.active;
      const res = await fetch(`/api/admin/bts/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, active: newStatus } : i))
      );
      addToast('success', newStatus ? 'Photo activated' : 'Photo hidden');
    } catch {
      addToast('error', 'Status update failed');
      fetchItems();
    }
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    setItems(reordered.map((item, idx) => ({ ...item, order: idx + 1 })));

    try {
      const res = await fetch('/api/admin/bts/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });

      if (!res.ok) throw new Error('Reorder failed');
      addToast('success', 'Order updated');
    } catch {
      addToast('error', 'Failed to save photo order');
      fetchItems();
    }
  };

  return (
    <AdminLayout pageTitle="BTS Gallery">
      <div className="max-w-6xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Camera className="text-amber-400" size={24} />
              Behind The Scenes (BTS) Production Gallery
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage all production stills and Behind The Scenes photography. Upload photos now and add or update titles whenever you wish.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchItems}
              title="Refresh"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-amber-400/10 transition cursor-pointer"
            >
              <Plus size={16} /> Add BTS Photo
            </button>
          </div>
        </div>

        {/* Notice Info Box */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-300 font-mono">
          <span>
            📸 <strong>{items.length} BTS Photos</strong> currently configured. Titles can be left blank and added later!
          </span>
          <span className="hidden sm:inline text-slate-400">
            Source: <code className="text-amber-400">public/images/BTS/</code>
          </span>
        </div>

        {/* BTS Photo Grid */}
        {loading && items.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-mono">Loading BTS photos...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <Sparkles className="w-10 h-10 text-amber-400/50 mx-auto mb-3" />
            <h3 className="text-white font-bold text-base">No BTS Photos Found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              Upload your first Behind The Scenes photo. Title can be left blank!
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-300 transition cursor-pointer"
            >
              <Plus size={14} /> Add First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`relative rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 group ${
                  item.active
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900/60 opacity-60'
                }`}
              >
                {/* Photo Preview Container */}
                <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title || `BTS Photo ${index + 1}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/stock/stock-bts.jpg';
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Order Badge & Active Pill */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className="font-mono text-[11px] font-bold bg-black/80 backdrop-blur-md text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/30">
                      #{String(item.order).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => handleToggleActive(item)}
                      title={item.active ? 'Click to deactivate' : 'Click to activate'}
                      className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-md cursor-pointer transition ${
                        item.active
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/50'
                          : 'bg-red-950/90 text-red-300 border border-red-700/50'
                      }`}
                    >
                      {item.active ? (
                        <>
                          <CheckCircle2 size={10} /> Active
                        </>
                      ) : (
                        <>
                          <XCircle size={10} /> Inactive
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Preview Button */}
                  <button
                    onClick={() => setPreviewImageUrl(item.imageUrl)}
                    title="View Fullsize"
                    className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition cursor-pointer z-10"
                  >
                    <Eye size={13} />
                  </button>
                </div>

                {/* Details Footer */}
                <div className="p-3.5 space-y-2.5">
                  <div>
                    <h3 className="text-white font-bold text-xs truncate">
                      {item.title ? (
                        item.title
                      ) : (
                        <span className="text-slate-500 italic font-mono text-[11px]">
                          (Title blank — add later)
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                      {item.imageUrl}
                    </p>
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                    {/* Move Up / Down */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSlide(index, 'up')}
                        title="Move Up"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={index === items.length - 1}
                        onClick={() => handleMoveSlide(index, 'down')}
                        title="Move Down"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Edit BTS Photo / Add Title"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, index)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 hover:text-red-300 transition cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <Camera className="text-amber-400" size={18} />
                  <h2 className="text-base font-bold text-white">
                    {editingItem.id ? 'Edit BTS Photo / Title' : 'Add New BTS Photo'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <MediaPicker
                  label="BTS Photo Image (Upload from Computer or pick asset)"
                  value={editingItem.imageUrl || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                  mediaType="image"
                />

                <FormField label="Title (Optional — can be left blank for now)">
                  <input
                    type="text"
                    value={editingItem.title || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    placeholder="Leave blank or enter title later"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    As requested, title can remain blank right now and updated anytime later.
                  </p>
                </FormField>

                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <FormField label="Display Order">
                    <input
                      type="number"
                      value={editingItem.order ?? 1}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          order: parseInt(e.target.value, 10) || 1,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white text-xs text-center font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </FormField>

                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-200 text-xs font-bold select-none pt-4">
                      <input
                        type="checkbox"
                        checked={editingItem.active ?? true}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, active: e.target.checked })
                        }
                        className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-400 w-4 h-4"
                      />
                      Active on Website
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-amber-400/10 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={13} />
                    {saving ? 'Saving...' : editingItem.id ? 'Save Changes' : 'Upload Photo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FULLSCREEN PREVIEW LIGHTBOX */}
        {previewImageUrl && (
          <div
            onClick={() => setPreviewImageUrl(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition cursor-pointer"
            >
              <X size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt="BTS Preview"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/stock/stock-bts.jpg';
              }}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
