/**
 * @file apps/public/src/features/home/PublicHomePage.tsx
 * @description Public home page assembling hero, stats, and featured research.
 * Main landing page for the TARC public portal.
 */

import { FeaturedResearchSection } from './FeaturedResearchSection';
import { HeroBanner } from './HeroBanner';
import { StatsCounter } from './StatsCounter';

/**
 * Public home page component.
 * Assembles all home page sections into a cohesive landing experience.
 */
export function PublicHomePage() {
  return (
    <div>
      <HeroBanner />
      <StatsCounter />
      <FeaturedResearchSection />
    </div>
  );
}
