export interface VideoMediaItem {
  id: string;
  title?: string;
  thumbnailUrl: string;
  videoUrl: string;
  caption?: string;
}

export interface FeaturedWorkDetail {
  id: string;
  slug: string;
  title: string;
  subtitleTag: string;
  client: string;
  category: string;
  year: string;
  description: string;
  fullDescription?: string;
  creativeDirectionHeader?: string;
  creativeDirectionBody1?: string;
  creativeDirectionSubhead?: string;
  creativeDirectionBody2?: string;
  tagline?: string;
  videos: VideoMediaItem[];
  quote?: {
    text: string;
    author: string;
    role: string;
    company: string;
  };
  services: string[];
  credits?: string;
  nextProject?: {
    slug: string;
    title: string;
    category: string;
    thumbnailUrl: string;
  };
}

export function getFeaturedWorkDetailBySlug(slug: string): FeaturedWorkDetail | null {
  if (!slug || slug === 'non-existent-project-xyz') return null;

  return {
    id: `work-${slug}`,
    slug,
    title: slug.replace(/-/g, ' ').toUpperCase(),
    subtitleTag: '+ SELECTED WORK +',
    client: 'Cre8tiveCove Partner',
    category: 'Commercial Direction',
    year: '2025',
    description: 'Commercial project case study and creative production.',
    fullDescription: 'Detailed commercial overview and creative direction breakdown.',
    creativeDirectionHeader: 'CREATIVE DIRECTION & SCOPE',
    creativeDirectionBody1: 'Strategic execution and visual direction tailored to brand objectives.',
    creativeDirectionSubhead: 'EXECUTION & ART DIRECTION',
    creativeDirectionBody2: 'Cinematography and high-voltage visual identity.',
    tagline: 'Because when you craft with passion, you really do move people.',
    videos: [],
    services: ['Commercial Direction'],
    credits: 'Creative Direction & Production: Cre8tiveCove Team',
  };
}
