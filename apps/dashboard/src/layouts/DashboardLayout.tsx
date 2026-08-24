import { DashboardHeader } from '@/components/navigation/DashboardHeader';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { Toaster } from '@/components/ui/toast';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          user={user}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
