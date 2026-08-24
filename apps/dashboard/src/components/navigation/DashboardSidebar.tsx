import { cn } from '@/lib/utils';
import {
  BookOpen,
  Building2,
  Calendar,
  Car,
  FlaskConical,
  FolderOpen,
  Image,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react';

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
  { name: 'Staff', href: '/dashboard/staff', icon: Users },
  { name: 'Research Programs', href: '/dashboard/research-programs', icon: FlaskConical },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Publications', href: '/dashboard/publications', icon: BookOpen },
  { name: 'News', href: '/dashboard/news', icon: Newspaper },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Gallery', href: '/dashboard/gallery', icon: Image },
  { name: 'Vehicles', href: '/dashboard/vehicles', icon: Car },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-bold text-primary">TARC Admin</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
