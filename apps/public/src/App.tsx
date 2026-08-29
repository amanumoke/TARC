import { NotFoundPage } from '@/components/NotFoundPage';
import { PublicFooter } from '@/components/navigation/PublicFooter';
import { PublicHeader } from '@/components/navigation/PublicHeader';
import { AboutRoutes } from '@/features/about/AboutRoutes';
import { PublicContactPage } from '@/features/contact/PublicContactPage';
import { PublicEventsPage } from '@/features/events/PublicEventsPage';
import { PublicGalleryPage } from '@/features/gallery/PublicGalleryPage';
import { PublicHomePage } from '@/features/home/PublicHomePage';
import { NewsRoutes } from '@/features/news/NewsRoutes';
import { PublicPublicationsPage } from '@/features/publications/PublicPublicationsPage';
import { ProjectsPage } from '@/features/research/ProjectsPage';
import { ResearchRoutes } from '@/features/research/ResearchRoutes';
import { SearchPage } from '@/features/search/SearchPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
        <PublicHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<PublicHomePage />} />
            <Route path="/research/*" element={<ResearchRoutes />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/publications" element={<PublicPublicationsPage />} />
            <Route path="/news/*" element={<NewsRoutes />} />
            <Route path="/events" element={<PublicEventsPage />} />
            <Route path="/about/*" element={<AboutRoutes />} />
            <Route path="/gallery" element={<PublicGalleryPage />} />
            <Route path="/contact" element={<PublicContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <PublicFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
