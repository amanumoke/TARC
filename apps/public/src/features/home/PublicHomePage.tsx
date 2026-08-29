import { useEffect } from 'react';
import { FeaturedPublicationSection } from './FeaturedPublicationSection';
import { HeroBanner } from './HeroBanner';
import { LatestNewsSection } from './LatestNewsSection';
import { QuickLinksSection } from './QuickLinksSection';
import { StatsSection } from './StatsSection';
import { UpcomingEventsSection } from './UpcomingEventsSection';

export function PublicHomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroBanner />
      <StatsSection />
      <LatestNewsSection />
      <UpcomingEventsSection />
      <FeaturedPublicationSection />
      <QuickLinksSection />
    </div>
  );
}
