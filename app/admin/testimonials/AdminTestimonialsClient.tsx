'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import { useToast } from '@/components/admin/Toast';
import { Quote, Plus, Edit2, Trash2, Globe, EyeOff, Save, RefreshCw } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  quote: string;
  avatar?: string | null;
  logo?: string | null;
  rating: number;
  order: number;
  featured: boolean;
  active: boolean;
  status: string;
}

export default function AdminTestimonialsClient() {
  const { addToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/testimonials');
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      const data = await res.json();
      if (data.testimonials) setTestimonials(data.testimonials);
    } catch {
      addToast('error', 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.quote) return;

    try {
      setSaving(true);
      const isEdit = Boolean(editingItem.id);
      const endpoint = isEdit ? `/api/admin/testimonials/${editingItem.id}` : '/api/admin/testimonials';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingItem.name,
          designation: editingItem.designation || 'Client Partner',
          company: editingItem.company || 'Brand Partner',
          quote: editingItem.quote,
          avatar: editingItem.avatar,
          logo: editingItem.logo,
          rating: editingItem.rating ?? 5,
          order: editingItem.order ?? testimonials.length + 1,
          featured: Boolean(editingItem.featured),
          active: editingItem.active ?? true,
          status: editingItem.status || 'PUBLISHED',
        }),
      });

      if (!res.ok) throw new Error('Failed to save testimonial');

      addToast('success', isEdit ? 'Testimonial Updated' : 'Testimonial Created');
      setIsModalOpen(false);
      setEditingItem(null);
      fetchTestimonials();
    } catch (err: any) {
      addToast('error', err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('success', 'Testimonial deleted');
        fetchTestimonials();
      }
    } catch {
      addToast('error', 'Delete failed');
    }
  };

  return (
    <AdminLayout pageTitle="Testimonials Management">
      <div className="max-w-5xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Quote className="text-amber-400" size={24} /> Client Testimonials & Feedback
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage client quotes, designations, companies, and testimonial avatars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTestimonials}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => {
                setEditingItem({
                  name: '',
                  designation: '',
                  company: '',
                  quote: '',
                  avatar: '',
                  rating: 5,
                  order: testimonials.length + 1,
                  featured: true,
                  active: true,
                  status: 'PUBLISHED',
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition"
            >
              <Plus size={16} /> Add Testimonial
            </button>
          </div>
        </div>

        {}
        <div className="space-y-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{item.name}</span>
                  <span className="text-xs text-amber-400 font-mono">
                    — {item.designation}, {item.company}
                  </span>
                </div>
                <p className="text-slate-300 text-sm italic">&ldquo;{item.quote}&rdquo;</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {}
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white">
                {editingItem.id ? 'Edit Testimonial' : 'Create Testimonial'}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <FormField label="CLIENT NAME" required>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. SARAH JENKINS"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-400"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="DESIGNATION" required>
                    <input
                      type="text"
                      required
                      value={editingItem.designation || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                      placeholder="e.g. VP OF BRAND MARKETING"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </FormField>

                  <FormField label="COMPANY" required>
                    <input
                      type="text"
                      required
                      value={editingItem.company || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      placeholder="e.g. SKYLA CREDIT UNION"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </FormField>
                </div>

                <FormField label="QUOTE" required>
                  <textarea
                    rows={4}
                    required
                    value={editingItem.quote || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                    placeholder="Client feedback quote..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm outline-none focus:border-amber-400"
                  />
                </FormField>

                <MediaPicker
                  label="CLIENT AVATAR IMAGE"
                  value={editingItem.avatar}
                  onChange={(url) => setEditingItem({ ...editingItem, avatar: url })}
                  mediaType="image"
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs uppercase hover:bg-amber-300"
                  >
                    {saving ? 'Saving...' : 'Save Testimonial'}
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