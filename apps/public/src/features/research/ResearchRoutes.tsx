import { Route, Routes } from 'react-router-dom';
import { ResearchDetailPage } from './ResearchDetailPage';
import { ResearchPage } from './ResearchPage';

export function ResearchRoutes() {
  return (
    <Routes>
      <Route index element={<ResearchPage />} />
      <Route path=":slug" element={<ResearchDetailPage />} />
    </Routes>
  );
}
