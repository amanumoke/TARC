import { Route, Routes } from 'react-router-dom';
import { AboutOverviewPage } from './AboutOverviewPage';
import { DepartmentsPage } from './DepartmentsPage';
import { DirectorMessagePage } from './DirectorMessagePage';
import { PeoplePage } from './PeoplePage';
import { OrganizationalStructurePage } from './OrganizationalStructurePage';

export function AboutRoutes() {
  return (
    <Routes>
      <Route index element={<AboutOverviewPage />} />
      <Route path="director" element={<DirectorMessagePage />} />
      <Route path="departments" element={<DepartmentsPage />} />
      <Route path="people" element={<PeoplePage />} />
      <Route path="structure" element={<OrganizationalStructurePage />} />
    </Routes>
  );
}
