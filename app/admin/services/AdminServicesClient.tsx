'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Globe, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Search } from '@/components/admin/Search';
import { Filters } from '@/components/admin/Filters';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField } from '@/components/admin/FormField';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { useToast } from '@/components/admin/Toast';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string | null;
  image?: string | null;
  hoverVideo?: string | null;
  category?: string | null;
  tags?: string | null;
  order: number;
  active: boolean;
  status: string;
}

export default function AdminServicesClient() {
  const { addToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title || !editingService?.slug) return;

    setSubmitting(true);
    const isEdit = Boolean(editingService.id);
    const endpoint = isEdit ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingService.title,
          slug: editingService.slug,
          description: editingService.description || '',
          fullDescription: editingService.fullDescription || null,
          image: editingService.image || null,
          hoverVideo: editingService.hoverVideo || null,
          category: editingService.category || 'TECHNOLOGY',
          tags: editingService.tags || null,
          order: Number(editingService.order) || 0,
          active: editingService.status !== 'DRAFT',
          status: editingService.status || 'PUBLISHED',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', isEdit ? 'Service Updated' : 'Service Created', `"${editingService.title}" saved successfully.`);
        setIsModalOpen(false);
        setEditingService(null);
        fetchServices();
      } else {
        addToast('error', 'Save Failed', data.error || 'Failed to save service.');
      }
    } catch {
      addToast('error', 'Network Error', 'Connection failed while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (service: Service) => {
    const nextStatus = service.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, active: nextStatus === 'PUBLISHED' }),
      });
      if (res.ok) {
        addToast('success', 'Status Changed', `Set "${service.title}" to ${nextStatus}.`);
        fetchServices();
      }
    } catch {
      addToast('error', 'Error', 'Failed to toggle status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingServiceId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/services/${deletingServiceId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        addToast('success', 'Service Deleted', 'Service removed from active CMS list.');
        setDeletingServiceId(null);
        fetchServices();
      } else {
        addToast('error', 'Delete Failed', 'Could not delete service.');
      }
    } catch {
      addToast('error', 'Error', 'Delete failed.');
    } finally {
      setSubmitting(false);
    }
  };


  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tags && s.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || (s.category || 'CREATIVE') === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const columns: Column<Service>[] = [
    {
      key: 'title',
      header: 'Service Title',
      render: (s) => (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-white text-xs">{s.title}</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider ${
              s.category === 'TECHNOLOGY'
                ? 'bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30'
                : 'bg-white/10 text-white border border-white/20'
            }`}>
              {s.category || 'CREATIVE'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-gray-500">/{s.slug}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description & Scope',
      render: (s) => (
        <div className="flex flex-col text-left max-w-sm">
          <span className="font-sans text-xs text-gray-300 truncate block">{s.description}</span>
          {s.tags && (
            <span className="font-mono text-[10px] text-gray-400 truncate mt-0.5">
              {s.tags}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <StatusBadge status={s.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusToggle(s)}
            className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title={s.status === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish to Live'}
          >
            {s.status === 'PUBLISHED' ? <EyeOff className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5 text-[#ffd700]" />}
          </button>
          <button
            onClick={() => {
              setEditingService(s);
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-[#ffd700] hover:bg-white/5 transition-colors"
            title="Edit Service"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingServiceId(s.id)}
            className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete Service"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout pageTitle="Services Management">
      <div className="flex flex-col gap-8">
        {/* FILTERS & SEARCH */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Search value={searchQuery} onChange={setSearchQuery} placeholder="Search services or tags..." />
            <Filters
              options={[
                { label: 'All Types', value: 'ALL' },
                { label: 'Technology', value: 'TECHNOLOGY' },
                { label: 'Creative', value: 'CREATIVE' },
              ]}
              activeValue={categoryFilter}
              onChange={setCategoryFilter}
            />
            <Filters
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Published', value: 'PUBLISHED' },
                { label: 'Draft', value: 'DRAFT' },
              ]}
              activeValue={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          <button
            onClick={() => {
              setEditingService({
                title: '',
                slug: '',
                description: '',
                fullDescription: '',
                category: 'TECHNOLOGY',
                tags: '',
                status: 'PUBLISHED',
                order: services.length + 1,
              });
              setIsModalOpen(true);
            }}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Service</span>
          </button>
        </div>

        {/* DATA TABLE */}
        <DataTable
          columns={columns}
          data={filteredServices}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          emptyTitle="No Services Found"
          emptyDescription="No services match your filters. Click 'Create New Service' to add a service offering."
        />

        {/* CREATE / EDIT MODAL */}
        {isModalOpen && editingService && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
              <h3 className="font-condensed text-3xl font-bold uppercase text-white tracking-wide mb-6">
                {editingService.id ? 'Edit Service Offering' : 'Create New Service'}
              </h3>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="SERVICE CATEGORY" required>
                    <select
                      value={editingService.category || 'TECHNOLOGY'}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                    >
                      <option value="TECHNOLOGY">Technology & AI Services</option>
                      <option value="CREATIVE">Creative Direction & Film</option>
                    </select>
                  </FormField>

                  <FormField label="DISPLAY ORDER">
                    <input
                      type="number"
                      value={editingService.order ?? 0}
                      onChange={(e) => setEditingService({ ...editingService, order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                    />
                  </FormField>
                </div>

                <FormField label="SERVICE TITLE" required>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingService({ ...editingService, title, slug });
                    }}
                    placeholder="e.g. Web Development"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <FormField label="URL SLUG" required>
                  <input
                    type="text"
                    required
                    value={editingService.slug || ''}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="web-development"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <FormField label="BULLET TAGS / PILLS (SEPARATED BY • OR COMMA)">
                  <input
                    type="text"
                    value={editingService.tags || ''}
                    onChange={(e) => setEditingService({ ...editingService, tags: e.target.value })}
                    placeholder="Websites • Web Apps • SaaS • E-commerce"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <FormField label="SHORT DESCRIPTION" required>
                  <textarea
                    rows={2}
                    required
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    placeholder="Brief service description shown on list cards..."
                    className="w-full bg-[#181818] text-white p-4 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700] resize-none"
                  />
                </FormField>

                <FormField label="FULL DETAILS">
                  <textarea
                    rows={4}
                    value={editingService.fullDescription || ''}
                    onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                    placeholder="In-depth service breakdown, capabilities and scope details..."
                    className="w-full bg-[#181818] text-white p-4 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700] resize-none"
                  />
                </FormField>

                <MediaPicker
                  label="SERVICE COVER IMAGE URL"
                  value={editingService.image}
                  onChange={(url) => setEditingService({ ...editingService, image: url })}
                />

                <MediaPicker
                  label="HOVER VIDEO URL"
                  mediaType="video"
                  value={editingService.hoverVideo}
                  onChange={(url) => setEditingService({ ...editingService, hoverVideo: url })}
                />

                <FormField label="PUBLISHING STATUS">
                  <select
                    value={editingService.status || 'PUBLISHED'}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value })}
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </FormField>

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
                    {submitting ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={Boolean(deletingServiceId)}
          title="Delete Service Offering"
          message="Are you sure you want to delete this service? It will be removed from the CMS active listing."
          confirmLabel="Delete Service"
          onConfirm={handleDelete}
          onCancel={() => setDeletingServiceId(null)}
          isLoading={submitting}
        />
      </div>
    </AdminLayout>
  );
}