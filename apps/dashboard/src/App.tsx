/**
 * @file apps/dashboard/src/App.tsx
 * @description Main application root for the TARCMS Management & Operations Dashboard.
 * Provides the authenticated management dashboard shell with routing.
 */

import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

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
      <p className="text-sm text-muted-foreground mt-2">This page is under development.</p>
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
      <Route element={<DashboardLayout user={user} onLogout={onLogout} />}>
        <Route path="/dashboard" element={<Placeholder title="Overview" />} />
        <Route path="/dashboard/departments" element={<Placeholder title="Departments" />} />
        <Route path="/dashboard/staff" element={<Placeholder title="Staff" />} />
        <Route
          path="/dashboard/research-programs"
          element={<Placeholder title="Research Programs" />}
        />
        <Route path="/dashboard/projects" element={<Placeholder title="Projects" />} />
        <Route path="/dashboard/publications" element={<Placeholder title="Publications" />} />
        <Route path="/dashboard/news" element={<Placeholder title="News" />} />
        <Route path="/dashboard/events" element={<Placeholder title="Events" />} />
        <Route path="/dashboard/gallery" element={<Placeholder title="Gallery" />} />
        <Route path="/dashboard/vehicles" element={<Placeholder title="Vehicles" />} />
        <Route path="/dashboard/messages" element={<Placeholder title="Messages" />} />
        <Route path="/dashboard/settings" element={<Placeholder title="Settings" />} />
        <Route path="*" element={<Placeholder title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}

/**
 * Root Dashboard Application Component.
 * Shows login page when unauthenticated, dashboard when authenticated.
 * Persists auth state in localStorage to survive page reloads.
 */
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
