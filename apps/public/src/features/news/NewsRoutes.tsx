import { Route, Routes } from 'react-router-dom';
import { NewsDetailPage } from './NewsDetailPage';
import { NewsListPage } from './NewsListPage';

export function NewsRoutes() {
  return (
    <Routes>
      <Route index element={<NewsListPage />} />
      <Route path=":slug" element={<NewsDetailPage />} />
    </Routes>
  );
}
