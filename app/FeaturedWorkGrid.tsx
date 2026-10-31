'use client';

import WorkCard, { WorkProject } from '@/components/WorkCard';

const featuredProjects: WorkProject[] = [
  {
    id: '1',
    title: 'TVC- SBI FOREIGN CARD',
    client: 'State Bank of India (SBI)',
    category: 'Commercial & Film',
    thumbnailUrl: '/uploads/media_1789716925770_1926afe5529db945.webp',
    videoUrl: '/uploads/media_1789641018034_c785dac94a320847.mp4',
    slug: 'tvc-sbi-foreign-card',
  },
  {
    id: '2',
    title: 'WARIVO NEW EV SCOOTER',
    client: 'WARIVO Motors',
    category: 'Automotive & Product Launch',
    thumbnailUrl: '/uploads/media_1790317167178_9f8fd034136f906b.webp',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    slug: 'warivo-new-ev-scooter',
  },
  {
    id: '3',
    title: 'DIGITAL AD - ECODET',
    client: 'ECODET',
    category: 'Digital Advertising & Motion',
    thumbnailUrl: '/uploads/media_1789712476931_2390ae4a260c6b9f.png',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    slug: 'digital-ad-ecodet',
  },
  {
    id: '4',
    title: 'DRONE FLYTHROUGH',
    client: 'Real Estate & Architecture Studio',
    category: 'Aerial Cinematography & FPV',
    thumbnailUrl: '/uploads/media_1789645040441_8156aa071d1b958d.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    slug: 'drone-flythrough',
  },
  {
    id: '5',
    title: 'NEURO EQUILIBRIUM VERTIGO CLINIC',
    client: 'NeuroEquilibrium Diagnostic Systems',
    category: 'Healthcare & Medical Film',
    thumbnailUrl: '/uploads/media_1790317263343_1a8f8ea6fd90b213.webp',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    slug: 'neuro-equilibrium-vertigo-clinic',
  },
  {
    id: '6',
    title: 'BARCO AT GITEX GLOBAL 2025 DUBAI',
    client: 'Barco Visual Solutions',
    category: 'Event Technology & 3D Interactive',
    thumbnailUrl: '/uploads/media_1789640757160_d4e2ed81fbdc0699.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    slug: 'barco-at-gitex-global-2025-dubai',
  },
  {
    id: '7',
    title: 'BAJAJ INSURANCE',
    client: 'Bajaj Allianz',
    category: 'Finance & Brand Campaign',
    thumbnailUrl: '/uploads/media_1790317334958_9020ba24327380de.webp',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    slug: 'bajaj-insurance',
  },
  {
    id: '8',
    title: 'BHARAT GAS',
    client: 'Bharat Petroleum (BPCL)',
    category: 'Brand Campaign & Motion Craft',
    thumbnailUrl: '/uploads/media_1789716642256_dbd919690b02362a.webp',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    slug: 'bharat-gas',
  },
];

interface FeaturedWorkGridProps {
  projects?: WorkProject[];
}

export default function FeaturedWorkGrid({ projects }: FeaturedWorkGridProps = {}) {
  const activeProjects = (projects && projects.length > 0) ? projects : featuredProjects;

  return (
    <section className="relative py-16 px-4 md:px-8 bg-transparent text-inherit">
      <div className="max-w-[95vw] mx-auto flex flex-col gap-12">
        {activeProjects.map((project) => (
          <WorkCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}