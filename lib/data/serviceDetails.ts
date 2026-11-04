export interface ServiceCapabilityItem {
  title: string;
  description: string;
  tags: string[];
}

export interface ServiceProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  duration?: string;
}

export interface ServiceRelatedWork {
  title: string;
  slug: string;
  client: string;
  category: string;
  image: string;
  videoUrl?: string;
}

export interface ServiceDetailData {
  id: string;
  slug: string;
  title: string;
  titleSerifPart?: string;
  subtitle: string;
  categoryNumber: string;
  tagline: string;
  overview: string;
  fullOverviewParagraphs: string[];
  heroVideo: string;
  heroImage: string;
  capabilities: ServiceCapabilityItem[];
  processSteps: ServiceProcessStep[];
  relatedWorks: ServiceRelatedWork[];
  deliverables: string[];
  quote?: {
    text: string;
    author: string;
    role: string;
    company: string;
  };
  nextService?: {
    slug: string;
    title: string;
    number: string;
    image: string;
  };
}

export function getServiceDetailBySlug(slug: string): ServiceDetailData | null {
  if (!slug) return null;

  const normalized = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const displayTitle = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    id: `srv-${normalized}`,
    slug: normalized,
    title: displayTitle,
    titleSerifPart: 'Craft',
    subtitle: 'BESPOKE CAPABILITY • CRAFTED WITH DISTINCTION',
    categoryNumber: '01',
    tagline: 'Tailored creative direction, strategic precision, and technical mastery.',
    overview: 'We provide specialized creative and technical execution designed to elevate your brand above the noise.',
    fullOverviewParagraphs: [
      'Every project we take on is approached with a relentless commitment to originality, deep strategic insight, and immaculate craftsmanship.',
      'We collaborate closely with ambitious founders and forward-thinking brands to build solutions that leave a lasting mark on their audience.',
    ],
    heroVideo: 'https://vjs.zencdn.net/v/oceans.mp4',
    heroImage: '/images/stock/stock-service.jpg',
    capabilities: [
      {
        title: 'Strategic Consultation & Scoping',
        description: 'Deep diving into your brand objectives and architecting a clear, actionable roadmap.',
        tags: ['Strategy', 'Discovery', 'Analysis', 'Architecture'],
      },
      {
        title: 'Creative Execution & Craft',
        description: 'Executing bespoke design, motion, and technical builds that push modern boundaries.',
        tags: ['Design', 'Engineering', 'Direction', 'Motion'],
      },
    ],
    processSteps: [
      { stepNumber: '01', title: 'Discovery & Immersion', description: 'Understanding requirements, aligning goals, and establishing project benchmarks.', duration: 'Phase 1' },
      { stepNumber: '02', title: 'Concept & Production', description: 'Rapid creative iteration, rigorous development, and polished execution.', duration: 'Phase 2' },
      { stepNumber: '03', title: 'Review & Deployment', description: 'Refining every nuance and deploying across all target platforms with perfection.', duration: 'Phase 3' },
    ],
    deliverables: [
      'Comprehensive Master Assets & Source Packages',
      'Documentation & Implementation Guides',
      'High-Resolution Deliverables & Production Exports',
    ],
    quote: {
      text: 'Working with Cre8tiveCove was easily the most seamless and rewarding creative partnership our marketing team has ever experienced.',
      author: 'SARAH JENKINS',
      role: 'VP OF BRAND MARKETING',
      company: 'CRE8TIVECOVE PARTNER',
    },
    relatedWorks: [],
  };
}
