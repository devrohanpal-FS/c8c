'use client';

import WorkCard, { WorkProject } from '@/components/WorkCard';

interface FeaturedWorkGridProps {
  projects?: WorkProject[];
}

export default function FeaturedWorkGrid({ projects = [] }: FeaturedWorkGridProps = {}) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 px-4 md:px-8 bg-transparent text-inherit">
      <div className="max-w-[95vw] mx-auto flex flex-col gap-12">
        {projects.map((project) => (
          <WorkCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
