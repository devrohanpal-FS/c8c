'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Upload, X, Check, Loader2, Film } from 'lucide-react';
import { parseVideoUrl } from '@/lib/utils';

export interface MediaPickerProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  mediaType?: 'image' | 'video';
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  value,
  onChange,
  label = 'Media Asset',
  mediaType = 'image',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(value || '');
  const [previewSrc, setPreviewSrc] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputUrl(value || '');
    setPreviewSrc(value || '');
  }, [value]);

  const parsedVideo = parseVideoUrl(value);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.media?.url) {
        onChange(data.media.url);
        setInputUrl(data.media.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'File upload failed';
      alert(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fetchLibrary = async () => {
    try {
      setLoadingLibrary(true);
      const res = await fetch('/api/admin/media?limit=24');
      const data = await res.json();
      if (data.items) {
        setLibraryItems(data.items);
      }
    } catch {

    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLibrary();
    }
  }, [isOpen]);

  const handleSelect = () => {
    onChange(inputUrl);
    setIsOpen(false);
  };

  const isVideo =
    mediaType === 'video' ||
    (typeof value === 'string' &&
      (/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(value) ||
        value.includes('youtube.com') ||
        value.includes('youtu.be') ||
        value.includes('vimeo.com')));

  return (
    <div className="flex flex-col gap-2 text-left w-full">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs font-bold uppercase tracking-widest text-white">
          {label}
        </label>
        <span className="font-mono text-[10px] text-amber-400/90 font-semibold uppercase tracking-wider">
          {mediaType === 'video' ? 'Upload Video File OR Paste Link' : 'Upload Image File OR Paste Link'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative w-full sm:w-24 h-16 rounded-xl overflow-hidden bg-black/80 border border-white/15 flex items-center justify-center shrink-0 group">
          {value ? (
            !isVideo ? (
              <Image
                src={previewSrc || '/images/stock/stock-placeholder.png'}
                alt="Preview"
                fill
                unoptimized
                className="object-cover"
                onError={() => setPreviewSrc('/images/stock/stock-placeholder.png')}
              />
            ) : parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
              <iframe
                src={parsedVideo.embedUrl}
                className="w-full h-full border-0 pointer-events-none scale-125"
                tabIndex={-1}
              />
            ) : (
              <video src={parsedVideo.embedUrl || value} controls={false} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            )
          ) : mediaType === 'video' ? (
            <Film className="w-6 h-6 text-amber-400" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-500" />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={mediaType === 'video' ? 'Paste Video Link (e.g. https://.../video.mp4 or Vimeo/YouTube)...' : 'Paste Image Link (e.g. https://...)...'}
              className="w-full bg-[#161616] text-white px-4 py-2.5 rounded-xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700] transition-colors pr-24"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-3 text-gray-500 hover:text-white text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime,video/*' : 'image/*'}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-lg border border-[#ffd700]/40 bg-[#ffd700]/15 hover:bg-[#ffd700]/25 text-[#ffd700] font-mono text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploading ? 'Uploading File...' : mediaType === 'video' ? 'Upload Video File' : 'Upload Image File'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInputUrl(value || '');
                setIsOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Library Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#121212] border border-white/15 rounded-3xl p-6 text-left shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-condensed text-2xl font-bold uppercase text-white tracking-wide mb-1">
              Select {mediaType === 'image' ? 'Image' : 'Video'} Asset
            </h3>
            <p className="font-sans text-xs text-gray-400 mb-6">
              Option A: Paste direct video/image URL link • Option B: Pick from Media Library
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase text-gray-400">Direct Video Link / URL</label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://domain.com/video.mp4"
                  className="w-full bg-[#161616] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase text-gray-400">Or Select From Uploaded Library</label>
                {loadingLibrary ? (
                  <div className="py-8 text-center text-gray-500 text-xs">Loading media library...</div>
                ) : libraryItems.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 bg-[#181818] rounded-2xl border border-white/10">
                    {libraryItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setInputUrl(item.url)}
                        className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          inputUrl === item.url ? 'border-[#ffd700] scale-95 shadow-lg' : 'border-transparent hover:border-white/40'
                        }`}
                      >
                        {item.mimeType?.startsWith('video') || /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(item.url || '') ? (
                          <video src={item.url} className="w-full h-full object-cover" />
                        ) : (
                          <Image
                            src={item.url || '/images/stock/stock-placeholder.png'}
                            alt={item.title || 'Media'}
                            fill
                            unoptimized
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/stock/stock-placeholder.png';
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500 text-xs">No uploaded media in library yet. Use the Upload Video File button to add files.</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full border border-white/20 text-gray-300 font-sans text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSelect}
                className="px-5 py-2 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans text-xs font-bold uppercase tracking-wider hover:bg-white flex items-center gap-1.5 font-bold"
              >
                <Check className="w-4 h-4" />
                <span>Apply Media URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPicker;