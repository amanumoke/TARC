import { useEffect } from 'react';
import { FeaturedProject } from './FeaturedProject';
import { FieldImageSection } from './FieldImageSection';
import { LatestPublications } from './LatestPublications';
import { ProjectArchive } from './ProjectArchive';
import { ResearchCTA } from './ResearchCTA';
import { ResearchHero } from './ResearchHero';
import { ResearchProcess } from './ResearchProcess';
import { ResearchPrograms } from './ResearchPrograms';

export function ResearchPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="research-page">
      <ResearchHero />
      <ResearchPrograms />
      <FeaturedProject />
      <ProjectArchive />
      <ResearchProcess />
      <LatestPublications />
      <FieldImageSection />
      <ResearchCTA />
    </div>
  );
}
