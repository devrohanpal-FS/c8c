"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import FormField from "@/components/admin/FormField";
import MediaPicker from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toast";
import { Save, RefreshCw, Info, Film } from "lucide-react";
import { parseVideoUrl } from "@/lib/utils";

export default function AdminAboutClient() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "WEIRD ENERGY SINCE Y2K",
    heroContent: "We are a bold digital design and storytelling collective.",
    backgroundUrl: "",
    missionTitle: "WE MAKE PEOPLE FEEL SOMETHING",
    missionBody: "Crafting unforgettable visual identities, web experiences, and film.",
    companyStory: "Founded in 2020 to push digital boundaries.",
    historyBody: "",
    credentials: "Awwwards Site of the Day\nFWA of the Month\nRed Dot Design Award",
    certifications: "Google Cloud Partner\nPrisma Certified Enterprise Developer",
    ctaHeading: "WORK WITH US",
    ctaButtonText: "GET IN TOUCH",
    ctaButtonUrl: "/contact",
  });

  const fetchAbout = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about");
      if (!res.ok) throw new Error("Failed to fetch About page content");
      const data = await res.json();
      if (data.about) {
        let credsStr = "";
        let certsStr = "";
        try {
          const credsArr = typeof data.about.credentials === "string" ? JSON.parse(data.about.credentials) : data.about.credentials;
          if (Array.isArray(credsArr)) credsStr = credsArr.join("\n");
        } catch {
          credsStr = data.about.credentials || "";
        }
        try {
          const certsArr = typeof data.about.certifications === "string" ? JSON.parse(data.about.certifications) : data.about.certifications;
          if (Array.isArray(certsArr)) certsStr = certsArr.join("\n");
        } catch {
          certsStr = data.about.certifications || "";
        }

        setFormData({
          heroTitle: data.about.heroTitle || "",
          heroContent: data.about.heroContent || "",
          backgroundUrl: data.about.backgroundUrl || "",
          missionTitle: data.about.missionTitle || "",
          missionBody: data.about.missionBody || "",
          companyStory: data.about.companyStory || "",
          historyBody: data.about.historyBody || "",
          credentials: credsStr,
          certifications: certsStr,
          ctaHeading: data.about.ctaHeading || "",
          ctaButtonText: data.about.ctaButtonText || "GET IN TOUCH",
          ctaButtonUrl: data.about.ctaButtonUrl || "/contact",
        });
      }
    } catch (_err: unknown) {
      addToast("error", "Failed to load About Page content");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const credsArray = formData.credentials.split("\n").map((s) => s.trim()).filter(Boolean);
      const certsArray = formData.certifications.split("\n").map((s) => s.trim()).filter(Boolean);

      const payload = {
        ...formData,
        backgroundUrl: formData.backgroundUrl?.trim() || null,
        credentials: JSON.stringify(credsArray),
        certifications: JSON.stringify(certsArray),
      };

      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      addToast("success", "About page content updated successfully!");
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
              <Info className="text-amber-400" size={24} /> About Page Content Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage agency history, mission statement, credentials, and company story.
            </p>
          </div>
          <button
            onClick={fetchAbout}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Hero & Mission</h2>
            <FormField label="Hero Title" required>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
              />
            </FormField>
            <FormField label="Hero Content Summary">
              <textarea
                rows={3}
                value={formData.heroContent}
                onChange={(e) => setFormData({ ...formData, heroContent: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
              />
            </FormField>
            <div className="space-y-3 pt-2">
              <MediaPicker
                label="About Page Hero Showreel / Background Video"
                value={formData.backgroundUrl}
                onChange={(url) => setFormData({ ...formData, backgroundUrl: url })}
                mediaType="video"
              />
              <p className="text-xs text-slate-400 font-mono">
                Supports YouTube URLs (e.g. https://www.youtube.com/watch?v=...), Vimeo URLs, direct MP4/WebM video links, or file uploads from your device.
              </p>

              {formData.backgroundUrl && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                      <Film size={14} /> Video Source: {parseVideoUrl(formData.backgroundUrl).type.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                      {formData.backgroundUrl}
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                    {parseVideoUrl(formData.backgroundUrl).type === "youtube" ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${parseVideoUrl(formData.backgroundUrl).youtubeId}?autoplay=0&controls=1&rel=0`}
                        title="About Video Preview"
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : parseVideoUrl(formData.backgroundUrl).type === "vimeo" ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${parseVideoUrl(formData.backgroundUrl).vimeoId}?autoplay=0&controls=1`}
                        title="About Video Preview"
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={parseVideoUrl(formData.backgroundUrl).embedUrl || formData.backgroundUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Mission Title">
                <input
                  type="text"
                  value={formData.missionTitle}
                  onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
              <FormField label="Mission Statement Body">
                <textarea
                  rows={3}
                  value={formData.missionBody}
                  onChange={(e) => setFormData({ ...formData, missionBody: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
            </div>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Story & Credentials</h2>
            <FormField label="Company Story">
              <textarea
                rows={3}
                value={formData.companyStory}
                onChange={(e) => setFormData({ ...formData, companyStory: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
              />
            </FormField>
            <FormField label="History & Milestones">
              <textarea
                rows={3}
                value={formData.historyBody}
                onChange={(e) => setFormData({ ...formData, historyBody: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Awards & Credentials (1 per line)">
                <textarea
                  rows={4}
                  value={formData.credentials}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-mono text-xs"
                />
              </FormField>
              <FormField label="Certifications & Partnerships (1 per line)">
                <textarea
                  rows={4}
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-mono text-xs"
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
              {saving ? "Saving Changes..." : "Save About Content"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}