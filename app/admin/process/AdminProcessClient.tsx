"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import MediaPicker from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toast";
import { Layers, Plus, Edit2, Trash2 } from "lucide-react";

interface ProcessStepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  media: string | null;
  order: number;
  active: boolean;
}

export default function AdminProcessClient() {
  const { addToast } = useToast();
  const [steps, setSteps] = useState<ProcessStepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProcessStepItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    stepNumber: "01",
    title: "",
    description: "",
    media: "",
    order: 0,
    active: true,
  });

  const fetchSteps = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/process");
      if (!res.ok) throw new Error("Failed to load process steps");
      const data = await res.json();
      setSteps(data.steps || []);
    } catch (err: any) {
      addToast("error", err.message || "Error fetching process steps");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);


  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      stepNumber: `0${steps.length + 1}`,
      title: "",
      description: "",
      media: "",
      order: steps.length + 1,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ProcessStepItem) => {
    setEditingItem(item);
    setFormData({
      stepNumber: item.stepNumber,
      title: item.title,
      description: item.description,
      media: item.media || "",
      order: item.order,
      active: item.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `/api/admin/process/${editingItem.id}` : "/api/admin/process";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save step");
      addToast("success", `Step ${editingItem ? "updated" : "created"} successfully!`);
      setModalOpen(false);
      fetchSteps();
    } catch (err: any) {
      addToast("error", err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`/api/admin/process/${confirmDeleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      addToast("success", "Process step removed");
      setConfirmDeleteId(null);
      fetchSteps();
    } catch (err: any) {
      addToast("error", err.message || "Failed to delete");
    }
  };

  const columns: Column<ProcessStepItem>[] = [
    {
      key: "stepNumber",
      header: "Step #",
      render: (item) => <span className="font-mono text-amber-400 font-bold">{item.stepNumber}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (item) => <span className="font-bold text-white">{item.title}</span>,
    },
    {
      key: "description",
      header: "Description",
      render: (item) => <span className="text-slate-400 text-xs truncate max-w-[250px] block">{item.description}</span>,
    },
    {
      key: "active",
      header: "Status",
      render: (item) => <StatusBadge status={item.active ? "PUBLISHED" : "DRAFT"} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(item)} className="p-1.5 bg-slate-800 text-slate-300 rounded hover:text-white">
            <Edit2 size={14} />
          </button>
          <button onClick={() => setConfirmDeleteId(item.id)} className="p-1.5 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="text-amber-400" size={24} /> Process Workflow Steps
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage agency process steps displayed across the site.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition"
          >
            <Plus size={16} /> Add Step
          </button>
        </div>

        <DataTable
          columns={columns}
          data={steps}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          emptyTitle="No Process Steps Found"
          emptyDescription="Add process steps to outline your methodology to prospective clients."
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              {editingItem ? "Edit Process Step" : "Add Process Step"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Step Number" required>
                  <input
                    type="text"
                    value={formData.stepNumber}
                    onChange={(e) => setFormData({ ...formData, stepNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </FormField>
                <FormField label="Display Order">
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </FormField>
              </div>
              <FormField label="Title" required>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <FormField label="Description" required>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <MediaPicker
                label="Step Illustration / Icon Media"
                value={formData.media}
                onChange={(url) => setFormData({ ...formData, media: url })}
                mediaType="image"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg">
                  {submitting ? "Saving..." : "Save Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Remove Process Step"
        message="Are you sure you want to delete this process step?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </AdminLayout>
  );
}