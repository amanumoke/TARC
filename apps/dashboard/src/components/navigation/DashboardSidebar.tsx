import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  LogOut,
  MessageSquare,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface DashboardSidebarProps {
  user?: User;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const allNavigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'],
  },
  {
    name: 'Departments',
    href: '/dashboard/departments',
    icon: Building2,
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  { name: 'Staff', href: '/dashboard/staff', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
  {
    name: 'Research Programs',
    href: '/dashboard/research-programs',
    icon: FlaskConical,
    roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER'],
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: FolderOpen,
    roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER'],
  },
  {
    name: 'Publications',
    href: '/dashboard/publications',
    icon: BookOpen,
    roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER'],
  },
  { name: 'News', href: '/dashboard/news', icon: Newspaper, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Events', href: '/dashboard/events', icon: Calendar, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Gallery', href: '/dashboard/gallery', icon: Image, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Vehicles', href: '/dashboard/vehicles', icon: Car, roles: ['SUPER_ADMIN', 'ADMIN'] },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'],
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'],
  },
];

export function DashboardSidebar({ user, open, onClose, onLogout }: DashboardSidebarProps) {
  const userRole = user?.role || 'STAFF';
  const navigation = allNavigation.filter((item) => item.roles.includes(userRole));
  const filteredBottomNavigation = bottomNavigation.filter((item) => item.roles.includes(userRole));

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
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-lg">TARC Admin</span>
          </div>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )
                    }
                    end={item.href === '/dashboard'}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        <Separator />

        <div className="p-4">
          <ul className="space-y-1">
            {filteredBottomNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
