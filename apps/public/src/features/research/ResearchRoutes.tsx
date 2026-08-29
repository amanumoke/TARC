import { Route, Routes } from 'react-router-dom';
import { ResearchDetailPage } from './ResearchDetailPage';
import { ResearchListPage } from './ResearchListPage';

export function ResearchRoutes() {
  return (
    <Routes>
      <Route index element={<ResearchListPage />} />
      <Route path=":slug" element={<ResearchDetailPage />} />
    </Routes>
  );
}
