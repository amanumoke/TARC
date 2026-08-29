import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Building2,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  FolderOpen,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  Settings,
  Sprout,
  UserCircle,
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

interface AdminSidebarProps {
  user: User;
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'],
      },
    ],
  },
  {
    label: 'CONTENT MANAGEMENT',
    items: [
      { name: 'Staff', href: '/dashboard/staff', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
      {
        name: 'Departments',
        href: '/dashboard/departments',
        icon: Building2,
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
      {
        name: 'Research Programs',
        href: '/dashboard/research-programs',
        icon: Sprout,
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
      {
        name: 'Events',
        href: '/dashboard/events',
        icon: Calendar,
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
      { name: 'Gallery', href: '/dashboard/gallery', icon: Image, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { name: 'Vehicles', href: '/dashboard/vehicles', icon: Car, roles: ['SUPER_ADMIN', 'ADMIN'] },
      {
        name: 'Messages',
        href: '/dashboard/messages',
        icon: MessageSquare,
        roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'],
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'],
      },
      {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: UserCircle,
        roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'],
      },
    ],
  },
];

function SidebarContent({
  user,
  collapsed,
  onLogout,
  onToggleCollapse,
}: {
  user: User;
  collapsed: boolean;
  onLogout: () => void;
  onToggleCollapse: () => void;
}) {
  const userRole = user?.role || 'STAFF';

  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-primary-foreground text-sm font-bold">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">TARCMS</span>
              <span className="text-muted-foreground leading-tight text-[10px]">
                Tepi Agricultural Research Center
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-primary-foreground text-sm font-bold">T</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-2">
        {navigationGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="px-3 py-2">
              {!collapsed && (
                <p className="text-muted-foreground mb-1 px-3 text-[11px] font-medium uppercase tracking-wider">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      end={item.href === '/dashboard'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          collapsed && 'justify-center px-2'
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="flex-1">{item.name}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </ScrollArea>

      <Separator />

      <div className="p-3">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-muted-foreground hover:text-destructive',
            collapsed && 'justify-center px-2'
          )}
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>

      <div className="hidden border-t p-3 lg:flex">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-full justify-center"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

export function AdminSidebar({
  user,
  open,
  collapsed,
  onClose,
  onToggleCollapse,
  onLogout,
}: AdminSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'inset-y-0 left-0 z-50 hidden lg:flex transition-all duration-200',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        <SidebarContent
          user={user}
          collapsed={collapsed}
          onLogout={onLogout}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>

      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            user={user}
            collapsed={false}
            onLogout={onLogout}
            onToggleCollapse={() => {}}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
