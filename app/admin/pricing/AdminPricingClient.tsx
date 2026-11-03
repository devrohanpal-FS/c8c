"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { DollarSign, Plus, Edit2, Trash2 } from "lucide-react";

interface PricingTierItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceLabel: string;
  billingPeriod: string;
  features: string;
  ctaText: string;
  ctaUrl: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export default function AdminPricingClient() {
  const { addToast } = useToast();
  const [tiers, setTiers] = useState<PricingTierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingTierItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    priceLabel: "$4,500",
    billingPeriod: "project",
    features: "Feature 1\nFeature 2",
    ctaText: "SELECT PLAN",
    ctaUrl: "/contact",
    featured: false,
    active: true,
    order: 0,
  });

  const fetchTiers = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pricing");
      if (!res.ok) throw new Error("Failed to load pricing tiers");
      const data = await res.json();
      setTiers(data.tiers || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching pricing tiers";
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);


  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      priceLabel: "$4,500",
      billingPeriod: "project",
      features: "Feature 1\nFeature 2",
      ctaText: "SELECT PLAN",
      ctaUrl: "/contact",
      featured: false,
      active: true,
      order: tiers.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: PricingTierItem) => {
    setEditingItem(item);
    let featStr = "";
    try {
      const featArr = typeof item.features === "string" ? JSON.parse(item.features) : item.features;
      if (Array.isArray(featArr)) featStr = featArr.join("\n");
    } catch {
      featStr = item.features || "";
    }

    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description,
      priceLabel: item.priceLabel,
      billingPeriod: item.billingPeriod,
      features: featStr,
      ctaText: item.ctaText,
      ctaUrl: item.ctaUrl,
      featured: item.featured,
      active: item.active,
      order: item.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const featArr = formData.features.split("\n").map((f) => f.trim()).filter(Boolean);
      const payload = {
        ...formData,
        features: JSON.stringify(featArr),
      };

      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `/api/admin/pricing/${editingItem.id}` : "/api/admin/pricing";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save pricing tier");
      addToast("success", `Tier ${editingItem ? "updated" : "created"} successfully!`);
      setModalOpen(false);
      fetchTiers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Operation failed";
      addToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`/api/admin/pricing/${confirmDeleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      addToast("success", "Pricing tier removed");
      setConfirmDeleteId(null);
      fetchTiers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      addToast("error", message);
    }
  };


  const columns: Column<PricingTierItem>[] = [
    {
      key: "name",
      header: "Tier Name",
      render: (item) => (
        <div>
          <div className="font-bold text-white flex items-center gap-2">
            {item.name}
            {item.featured && <span className="text-[10px] bg-amber-500/20 text-amber-400 font-mono px-1.5 py-0.5 rounded">POPULAR</span>}
          </div>
          <div className="text-xs text-slate-500 font-mono">{item.slug}</div>
        </div>
      ),
    },
    {
      key: "priceLabel",
      header: "Price",
      render: (item) => <span className="font-mono text-emerald-400 font-bold text-sm">{item.priceLabel} / {item.billingPeriod}</span>,
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
              <DollarSign className="text-amber-400" size={24} /> Pricing & Services Retainers
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage project pricing tiers, retainer packages, and features.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition"
          >
            <Plus size={16} /> Add Pricing Tier
          </button>
        </div>

        <DataTable
          columns={columns}
          data={tiers}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          emptyTitle="No Pricing Tiers Found"
          emptyDescription="Create pricing tiers to transparently display your service offerings."
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              {editingItem ? "Edit Pricing Tier" : "Add Pricing Tier"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Tier Name" required>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price Label" required>
                  <input
                    type="text"
                    value={formData.priceLabel}
                    onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </FormField>
                <FormField label="Billing Period">
                  <input
                    type="text"
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </FormField>
              </div>
              <FormField label="Description">
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <FormField label="Features Included (1 per line)">
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="CTA Button Text">
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </FormField>
                <FormField label="CTA Target URL">
                  <input
                    type="text"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </FormField>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-amber-400"
                />
                Mark as Most Popular / Featured
              </label>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg">
                  {submitting ? "Saving..." : "Save Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Remove Pricing Tier"
        message="Are you sure you want to delete this pricing tier?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </AdminLayout>
  );
}