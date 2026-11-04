"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import Search from "@/components/admin/Search";
import Filters from "@/components/admin/Filters";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Image as ImageIcon, Film, Upload, Trash2, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string | null;
  title: string | null;
  createdAt: string;
}

export default function AdminMediaClient() {
  const { addToast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [mimeFilter, setMimeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = React.useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "16",
        search,
        mimeType: mimeFilter,
      });

      const res = await fetch(`/api/admin/media?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to load media assets");
      const data = await res.json();
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching media";
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [page, search, mimeFilter, addToast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      setUploading(true);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      addToast("success", "Media uploaded successfully!");
      fetchMedia();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error";
      addToast("error", message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`/api/admin/media/${confirmDeleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      addToast("success", "Media asset deleted");
      setConfirmDeleteId(null);
      fetchMedia();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete asset";
      addToast("error", message);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    addToast("success", "Media URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="text-amber-400" size={24} /> Media Asset Library
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Securely upload and manage images, video clips, posters, and brand graphics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMedia}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl cursor-pointer transition shadow-lg shadow-amber-400/10">
              <Upload size={16} />
              <span>{uploading ? "Uploading..." : "Upload Media"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <Search
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search filename or title..."
          />
          <Filters
            options={[
              { label: "All Types", value: "ALL" },
              { label: "Images", value: "image" },
              { label: "Videos", value: "video" },
            ]}
            activeValue={mimeFilter}
            onChange={(val) => {
              setMimeFilter(val);
              setPage(1);
            }}
          />
        </div>

        {}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-44 bg-slate-900 animate-pulse rounded-xl border border-slate-800" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <ImageIcon size={48} className="mx-auto text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white">No Media Assets Found</h3>
            <p className="text-slate-400 text-xs mt-1">Upload images or videos to populate your media library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => {
              const isVideo = item.mimeType.startsWith("video");
              return (
                <div
                  key={item.id}
                  className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-amber-400/50 transition flex flex-col"
                >
                  <div className="relative h-36 bg-slate-950 flex items-center justify-center overflow-hidden">
                    {isVideo ? (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <Film size={28} className="text-amber-400" />
                        <span className="font-mono text-[10px] uppercase">Video File</span>
                      </div>
                    ) : (
                      <Image
                        src={item.url || '/images/stock/stock-placeholder.png'}
                        alt={item.originalFilename}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/stock/stock-placeholder.png';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700"
                        title="Copy Public URL"
                      >
                        {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700"
                        title="View Asset"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg border border-rose-500/30"
                        title="Delete Asset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border-t border-slate-800">
                    <p className="font-mono text-xs text-white truncate font-medium" title={item.originalFilename}>
                      {item.originalFilename}
                    </p>
                    <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500 font-mono">
                      <span>{(item.size / 1024).toFixed(0)} KB</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalCount}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete Media Asset"
        message="Are you sure you want to permanently delete this media asset?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </AdminLayout>
  );
}