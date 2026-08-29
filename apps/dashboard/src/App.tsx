import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardOverviewPage } from '@/features/dashboard/DashboardOverviewPage';
import { AdminDepartmentsPage } from '@/features/departments/AdminDepartmentsPage';
import { AdminEventsPage } from '@/features/events/AdminEventsPage';
import { AdminGalleryPage } from '@/features/gallery/AdminGalleryPage';
import { AdminLayout } from '@/features/layout/AdminLayout';
import { AdminMessagesPage } from '@/features/messages/AdminMessagesPage';
import { AdminNewsPage } from '@/features/news/AdminNewsPage';
import { AdminProfilePage } from '@/features/profile/AdminProfilePage';
import { AdminPublicationsPage } from '@/features/publications/AdminPublicationsPage';
import { AdminProjectsPage } from '@/features/research/AdminProjectsPage';
import { AdminResearchProgramsPage } from '@/features/research/AdminResearchProgramsPage';
import { ProjectDetailPage } from '@/features/research/ProjectDetailPage';
import { AdminSettingsPage } from '@/features/settings/AdminSettingsPage';
import { AdminStaffPage } from '@/features/staff/AdminStaffPage';
import { AdminVehiclesPage } from '@/features/vehicles/AdminVehiclesPage';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">This page is under development.</p>
    </div>
  );
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <Routes>
      <Route element={<AdminLayout user={user} onLogout={onLogout} />}>
        <Route path="/dashboard" element={<DashboardOverviewPage />} />
        <Route path="/dashboard/departments" element={<AdminDepartmentsPage />} />
        <Route path="/dashboard/staff" element={<AdminStaffPage />} />
        <Route path="/dashboard/research-programs" element={<AdminResearchProgramsPage />} />
        <Route path="/dashboard/projects" element={<AdminProjectsPage />} />
        <Route path="/dashboard/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/dashboard/publications" element={<AdminPublicationsPage />} />
        <Route path="/dashboard/news" element={<AdminNewsPage />} />
        <Route path="/dashboard/events" element={<AdminEventsPage />} />
        <Route path="/dashboard/gallery" element={<AdminGalleryPage />} />
        <Route path="/dashboard/vehicles" element={<AdminVehiclesPage />} />
        <Route path="/dashboard/messages" element={<AdminMessagesPage />} />
        <Route path="/dashboard/settings" element={<AdminSettingsPage />} />
        <Route path="/dashboard/profile" element={<AdminProfilePage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Placeholder title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}

export function App(): React.ReactElement {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tarcms_user');
    const token = localStorage.getItem('tarcms_token');
    if (saved && token) {
      try {
        return { ...JSON.parse(saved), token };
      } catch {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('tarcms_user', JSON.stringify(user));
      localStorage.setItem('tarcms_token', user.token);
    } else {
      localStorage.removeItem('tarcms_user');
      localStorage.removeItem('tarcms_token');
    }
  }, [user]);

  const handleLogin = (userData: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tarcms_user');
    localStorage.removeItem('tarcms_token');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
