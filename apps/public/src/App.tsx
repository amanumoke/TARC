/**
 * @file apps/public/src/App.tsx
 * @description Main application root for the TARCMS Public Institutional Portal.
 * Provides routing and layout for all public pages.
 */

import { PublicAboutPage } from '@/features/about/PublicAboutPage';
import { PublicContactPage } from '@/features/contact/PublicContactPage';
import { PublicDirectorPage } from '@/features/director/PublicDirectorPage';
import { PublicEventsPage } from '@/features/events/PublicEventsPage';
import { PublicGalleryPage } from '@/features/gallery/PublicGalleryPage';
import { PublicHomePage } from '@/features/home/PublicHomePage';
import { PublicNewsPage } from '@/features/news/PublicNewsPage';
import { PublicPublicationsPage } from '@/features/publications/PublicPublicationsPage';
import { PublicResearchPage } from '@/features/research/PublicResearchPage';
import { PublicLayout } from '@/layouts/PublicLayout';

/**
 * Root Public Application Component.
 * Uses hash-based routing for static deployment.
 */
export function App(): React.ReactElement {
  // Simple hash-based routing
  const path = window.location.hash.slice(1) || '/';

  const renderPage = () => {
    switch (path) {
      case '/about':
        return <PublicAboutPage />;
      case '/director':
        return <PublicDirectorPage />;
      case '/news':
        return <PublicNewsPage />;
      case '/publications':
        return <PublicPublicationsPage />;
      case '/research':
        return <PublicResearchPage />;
      case '/events':
        return <PublicEventsPage />;
      case '/gallery':
        return <PublicGalleryPage />;
      case '/contact':
        return <PublicContactPage />;
      default:
        return <PublicHomePage />;
    }
  };

  return <PublicLayout>{renderPage()}</PublicLayout>;
}

export default App;
