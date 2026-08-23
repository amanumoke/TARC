/**
 * @file apps/dashboard/src/App.tsx
 * @description Main application root for the TARCMS Management & Operations Dashboard.
 * Provides the authenticated management dashboard shell, sidebar navigation,
 * overview KPI cards, and operational modules.
 */

import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Car,
  ExternalLink,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import React from 'react';

/**
 * Root Dashboard Application Component.
 */
export function App(): React.ReactElement {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* 1. Dashboard Collapsible Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base leading-none block">TARC Admin</span>
              <span className="text-xs text-muted-foreground mt-0.5 block">Management Portal</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <Button variant="secondary" className="w-full justify-start gap-3">
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <FlaskConical className="h-4 w-4" />
              <span>Research &amp; Trials</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <BookOpen className="h-4 w-4" />
              <span>Publications</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Users className="h-4 w-4" />
              <span>Staff &amp; Directory</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Car className="h-4 w-4" />
              <span>Fleet &amp; Vehicles</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Mail className="h-4 w-4" />
              <span>Messages</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-border space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
            <a href="http://localhost:3000" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span>Public Website</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* 2. Main Dashboard Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-border px-8 flex items-center justify-between bg-card">
          <div>
            <h1 className="text-xl font-bold">Operational Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Tepi Agricultural Research Center Operations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-sm font-semibold block">Admin User</span>
              <span className="text-xs text-primary font-medium block">SUPER_ADMIN</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
              AU
            </div>
          </div>
        </header>

        {/* Content Body & KPI Cards */}
        <main className="flex-1 p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Active Projects
              </span>
              <span className="text-3xl font-extrabold mt-2 block text-foreground">18</span>
              <span className="text-xs text-primary mt-1 block">Spices, Coffee &amp; Forestry</span>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Publications
              </span>
              <span className="text-3xl font-extrabold mt-2 block text-foreground">42</span>
              <span className="text-xs text-primary mt-1 block">
                Peer-reviewed papers &amp; manuals
              </span>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Available Fleet
              </span>
              <span className="text-3xl font-extrabold mt-2 block text-foreground">6 / 8</span>
              <span className="text-xs text-primary mt-1 block">Field vehicles ready</span>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Inquiry Inbox
              </span>
              <span className="text-3xl font-extrabold mt-2 block text-foreground">5</span>
              <span className="text-xs text-primary mt-1 block">Unread visitor messages</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
