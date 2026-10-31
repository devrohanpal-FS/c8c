"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import FormField from "@/components/admin/FormField";
import MediaPicker from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toast";
import { Search, Save, RefreshCw, Globe } from "lucide-react";

interface SeoRecord {
  id?: string;
  pageIdentifier: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
}

const PAGES = [
  { id: "HOME", label: "Home Page (/)" },
  { id: "ABOUT", label: "About Page (/about)" },
  { id: "SERVICES", label: "Services Page (/services)" },
  { id: "WORK", label: "Work Portfolio (/work)" },
  { id: "CONTACT", label: "Contact Page (/contact)" },
];

export default function AdminSeoClient() {
  const { addToast } = useToast();
  const [activePage, setActivePage] = useState("HOME");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoMap, setSeoMap] = useState<Record<string, SeoRecord>>({});

  const [formData, setFormData] = useState<SeoRecord>({
    pageIdentifier: "HOME",
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    noIndex: false,
  });

  const fetchSeo = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/seo");
      if (!res.ok) throw new Error("Failed to load SEO records");
      const data = await res.json();
      const map: Record<string, SeoRecord> = {};
      if (Array.isArray(data.seoRecords)) {
        data.seoRecords.forEach((item: SeoRecord) => {
          if (item.pageIdentifier) map[item.pageIdentifier] = item;
        });
      }
      setSeoMap(map);
    } catch (err: any) {
      addToast("error", err.message || "Error fetching SEO data");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  useEffect(() => {
    const current = seoMap[activePage] || {
      pageIdentifier: activePage,
      title: `CRE8TIVECOVE — ${activePage}`,
      description: "",
      keywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      noIndex: false,
    };
    setFormData(current);
  }, [activePage, seoMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, pageIdentifier: activePage }),
      });
      if (!res.ok) throw new Error("Failed to save SEO settings");
      addToast("success", `SEO settings for ${activePage} saved successfully!`);
      fetchSeo();
    } catch (err: any) {
      addToast("error", err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="text-amber-400" size={24} /> Search Engine Optimization (SEO) & OpenGraph
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure meta tags, title tags, canonical URLs, and social media share cards.
            </p>
          </div>
          <button
            onClick={fetchSeo}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {}
        <div className="flex flex-wrap gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePage(p.id)}
              className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition ${
                activePage === p.id
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">
              Meta Tags — {activePage}
            </h2>
            <FormField label="Meta Title" required>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </FormField>
            <FormField label="Meta Description" required>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Focus Keywords (comma separated)">
                <input
                  type="text"
                  value={formData.keywords || ""}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </FormField>
              <FormField label="Canonical URL Override">
                <input
                  type="text"
                  value={formData.canonicalUrl || ""}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </FormField>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm pt-2">
              <input
                type="checkbox"
                checked={formData.noIndex}
                onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-amber-400"
              />
              Hide from Search Engines (noindex, nofollow)
            </label>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">
              OpenGraph & Social Share Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="OG Share Title">
                <input
                  type="text"
                  value={formData.ogTitle || ""}
                  onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <FormField label="OG Share Description">
                <input
                  type="text"
                  value={formData.ogDescription || ""}
                  onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
            </div>
            <MediaPicker
              label="OG Preview Image URL (1200x630)"
              value={formData.ogImage || ""}
              onChange={(url) => setFormData({ ...formData, ogImage: url })}
              mediaType="image"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-400/10 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : `Save SEO for ${activePage}`}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}