export type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean | undefined | null };

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (typeof input === 'object') {
      if (Array.isArray(input)) {
        const inner = cn(...input);
        if (inner) classes.push(inner);
      } else {
        for (const [key, value] of Object.entries(input)) {
          if (value) classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'direct';
  embedUrl: string;
  originalUrl: string;
  youtubeId?: string;
  vimeoId?: string;
  defaultThumbnail?: string;
}

export function parseVideoUrl(url: string | null | undefined): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return { type: 'direct', embedUrl: '', originalUrl: '' };
  }

  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { type: 'direct', embedUrl: '', originalUrl: '' };
  }

  // 1. YouTube Match
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`,
      youtubeId: videoId,
      originalUrl: cleanUrl,
      defaultThumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 2. Vimeo Match
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&autopause=0`,
      vimeoId: videoId,
      originalUrl: cleanUrl,
    };
  }

  // 3. Direct Video File (MP4, WebM, /uploads/..., etc.)
  return {
    type: 'direct',
    embedUrl: cleanUrl,
    originalUrl: cleanUrl,
  };
}