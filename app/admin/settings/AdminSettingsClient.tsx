"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import FormField from "@/components/admin/FormField";
import { useToast } from "@/components/admin/Toast";
import { Settings, Save, RefreshCw } from "lucide-react";

export default function AdminSettingsClient() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "CRE8TIVECOVE",
    tagline: "Lean Mean Storytelling Machine • Weird Energy Since Y2K",
    description: "Full-stack creative agency, digital design studio, and video production hub.",
    phone: "+91 9999-659-129",
    email: "hello@cre8tivecove.com",
    address: "Delhi, India",
    linkedin: "https://www.linkedin.com/company/cre8tivecove/",
    instagram: "https://www.instagram.com/cre8tivecove.cc/",
    youtube: "https://www.youtube.com/@CRE8TIVECOVE",
    footerContent: "© 2026 CRE8TIVECOVE. All rights reserved.",
    defaultCtaHeading: "READY TO START?",
    defaultCtaText: "Let's make something iconic together.",
    defaultCtaUrl: "/contact",
    defaultSeoTitle: "CRE8TIVECOVE — Creative & Digital Agency",
    defaultSeoDesc: "We make people feel something. Strategy, Creative Direction, Digital Experiences, Brand Design.",
  });

  const fetchSettings = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      if (data.settings) {
        setFormData({
          siteName: data.settings.siteName || "",
          tagline: data.settings.tagline || "",
          description: data.settings.description || "",
          phone: data.settings.phone || "",
          email: data.settings.email || "",
          address: data.settings.address || "",
          linkedin: data.settings.linkedin || "",
          instagram: data.settings.instagram || "",
          youtube: data.settings.youtube || "",
          footerContent: data.settings.footerContent || "",
          defaultCtaHeading: data.settings.defaultCtaHeading || "",
          defaultCtaText: data.settings.defaultCtaText || "",
          defaultCtaUrl: data.settings.defaultCtaUrl || "/contact",
          defaultSeoTitle: data.settings.defaultSeoTitle || "",
          defaultSeoDesc: data.settings.defaultSeoDesc || "",
        });
      }
    } catch (_err: unknown) {
      addToast("error", "Failed to load Site Settings");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save site settings");
      addToast("success", "Global Site Settings updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed";
      addToast("error", message);
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
              <Settings className="text-amber-400" size={24} /> Global Site Settings & Contact Details
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure phone, email, address, social media channels, default SEO, and footer text across the site.
            </p>
          </div>
          <button
            onClick={fetchSettings}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Agency Details & Contact Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Site Name" required>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <FormField label="Tagline">
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Contact Phone Number" required>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </FormField>
              <FormField label="Contact Email Address" required>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </FormField>
            </div>
            <FormField label="Physical Office Address" required>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </FormField>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Instagram URL">
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </FormField>
              <FormField label="LinkedIn URL">
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </FormField>
              <FormField label="YouTube URL">
                <input
                  type="text"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </FormField>
            </div>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Footer & Global SEO Defaults</h2>
            <FormField label="Footer Copyright Notice">
              <input
                type="text"
                value={formData.footerContent}
                onChange={(e) => setFormData({ ...formData, footerContent: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Default Meta Title">
                <input
                  type="text"
                  value={formData.defaultSeoTitle}
                  onChange={(e) => setFormData({ ...formData, defaultSeoTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </FormField>
              <FormField label="Default Meta Description">
                <textarea
                  rows={2}
                  value={formData.defaultSeoDesc}
                  onChange={(e) => setFormData({ ...formData, defaultSeoDesc: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-400/10 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}