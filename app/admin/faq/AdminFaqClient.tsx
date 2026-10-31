"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { HelpCircle, Plus, Edit2, Trash2 } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

export default function AdminFaqClient() {
  const { addToast } = useToast();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    order: 0,
    active: true,
  });

  const fetchFaqs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/faq");
      if (!res.ok) throw new Error("Failed to load FAQs");
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch (err: any) {
      addToast("error", err.message || "Error fetching FAQs");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);


  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      question: "",
      answer: "",
      category: "General",
      order: faqs.length + 1,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: FaqItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
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
      const url = editingItem ? `/api/admin/faq/${editingItem.id}` : "/api/admin/faq";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save FAQ");
      addToast("success", `FAQ ${editingItem ? "updated" : "created"} successfully!`);
      setModalOpen(false);
      fetchFaqs();
    } catch (err: any) {
      addToast("error", err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`/api/admin/faq/${confirmDeleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      addToast("success", "FAQ removed");
      setConfirmDeleteId(null);
      fetchFaqs();
    } catch (err: any) {
      addToast("error", err.message || "Failed to delete");
    }
  };


  const columns: Column<FaqItem>[] = [
    {
      key: "question",
      header: "Question",
      render: (item) => <span className="font-bold text-white">{item.question}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (item) => <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded">{item.category}</span>,
    },
    {
      key: "answer",
      header: "Answer Preview",
      render: (item) => <span className="text-slate-400 text-xs truncate max-w-[300px] block">{item.answer}</span>,
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
              <HelpCircle className="text-amber-400" size={24} /> Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage common questions and answers for clients.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition"
          >
            <Plus size={16} /> Add FAQ
          </button>
        </div>

        <DataTable
          columns={columns}
          data={faqs}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          emptyTitle="No FAQs Found"
          emptyDescription="Add FAQs to help answer common inquiries."
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              {editingItem ? "Edit FAQ" : "Add FAQ"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Category">
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <FormField label="Question" required>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <FormField label="Answer" required>
                <textarea
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg">
                  {submitting ? "Saving..." : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Remove FAQ"
        message="Are you sure you want to delete this FAQ entry?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </AdminLayout>
  );
}