/**
 * @file apps/dashboard/src/App.tsx
 * @description Main application root for the TARCMS Management & Operations Dashboard.
 * Provides the authenticated management dashboard shell with routing.
 */

import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState } from 'react';

/**
 * Root Dashboard Application Component.
 * Shows login page when unauthenticated, dashboard when authenticated.
 */
export function App(): React.ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <DashboardLayout />;
}

export default App;
