"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import FormField from "@/components/admin/FormField";
import MediaPicker from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toast";
import {
  Save,
  RefreshCw,
  LayoutTemplate,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

interface CultureSlide {
  id?: string;
  mediaUrl: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  buttonText?: string | null;
  linkUrl?: string | null;
  order: number;
  active: boolean;
}

export default function AdminHomeClient() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "WEIRD ENERGY SINCE Y2K",
    heroSubtitle: "Featured Work",
    heroVideoUrl: "",
    heroPosterUrl: "",
    heroCtaText: "EXPLORE WORK",
    heroCtaUrl: "/work",
    marqueeText: "STRATEGY • CREATIVE DIRECTION • VISUAL IDENTITY • DIGITAL EXPERIENCES",
    marqueeActive: true,
    ctaHeading: "READY TO MAKE SOMETHING WEIRD?",
    ctaDescription: "Let's build something people won't stop talking about.",
    ctaButtonText: "START A PROJECT",
    ctaButtonUrl: "/contact",
    cultureTag: "THE CULTURE",
    cultureTitle: "BEHIND THE LENS BEYOND THE STORY",
  });
  const [collageItems, setCollageItems] = useState<CultureSlide[]>([]);

  const fetchHome = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/home");
      if (!res.ok) throw new Error("Failed to fetch home page content");
      const data = await res.json();
      if (data.home) {
        setFormData({
          heroTitle: data.home.heroTitle || "",
          heroSubtitle: data.home.heroSubtitle || "",
          heroVideoUrl: data.home.heroVideoUrl || "",
          heroPosterUrl: data.home.heroPosterUrl || "",
          heroCtaText: data.home.heroCtaText || "EXPLORE WORK",
          heroCtaUrl: data.home.heroCtaUrl || "/work",
          marqueeText: data.home.marqueeText || "",
          marqueeActive: data.home.marqueeActive ?? true,
          ctaHeading: data.home.ctaHeading || "",
          ctaDescription: data.home.ctaDescription || "",
          ctaButtonText: data.home.ctaButtonText || "START A PROJECT",
          ctaButtonUrl: data.home.ctaButtonUrl || "/contact",
          cultureTag: data.home.cultureTag || "THE CULTURE",
          cultureTitle: data.home.cultureTitle || "BEHIND THE LENS BEYOND THE STORY",
        });
      }
      if (data.collageItems && Array.isArray(data.collageItems)) {
        setCollageItems(data.collageItems);
      }
    } catch (_err: unknown) {
      addToast("error", "Failed to load Home Page content");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          collageItems,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save changes");
      }
      addToast("success", "Home page & Culture Coverflow updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed";
      addToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCollageItem = () => {
    const nextNum = collageItems.length + 1;
    setCollageItems([
      ...collageItems,
      {
        mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
        title: `CULTURE SLIDE #${nextNum}`,
        subtitle: "Visual Craft & Heritage",
        badge: `0${nextNum} CULTURE`,
        buttonText: "View Story",
        linkUrl: "/work",
        order: nextNum,
        active: true,
      },
    ]);
  };

  const handleRemoveCollageItem = (index: number) => {
    setCollageItems(collageItems.filter((_, idx) => idx !== index));
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= collageItems.length) return;
    const copy = [...collageItems];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    copy.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setCollageItems(copy);
  };

  const handleUpdateSlideField = (index: number, field: keyof CultureSlide, value: string | number | boolean | null) => {
    const copy = [...collageItems];
    copy[index] = { ...copy[index], [field]: value };
    setCollageItems(copy);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <LayoutTemplate className="text-amber-400" size={24} /> Home Page Content Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure Hero text, 3D Culture Coverflow Slider, Marquee ticker, and Call To Action section.
            </p>
          </div>
          <button
            onClick={fetchHome}
            title="Refresh Content"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* HERO SLIDERS QUICK BANNER */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-400 text-slate-950 rounded-xl font-bold">
              <SlidersHorizontal size={22} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                Homepage Hero Banner Sliders
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  NEW
                </span>
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                The homepage hero is powered by the dynamic Hero Banner Slider. Manage slide visuals, titles, ordering, and CTAs.
              </p>
            </div>
          </div>
          <Link
            href="/admin/sliders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition shadow shrink-0 self-start sm:self-auto"
          >
            Manage Hero Sliders <ExternalLink size={14} />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* HERO SECTION */}
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Hero Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Hero Main Title" required>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
              <FormField label="Hero Subtitle">
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
            </div>

            <MediaPicker
              label="Hero Background Video URL (MP4 / WebM)"
              value={formData.heroVideoUrl}
              onChange={(url) => setFormData({ ...formData, heroVideoUrl: url })}
              mediaType="video"
            />

            <MediaPicker
              label="Hero Video Fallback Poster Image"
              value={formData.heroPosterUrl}
              onChange={(url) => setFormData({ ...formData, heroPosterUrl: url })}
              mediaType="image"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Hero CTA Button Label">
                <input
                  type="text"
                  value={formData.heroCtaText}
                  onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
              <FormField label="Hero CTA Target URL">
                <input
                  type="text"
                  value={formData.heroCtaUrl}
                  onChange={(e) => setFormData({ ...formData, heroCtaUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
            </div>
          </div>

          {/* 3D CULTURE COVERFLOW SLIDER SECTION */}
          <div className="bg-slate-900/60 p-6 rounded-xl border border-amber-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Layers size={20} className="text-amber-400" />
                  3D Culture Coverflow Slider (THE CULTURE)
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Control the interactive auto-sliding 3D Coverflow carousel cards on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCollageItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-bold rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
              >
                <Plus size={14} /> Add New Slide
              </button>
            </div>

            {/* Section Tag & Heading */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              <FormField label="Section Top Tagline">
                <input
                  type="text"
                  value={formData.cultureTag}
                  onChange={(e) => setFormData({ ...formData, cultureTag: e.target.value })}
                  placeholder="THE CULTURE"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs uppercase tracking-wider focus:border-amber-400 focus:outline-none"
                />
              </FormField>
              <FormField label="Section Main Title / Headline">
                <input
                  type="text"
                  value={formData.cultureTitle}
                  onChange={(e) => setFormData({ ...formData, cultureTitle: e.target.value })}
                  placeholder="BEHIND THE LENS BEYOND THE STORY"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold text-sm uppercase focus:border-amber-400 focus:outline-none"
                />
              </FormField>
            </div>

            {/* Slide Cards List */}
            <div className="space-y-4">
              {collageItems.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-dashed border-slate-800">
                  <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No culture slides configured yet.</p>
                  <button
                    type="button"
                    onClick={handleAddCollageItem}
                    className="mt-3 px-4 py-2 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 text-xs font-bold rounded-lg border border-amber-400/30 transition"
                  >
                    + Add First Slide
                  </button>
                </div>
              ) : (
                collageItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 bg-slate-950 rounded-xl border border-slate-800/90 hover:border-slate-700 transition space-y-4 shadow-sm"
                  >
                    {/* Slide Header Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 text-xs font-bold font-mono">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {item.title || `Slide #${idx + 1}`}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-400/20 text-[10px] font-mono font-bold uppercase">
                            {item.badge}
                          </span>
                        )}
                        {!item.active && (
                          <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 text-[10px] font-bold uppercase">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, "up")}
                          title="Move Slide Up"
                          className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === collageItems.length - 1}
                          onClick={() => handleMoveSlide(idx, "down")}
                          title="Move Slide Down"
                          className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollageItem(idx)}
                          title="Delete Slide"
                          className="p-1.5 rounded-md bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 hover:text-red-300 ml-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Media Picker */}
                    <MediaPicker
                      label="Slide Photo / Visual Media"
                      value={item.mediaUrl}
                      onChange={(url) => handleUpdateSlideField(idx, "mediaUrl", url)}
                      mediaType="image"
                    />

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <FormField label="Slide Title">
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => handleUpdateSlideField(idx, "title", e.target.value)}
                          placeholder="e.g. RETRO TECH 1"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-bold uppercase focus:border-amber-400 focus:outline-none"
                        />
                      </FormField>

                      <FormField label="Subtitle / Tagline">
                        <input
                          type="text"
                          value={item.subtitle || ""}
                          onChange={(e) => handleUpdateSlideField(idx, "subtitle", e.target.value)}
                          placeholder="e.g. Y2K Heritage & Hardware Ethos"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </FormField>

                      <FormField label="Badge Pill">
                        <input
                          type="text"
                          value={item.badge || ""}
                          onChange={(e) => handleUpdateSlideField(idx, "badge", e.target.value)}
                          placeholder="e.g. 01 CULTURE"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-mono uppercase focus:border-amber-400 focus:outline-none"
                        />
                      </FormField>

                      <FormField label="Button Label">
                        <input
                          type="text"
                          value={item.buttonText || ""}
                          onChange={(e) => handleUpdateSlideField(idx, "buttonText", e.target.value)}
                          placeholder="e.g. View Story"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </FormField>

                      <FormField label="Target Link URL">
                        <input
                          type="text"
                          value={item.linkUrl || ""}
                          onChange={(e) => handleUpdateSlideField(idx, "linkUrl", e.target.value)}
                          placeholder="e.g. /work or /about"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </FormField>

                      <FormField label="Order & Status">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={item.order ?? idx + 1}
                            onChange={(e) =>
                              handleUpdateSlideField(idx, "order", parseInt(e.target.value, 10) || 0)
                            }
                            className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs text-center font-mono"
                          />
                          <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                            <input
                              type="checkbox"
                              checked={item.active ?? true}
                              onChange={(e) => handleUpdateSlideField(idx, "active", e.target.checked)}
                              className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-400"
                            />
                            Active
                          </label>
                        </div>
                      </FormField>
                    </div>
                  </div>
                ))
              )}

              {collageItems.length > 0 && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleAddCollageItem}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg border border-amber-400/30 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Another Slide
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MARQUEE BANNER */}
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Marquee Banner</h2>
            <FormField label="Marquee Ticker Text">
              <textarea
                rows={2}
                value={formData.marqueeText}
                onChange={(e) => setFormData({ ...formData, marqueeText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-mono text-sm"
              />
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={formData.marqueeActive}
                onChange={(e) => setFormData({ ...formData, marqueeActive: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400"
              />
              Enable Marquee Banner on Home Page
            </label>
          </div>

          {/* BOTTOM CALL-TO-ACTION (CTA) */}
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">
              Bottom Call-To-Action (CTA)
            </h2>
            <FormField label="CTA Heading">
              <input
                type="text"
                value={formData.ctaHeading}
                onChange={(e) => setFormData({ ...formData, ctaHeading: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
              />
            </FormField>
            <FormField label="CTA Description">
              <textarea
                rows={2}
                value={formData.ctaDescription}
                onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="CTA Button Text">
                <input
                  type="text"
                  value={formData.ctaButtonText}
                  onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
              <FormField label="CTA Target URL">
                <input
                  type="text"
                  value={formData.ctaButtonUrl}
                  onChange={(e) => setFormData({ ...formData, ctaButtonUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </FormField>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-400/10 disabled:opacity-50 cursor-pointer"
            >
              <Save size={18} />
              {saving ? "Saving Changes..." : "Save Home Content"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}