# TARCMS Admin Dashboard — Design System & Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing TARCMS admin dashboard from placeholder stubs into a production-ready, premium institutional management interface with consistent CRUD patterns, responsive design, and the TARC biophilic-professional design language.

**Architecture:** Enhance the existing React 19 + Vite + Tailwind + shadcn/ui monorepo. Preserve the existing `apps/dashboard` structure, React Router v6 routing, TanStack Query data fetching, and Express/MySQL backend. Update CSS design tokens, replace placeholder pages with real CRUD interfaces, and build reusable component patterns.

**Tech Stack:** React 19, Vite 5, TypeScript 5.6, Tailwind CSS 3.4, shadcn/ui (23 components installed), TanStack Query v5, React Router v6, Lucide icons, React Hook Form + Zod, Biome linter

**Spec:** `docs/frontend/stitch_modern_unique_responsive_design/` (complete design system + 52-section implementation prompt)

---

## Global Constraints

- **Framework:** React 19, React Router v6 — do NOT replace
- **UI Library:** shadcn/ui only — do NOT add Bootstrap, MUI, Ant Design, Chakra
- **Styling:** Tailwind CSS 3.4 with CSS variables — do NOT add styled-components, Emotion
- **State:** TanStack Query v5 for server state, React useState/useContext for client state
- **Forms:** React Hook Form + Zod resolvers (already installed)
- **Linting:** Biome (single quotes, semicolons, 2-space indent, 100-char line width)
- **Icons:** Lucide React only — do NOT add other icon libraries
- **Fonts:** Inter (update from Geist Variable) per spec requirement
- **Colors:** Use spec tokens: Background `#F7F7F3`, Surface `#FFFFFF`, Primary `#173B2B`, Accent `#B58B45`
- **Radius:** 6px (sm), 8px (md), 12px (lg), 14px (dialogs)
- **No overdesign:** No weather widgets, crypto analytics, decorative charts, fake AI assistants

---

## File Structure

### New Files to Create

```
apps/dashboard/src/
├── styles/
│   └── globals.css                          # UPDATE: New design tokens
├── components/
│   └── ui/                                  # EXISTING: 23 shadcn components
├── features/
│   ├── layout/
│   │   ├── AdminLayout.tsx                  # NEW: Main layout wrapper
│   │   ├── AdminSidebar.tsx                 # REWRITE: Enhanced sidebar
│   │   ├── AdminHeader.tsx                  # REWRITE: Enhanced header
│   │   └── SearchCommand.tsx                # NEW: Global search (Ctrl+K)
│   ├── dashboard/
│   │   ├── DashboardOverviewPage.tsx        # REWRITE: Full dashboard
│   │   ├── KPICard.tsx                      # NEW: Reusable KPI card
│   │   ├── ContentOverviewChart.tsx         # NEW: Content volume chart
│   │   ├── RecentActivityList.tsx           # NEW: Activity feed
│   │   ├── LatestProjectsTable.tsx          # NEW: Compact project table
│   │   └── UnreadMessagesList.tsx           # NEW: Message previews
│   ├── shared/
│   │   ├── DataTable.tsx                    # NEW: Reusable data table
│   │   ├── DataTableToolbar.tsx             # NEW: Search/filter toolbar
│   │   ├── DataTablePagination.tsx          # NEW: Pagination controls
│   │   ├── StatusBadge.tsx                  # NEW: Semantic status badges
│   │   ├── EmptyState.tsx                   # NEW: No-data placeholder
│   │   ├── ErrorState.tsx                   # NEW: Error display
│   │   ├── LoadingSkeleton.tsx              # NEW: Loading states
│   │   ├── PageHeader.tsx                   # NEW: Page title + action
│   │   ├── ConfirmDialog.tsx                # NEW: Delete confirmation
│   │   ├── FormSection.tsx                  # NEW: Form field groups
│   │   └── FileUpload.tsx                   # NEW: Image/file upload
│   ├── staff/
│   │   ├── AdminStaffPage.tsx               # REWRITE: Full CRUD
│   │   ├── StaffTable.tsx                   # NEW: Table component
│   │   ├── StaffForm.tsx                    # NEW: Add/Edit form
│   │   └── StaffFilters.tsx                 # NEW: Filter toolbar
│   ├── departments/
│   │   ├── AdminDepartmentsPage.tsx         # REWRITE: Full CRUD
│   │   ├── DepartmentTable.tsx              # NEW
│   │   └── DepartmentForm.tsx               # NEW
│   ├── research/
│   │   ├── AdminResearchProgramsPage.tsx    # NEW: Full CRUD
│   │   ├── ResearchProgramTable.tsx         # NEW
│   │   ├── ResearchProgramForm.tsx          # NEW
│   │   ├── AdminProjectsPage.tsx            # NEW: Full CRUD
│   │   ├── ProjectTable.tsx                 # NEW
│   │   ├── ProjectForm.tsx                  # NEW
│   │   └── ProjectDetailPage.tsx            # NEW: Detail view
│   ├── publications/
│   │   ├── AdminPublicationsPage.tsx        # REWRITE: Full CRUD
│   │   ├── PublicationTable.tsx             # NEW
│   │   └── PublicationForm.tsx              # NEW
│   ├── news/
│   │   ├── AdminNewsPage.tsx                # REWRITE: Full CRUD
│   │   ├── NewsTable.tsx                    # NEW
│   │   └── NewsForm.tsx                     # NEW
│   ├── events/
│   │   ├── AdminEventsPage.tsx              # REWRITE: Full CRUD
│   │   ├── EventTable.tsx                   # NEW
│   │   └── EventForm.tsx                    # NEW
│   ├── gallery/
│   │   ├── AdminGalleryPage.tsx             # REWRITE: Full CRUD
│   │   ├── GalleryGrid.tsx                  # NEW: Visual grid
│   │   └── GalleryUploadForm.tsx            # NEW: Upload form
│   ├── vehicles/
│   │   ├── AdminVehiclesPage.tsx            # REWRITE: Full CRUD
│   │   ├── VehicleTable.tsx                 # NEW
│   │   └── VehicleForm.tsx                  # NEW
│   ├── messages/
│   │   ├── AdminMessagesPage.tsx            # REWRITE: Inbox layout
│   │   ├── MessageList.tsx                  # NEW: Left panel
│   │   └── MessageDetail.tsx                # NEW: Right panel
│   ├── settings/
│   │   └── AdminSettingsPage.tsx            # REWRITE: Settings tabs
│   └── profile/
│       └── AdminProfilePage.tsx             # REWRITE: Profile page
├── hooks/
│   ├── useDebounce.ts                       # NEW: Search debounce
│   └── usePagination.ts                     # NEW: Table pagination
├── services/
│   └── api.ts                               # NEW: API client helper
├── types/
│   └── index.ts                             # NEW: Frontend type aliases
└── lib/
    └── utils.ts                             # EXISTING: cn() helper
```

### Files to Modify

- `apps/dashboard/src/styles/globals.css` — Update design tokens
- `apps/dashboard/src/App.tsx` — Wire real page components to routes
- `apps/dashboard/src/layouts/DashboardLayout.tsx` — Enhance layout
- `apps/dashboard/index.html` — Add Inter font import
- `apps/dashboard/tailwind.config.ts` — Add custom colors if needed

---

## Phase 1: Design System & Layout Foundation

### Task 1: Update CSS Design Tokens

**Files:**
- Modify: `apps/dashboard/src/styles/globals.css`

**Interfaces:**
- Consumes: Spec color palette from section 3
- Produces: Updated CSS variables used by all components

- [ ] **Step 1: Replace CSS variables with spec tokens**

Update `apps/dashboard/src/styles/globals.css` with the new design tokens. Replace the existing `:root` block:

```css
:root {
  /* Background: #F7F7F3 */
  --background: 60 10% 96%;
  --foreground: 155 20% 10%;

  /* Card/Popover/Surface: #FFFFFF */
  --card: 0 0% 100%;
  --card-foreground: 155 20% 10%;
  --popover: 0 0% 100%;
  --popover-foreground: 155 20% 10%;

  /* Primary: #173B2B (Deep Forest) */
  --primary: 152 48% 16%;
  --primary-foreground: 0 0% 100%;

  /* Secondary: #315B43 (Canopy) */
  --secondary: 152 36% 26%;
  --secondary-foreground: 0 0% 100%;

  /* Accent: #B58B45 (Gold) */
  --accent: 38 50% 49%;
  --accent-foreground: 0 0% 100%;

  /* Muted */
  --muted: 60 10% 94%;
  --muted-foreground: 155 10% 42%;

  /* Destructive: #C53B3B */
  --destructive: 0 65% 50%;
  --destructive-foreground: 0 0% 100%;

  /* Border: #E2E5E1 */
  --border: 100 12% 89%;
  --input: 100 12% 89%;
  --ring: 152 36% 26%;

  /* Radius */
  --radius: 0.5rem;

  /* Success: #258A4A */
  --success: 145 56% 40%;
  --success-foreground: 0 0% 100%;

  /* Warning: #C58A16 */
  --warning: 42 82% 43%;
  --warning-foreground: 0 0% 100%;

  /* Info: #2878B5 */
  --info: 207 60% 44%;
  --info-foreground: 0 0% 100%;

  /* Charts */
  --chart-1: 152 36% 26%;
  --chart-2: 38 50% 49%;
  --chart-3: 145 56% 40%;
  --chart-4: 152 48% 16%;
  --chart-5: 60 10% 90%;

  /* Sidebar */
  --sidebar: 152 48% 16%;
  --sidebar-foreground: 0 0% 100%;
  --sidebar-primary: 145 56% 40%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 152 36% 26%;
  --sidebar-accent-foreground: 0 0% 100%;
  --sidebar-border: 152 30% 22%;
  --sidebar-ring: 145 56% 40%;
}
```

- [ ] **Step 2: Update dark mode tokens**

Replace the `.dark` block with updated dark mode values:

```css
.dark {
  --background: 155 20% 8%;
  --foreground: 60 10% 95%;
  --card: 155 25% 12%;
  --card-foreground: 60 10% 95%;
  --popover: 155 25% 12%;
  --popover-foreground: 60 10% 95%;
  --primary: 152 36% 36%;
  --primary-foreground: 155 20% 8%;
  --secondary: 152 30% 18%;
  --secondary-foreground: 60 10% 95%;
  --muted: 155 20% 15%;
  --muted-foreground: 155 15% 55%;
  --accent: 38 40% 35%;
  --accent-foreground: 60 10% 95%;
  --destructive: 0 60% 50%;
  --destructive-foreground: 0 0% 100%;
  --border: 155 20% 20%;
  --input: 155 20% 20%;
  --ring: 152 36% 36%;
  --success: 145 50% 35%;
  --warning: 42 70% 38%;
  --info: 207 50% 40%;
  --sidebar: 155 25% 10%;
  --sidebar-foreground: 60 10% 95%;
  --sidebar-primary: 145 50% 40%;
  --sidebar-primary-foreground: 60 10% 95%;
  --sidebar-accent: 155 20% 15%;
  --sidebar-accent-foreground: 60 10% 95%;
  --sidebar-border: 155 20% 18%;
  --sidebar-ring: 145 50% 40%;
}
```

- [ ] **Step 3: Add semantic color utility classes**

Add after the dark mode block:

```css
@layer utilities {
  .text-success { color: hsl(var(--success)); }
  .bg-success { background-color: hsl(var(--success)); }
  .text-warning { color: hsl(var(--warning)); }
  .bg-warning { background-color: hsl(var(--warning)); }
  .text-info { color: hsl(var(--info)); }
  .bg-info { background-color: hsl(var(--info)); }
}
```

- [ ] **Step 4: Verify build compiles**

Run: `npm run build --workspace=apps/dashboard`
Expected: Build succeeds with new tokens

---

### Task 2: Add Inter Font

**Files:**
- Modify: `apps/dashboard/index.html`

**Interfaces:**
- Consumes: Spec typography requirement (Inter font)
- Produces: Inter font available via Google Fonts CDN

- [ ] **Step 1: Add Inter font link to index.html**

Add to `<head>` in `apps/dashboard/index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Update Tailwind font-family config**

In `apps/dashboard/tailwind.config.ts`, ensure `fontFamily.sans` includes Inter:

```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
},
```

- [ ] **Step 3: Verify font loads**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Inter font renders in browser

---

### Task 3: Update Tailwind Config with Custom Colors

**Files:**
- Modify: `apps/dashboard/tailwind.config.ts`

**Interfaces:**
- Consumes: Spec color palette
- Produces: Extended Tailwind color utilities

- [ ] **Step 1: Add custom colors to tailwind.config.ts**

Add to `theme.extend.colors`:

```typescript
colors: {
  // Existing shadcn tokens...
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  success: {
    DEFAULT: 'hsl(var(--success))',
    foreground: 'hsl(var(--success-foreground))',
  },
  warning: {
    DEFAULT: 'hsl(var(--warning))',
    foreground: 'hsl(var(--warning-foreground))',
  },
  info: {
    DEFAULT: 'hsl(var(--info))',
    foreground: 'hsl(var(--info-foreground))',
  },
  // Brand palette
  'deep-forest': '#173B2B',
  canopy: '#315B43',
  fern: '#52B788',
  earth: '#B58B45',
  cream: '#F7F7F3',
},
```

- [ ] **Step 2: Add custom border-radius tokens**

Update `borderRadius` in `theme.extend`:

```typescript
borderRadius: {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '0.875rem',   // 14px (dialogs)
},
```

- [ ] **Step 3: Verify Tailwind classes work**

Run: `npm run dev --workspace=apps/dashboard`
Expected: New color utilities compile without errors

---

### Task 4: Enhance Sidebar with Grouped Navigation

**Files:**
- Rewrite: `apps/dashboard/src/features/layout/AdminSidebar.tsx`
- Modify: `apps/dashboard/src/features/layout/AdminLayout.tsx`

**Interfaces:**
- Consumes: User object, sidebar open state
- Produces: Sidebar component with grouped navigation, collapse toggle, badge counts

- [ ] **Step 1: Create AdminSidebar with navigation groups**

Create `apps/dashboard/src/features/layout/AdminSidebar.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  BookOpen, Building2, Calendar, Car, ChevronLeft, ChevronRight,
  FlaskConical, FolderOpen, Image, LayoutDashboard, LogOut,
  MessageSquare, Newspaper, Settings, Sprout, UserCircle, Users,
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
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'] },
    ],
  },
  {
    label: 'CONTENT MANAGEMENT',
    items: [
      { name: 'Staff', href: '/dashboard/staff', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { name: 'Departments', href: '/dashboard/departments', icon: Building2, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { name: 'Research Programs', href: '/dashboard/research-programs', icon: Sprout, roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER'] },
      { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen, roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER'] },
      { name: 'Publications', href: '/dashboard/publications', icon: BookOpen, roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER'] },
      { name: 'News', href: '/dashboard/news', icon: Newspaper, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { name: 'Events', href: '/dashboard/events', icon: Calendar, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { name: 'Gallery', href: '/dashboard/gallery', icon: Image, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { name: 'Vehicles', href: '/dashboard/vehicles', icon: Car, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'], badge: 0 },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'] },
      { name: 'Profile', href: '/dashboard/profile', icon: UserCircle, roles: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'] },
    ],
  },
];

function SidebarContent({ user, collapsed, onLogout, onToggleCollapse, unreadCount }: {
  user: User;
  collapsed: boolean;
  onLogout: () => void;
  onToggleCollapse: () => void;
  unreadCount?: number;
}) {
  const userRole = user?.role || 'STAFF';

  return (
    <div className="flex h-full flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">TARCMS</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Tepi Agricultural Research Center</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        {navigationGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="px-3 py-2">
              {!collapsed && (
                <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge !== undefined && item.name === 'Messages' && unreadCount && unreadCount > 0 && (
                            <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </ScrollArea>

      <Separator />

      {/* Bottom actions */}
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

      {/* Collapse toggle */}
      <div className="hidden lg:flex border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-muted-foreground"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

export function AdminSidebar({ user, open, collapsed, onClose, onToggleCollapse, onLogout, unreadCount }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex inset-y-0 left-0 z-50 transition-all duration-200',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        <SidebarContent
          user={user}
          collapsed={collapsed}
          onLogout={onLogout}
          onToggleCollapse={onToggleCollapse}
          unreadCount={unreadCount}
        />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            user={user}
            collapsed={false}
            onLogout={onLogout}
            onToggleCollapse={() => {}}
            unreadCount={unreadCount}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
```

- [ ] **Step 2: Verify sidebar renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Sidebar shows with grouped navigation, collapse works

---

### Task 5: Enhance Header with Search and User Menu

**Files:**
- Rewrite: `apps/dashboard/src/features/layout/AdminHeader.tsx`

**Interfaces:**
- Consumes: User object, onMenuToggle callback
- Produces: Header with search trigger, notifications, user dropdown

- [ ] **Step 1: Create AdminHeader component**

Create `apps/dashboard/src/features/layout/AdminHeader.tsx`:

```tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AdminHeaderProps {
  user: User;
  onMenuToggle: () => void;
  onLogout: () => void;
  onSearchOpen: () => void;
  unreadCount?: number;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatRole(role: string): string {
  return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminHeader({ user, onMenuToggle, onLogout, onSearchOpen, unreadCount }: AdminHeaderProps) {
  const initials = getInitials(user.name);
  const displayRole = formatRole(user.role);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search trigger */}
        <Button
          variant="outline"
          className="hidden sm:flex h-9 w-64 items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground"
          onClick={onSearchOpen}
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">Ctrl</span>
            <span className="text-xs">K</span>
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount && unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 outline-none hover:bg-muted">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium leading-tight">{user.name}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">{displayRole}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify header renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Header shows search bar, notifications, user menu

---

### Task 6: Create AdminLayout Wrapper

**Files:**
- Rewrite: `apps/dashboard/src/features/layout/AdminLayout.tsx`

**Interfaces:**
- Consumes: User object, onLogout callback
- Produces: Layout shell with sidebar + header + main content area

- [ ] **Step 1: Create AdminLayout component**

Create `apps/dashboard/src/features/layout/AdminLayout.tsx`:

```tsx
import { Toaster } from '@/components/ui/toast';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AdminLayoutProps {
  user: User;
  onLogout: () => void;
}

export function AdminLayout({ user, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar
        user={user}
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={onLogout}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          user={user}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={onLogout}
          onSearchOpen={() => setSearchOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
```

- [ ] **Step 2: Update App.tsx to use AdminLayout**

Modify `apps/dashboard/src/App.tsx` — replace `DashboardLayout` import with `AdminLayout`:

```tsx
import { AdminLayout } from '@/features/layout/AdminLayout';
// Remove: import { DashboardLayout } from '@/layouts/DashboardLayout';
```

Update the Routes section:

```tsx
<Route element={<AdminLayout user={user} onLogout={onLogout} />}>
```

- [ ] **Step 3: Verify layout renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: New layout with enhanced sidebar and header renders correctly

---

## Phase 2: Dashboard Overview

### Task 7: Create Reusable KPICard Component

**Files:**
- Create: `apps/dashboard/src/features/dashboard/KPICard.tsx`

**Interfaces:**
- Consumes: Icon, label, value, optional trend, link
- Produces: Reusable KPI card component

- [ ] **Step 1: Create KPICard component**

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KPICardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  trend?: { value: number; isPositive: boolean };
  href?: string;
  iconBg?: string;
}

export function KPICard({ icon: Icon, label, value, trend, href, iconBg }: KPICardProps) {
  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className={cn(
                'mt-1 text-xs font-medium',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn('rounded-lg p-2', iconBg || 'bg-primary/10')}>
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        {href && (
          <Link
            to={href}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return content;
}
```

- [ ] **Step 2: Verify KPICard renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: KPICard component builds without errors

---

### Task 8: Create DashboardOverviewPage

**Files:**
- Rewrite: `apps/dashboard/src/features/dashboard/DashboardOverviewPage.tsx`
- Create: `apps/dashboard/src/features/dashboard/ContentOverviewChart.tsx`
- Create: `apps/dashboard/src/features/dashboard/RecentActivityList.tsx`
- Create: `apps/dashboard/src/features/dashboard/LatestProjectsTable.tsx`
- Create: `apps/dashboard/src/features/dashboard/UnreadMessagesList.tsx`

**Interfaces:**
- Consumes: Dashboard metrics API (`/api/v1/admin/dashboard/metrics`), React Query
- Produces: Complete dashboard with KPI cards, charts, activity, projects, messages

- [ ] **Step 1: Create KPICard component (Task 7)**

Already completed in Task 7.

- [ ] **Step 2: Create ContentOverviewChart**

Create `apps/dashboard/src/features/dashboard/ContentOverviewChart.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface ContentOverviewChartProps {
  data: ChartData[];
  title?: string;
}

export function ContentOverviewChart({ data, title = 'Content Overview' }: ContentOverviewChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-24 text-xs text-muted-foreground truncate">{item.label}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="w-8 text-xs font-medium text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create RecentActivityList**

Create `apps/dashboard/src/features/dashboard/RecentActivityList.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, FolderOpen, MessageSquare, Newspaper, UserPlus } from 'lucide-react';

interface Activity {
  id: string;
  type: 'project' | 'publication' | 'news' | 'event' | 'staff' | 'message';
  description: string;
  user: string;
  timestamp: string;
}

const activityIcons: Record<Activity['type'], React.ComponentType<{ className?: string }>> = {
  project: FolderOpen,
  publication: BookOpen,
  news: Newspaper,
  event: Calendar,
  staff: UserPlus,
  message: MessageSquare,
};

const activityColors: Record<Activity['type'], string> = {
  project: 'bg-primary/10 text-primary',
  publication: 'bg-info/10 text-info',
  news: 'bg-warning/10 text-warning',
  event: 'bg-success/10 text-success',
  staff: 'bg-accent/10 text-accent-foreground',
  message: 'bg-muted text-muted-foreground',
};

interface RecentActivityListProps {
  activities: Activity[];
  title?: string;
}

export function RecentActivityList({ activities, title = 'Recent Activity' }: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`rounded-lg p-1.5 ${activityColors[activity.type]}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    by {activity.user} · {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Create LatestProjectsTable**

Create `apps/dashboard/src/features/dashboard/LatestProjectsTable.tsx`:

```tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  programTitle: string;
  status: string;
  startDate: string | null;
}

const statusStyles: Record<string, string> = {
  ONGOING: 'bg-success/10 text-success border-success/20',
  COMPLETED: 'bg-muted text-muted-foreground border-border',
  PROPOSED: 'bg-info/10 text-info border-info/20',
  ON_HOLD: 'bg-warning/10 text-warning border-warning/20',
};

interface LatestProjectsTableProps {
  projects: Project[];
}

export function LatestProjectsTable({ projects }: LatestProjectsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Latest Projects</CardTitle>
        <Link to="/dashboard/projects" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{project.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{project.programTitle}</p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <Badge variant="outline" className={cn('text-[10px] font-medium', statusStyles[project.status] || '')}>
                  {project.status.replace(/_/g, ' ')}
                </Badge>
                {project.startDate && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 5: Create UnreadMessagesList**

Create `apps/dashboard/src/features/dashboard/UnreadMessagesList.tsx`:

```tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  senderName: string;
  subject: string;
  message: string;
  createdAt: string;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

interface UnreadMessagesListProps {
  messages: Message[];
}

export function UnreadMessagesList({ messages }: UnreadMessagesListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
        <Link to="/dashboard/messages" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.map((msg) => (
            <Link
              key={msg.id}
              to={`/dashboard/messages?id=${msg.id}`}
              className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(msg.senderName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">{msg.senderName}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground mt-0.5 truncate">{msg.subject}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{msg.message}</p>
              </div>
              <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 6: Rewrite DashboardOverviewPage**

Rewrite `apps/dashboard/src/features/dashboard/DashboardOverviewPage.tsx`:

```tsx
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Car, FolderOpen, MessageSquare, Users } from 'lucide-react';
import { KPICard } from './KPICard';
import { ContentOverviewChart } from './ContentOverviewChart';
import { LatestProjectsTable } from './LatestProjectsTable';
import { RecentActivityList } from './RecentActivityList';
import { UnreadMessagesList } from './UnreadMessagesList';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  totalPublications: number;
  totalStaff: number;
  availableVehicles: number;
  totalVehicles: number;
  unreadMessages: number;
}

async function fetchMetrics(): Promise<DashboardMetrics> {
  const response = await fetch('/api/v1/admin/dashboard/metrics', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await response.json();
  return data.data;
}

function KPICardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-12" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardOverviewPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchMetrics,
  });

  const kpiCards = metrics ? [
    { icon: Users, label: 'Staff', value: metrics.totalStaff, href: '/dashboard/staff' },
    { icon: FolderOpen, label: 'Projects', value: metrics.totalProjects, href: '/dashboard/projects' },
    { icon: BookOpen, label: 'Publications', value: metrics.totalPublications, href: '/dashboard/publications' },
    { icon: Car, label: 'Vehicles', value: `${metrics.availableVehicles} / ${metrics.totalVehicles}`, href: '/dashboard/vehicles' },
    { icon: MessageSquare, label: 'Messages', value: metrics.unreadMessages, href: '/dashboard/messages' },
  ] : [];

  const chartData = [
    { label: 'Projects', value: metrics?.totalProjects || 0, color: 'hsl(var(--chart-1))' },
    { label: 'Publications', value: metrics?.totalPublications || 0, color: 'hsl(var(--chart-2))' },
    { label: 'Staff', value: metrics?.totalStaff || 0, color: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of TARCMS content and activities.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <KPICardSkeleton key={i} />)
          : kpiCards.map((card) => (
              <KPICard key={card.label} {...card} />
            ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ContentOverviewChart data={chartData} />
        <RecentActivityList activities={[]} />
      </div>

      {/* Bottom two-column */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LatestProjectsTable projects={[]} />
        <UnreadMessagesList messages={[]} />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Wire DashboardOverviewPage to App.tsx route**

Update `apps/dashboard/src/App.tsx`:

```tsx
import { DashboardOverviewPage } from '@/features/dashboard/DashboardOverviewPage';

// In Routes, replace:
// <Route path="/dashboard" element={<Placeholder title="Overview" />} />
// With:
<Route path="/dashboard" element={<DashboardOverviewPage />} />
```

- [ ] **Step 8: Verify dashboard renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Dashboard shows KPI cards, charts, activity, projects, messages

---

## Phase 3: CRUD Foundation Components

### Task 9: Create PageHeader Component

**Files:**
- Create: `apps/dashboard/src/features/shared/PageHeader.tsx`

**Interfaces:**
- Consumes: Title, description, optional action button
- Produces: Consistent page header across all CRUD pages

- [ ] **Step 1: Create PageHeader**

```tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} className="shrink-0">
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {!action.icon && <Plus className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify PageHeader renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: PageHeader component builds without errors

---

### Task 10: Create StatusBadge Component

**Files:**
- Create: `apps/dashboard/src/features/shared/StatusBadge.tsx`

**Interfaces:**
- Consumes: Status string, optional variant
- Produces: Semantic color badge for statuses

- [ ] **Step 1: Create StatusBadge**

```tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const statusConfig: Record<string, { variant: BadgeVariant; className: string }> = {
  // Research
  ACTIVE: { variant: 'default', className: 'bg-success/10 text-success border-success/20 hover:bg-success/10' },
  PLANNED: { variant: 'outline', className: 'bg-info/10 text-info border-info/20 hover:bg-info/10' },
  ONGOING: { variant: 'default', className: 'bg-success/10 text-success border-success/20 hover:bg-success/10' },
  COMPLETED: { variant: 'secondary', className: 'bg-muted text-muted-foreground border-border hover:bg-muted' },
  SUSPENDED: { variant: 'outline', className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/10' },
  ON_HOLD: { variant: 'outline', className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/10' },
  PROPOSED: { variant: 'outline', className: 'bg-info/10 text-info border-info/20 hover:bg-info/10' },

  // Vehicles
  AVAILABLE: { variant: 'default', className: 'bg-success/10 text-success border-success/20 hover:bg-success/10' },
  IN_USE: { variant: 'default', className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/10' },
  UNDER_MAINTENANCE: { variant: 'outline', className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10' },
  DECOMMISSIONED: { variant: 'secondary', className: 'bg-muted text-muted-foreground border-border hover:bg-muted' },

  // Messages
  UNREAD: { variant: 'default', className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10' },
  READ: { variant: 'secondary', className: 'bg-muted text-muted-foreground border-border hover:bg-muted' },
  IN_PROGRESS: { variant: 'outline', className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/10' },
  REPLIED: { variant: 'default', className: 'bg-success/10 text-success border-success/20 hover:bg-success/10' },
  ARCHIVED: { variant: 'secondary', className: 'bg-muted text-muted-foreground border-border hover:bg-muted' },

  // Generic
  DRAFT: { variant: 'secondary', className: 'bg-muted text-muted-foreground border-border hover:bg-muted' },
  PUBLISHED: { variant: 'default', className: 'bg-success/10 text-success border-success/20 hover:bg-success/10' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { variant: 'secondary' as BadgeVariant, className: '' };

  return (
    <Badge variant={config.variant} className={cn('text-[10px] font-medium', config.className, className)}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
```

- [ ] **Step 2: Verify StatusBadge renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: StatusBadge component builds without errors

---

### Task 11: Create EmptyState, ErrorState, LoadingSkeleton

**Files:**
- Create: `apps/dashboard/src/features/shared/EmptyState.tsx`
- Create: `apps/dashboard/src/features/shared/ErrorState.tsx`
- Create: `apps/dashboard/src/features/shared/LoadingSkeleton.tsx`

**Interfaces:**
- Consumes: Various props for states
- Produces: Reusable state components

- [ ] **Step 1: Create EmptyState**

```tsx
import { Button } from '@/components/ui/button';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon = FileX, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ErrorState**

```tsx
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to load data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
          Try again
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create LoadingSkeleton**

```tsx
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify all shared components build**

Run: `npm run dev --workspace=apps/dashboard`
Expected: All shared components build without errors

---

### Task 12: Create ConfirmDialog

**Files:**
- Create: `apps/dashboard/src/features/shared/ConfirmDialog.tsx`

**Interfaces:**
- Consumes: Title, description, onConfirm, onCancel
- Produces: AlertDialog for destructive actions

- [ ] **Step 1: Create ConfirmDialog**

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 2: Verify ConfirmDialog builds**

Run: `npm run dev --workspace=apps/dashboard`
Expected: ConfirmDialog component builds without errors

---

### Task 13: Create DataTable Component

**Files:**
- Create: `apps/dashboard/src/features/shared/DataTable.tsx`
- Create: `apps/dashboard/src/features/shared/DataTablePagination.tsx`
- Create: `apps/dashboard/src/features/shared/DataTableToolbar.tsx`

**Interfaces:**
- Consumes: Columns definition, data array, loading state
- Produces: Reusable table with search, filter, pagination

- [ ] **Step 1: Create DataTablePagination**

```tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
}

export function DataTablePagination({ page, totalPages, onPageChange, total }: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-3">
      <p className="text-xs text-muted-foreground">
        {total !== undefined && `Showing ${total} result${total !== 1 ? 's' : ''}`}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="px-2 text-xs font-medium">
          {page} / {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DataTableToolbar**

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface Filter {
  label: string;
  value: string;
  options: { label: string; value: string }[];
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Filter[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  activeFilters,
  onFilterChange,
}: DataTableToolbarProps) {
  const hasActiveFilters = activeFilters && Object.values(activeFilters).some((v) => v !== '');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => onSearchChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {filters?.map((filter) => (
        <select
          key={filter.label}
          value={activeFilters?.[filter.label] || ''}
          onChange={(e) => onFilterChange?.(filter.label, e.target.value)}
          className="h-9 rounded-md border bg-transparent px-3 text-sm"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            filters?.forEach((f) => onFilterChange?.(f.label, ''));
          }}
          className="h-9"
        >
          <X className="mr-1 h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create DataTable**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingSkeleton';
import { DataTablePagination } from './DataTablePagination';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
  page,
  totalPages,
  total,
  onPageChange,
  keyExtractor,
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {page !== undefined && totalPages !== undefined && onPageChange && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify DataTable components build**

Run: `npm run dev --workspace=apps/dashboard`
Expected: DataTable, DataTableToolbar, DataTablePagination build without errors

---

## Phase 4: CRUD Feature Pages

### Task 14: Create useApiQuery and useApiMutation Hooks

**Files:**
- Create: `apps/dashboard/src/hooks/useApiQuery.ts`
- Create: `apps/dashboard/src/hooks/useApiMutation.ts`

**Interfaces:**
- Consumes: API endpoint, query key, options
- Produces: Reusable hooks for data fetching with auth

- [ ] **Step 1: Create useApiQuery**

```tsx
import { useQuery } from '@tanstack/react-query';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('tarcms_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface UseApiQueryOptions<T> {
  queryKey: string[];
  endpoint: string;
  enabled?: boolean;
  select?: (data: unknown) => T;
}

export function useApiQuery<T>({ queryKey, endpoint, enabled = true, select }: UseApiQueryOptions<T>) {
  return useQuery({
    queryKey,
    enabled,
    queryFn: async (): Promise<T> => {
      const response = await fetch(endpoint, { headers: getAuthHeaders() });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Request failed');
      }
      return select ? select(json.data) : (json.data as T);
    },
  });
}
```

- [ ] **Step 2: Create useApiMutation**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('tarcms_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

interface UseApiMutationOptions<TData, TVariables> {
  endpoint: string;
  method?: string;
  queryKeyToInvalidate?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export function useApiMutation<TData, TVariables = unknown>({
  endpoint,
  method = 'POST',
  queryKeyToInvalidate,
  onSuccess,
  onError,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const response = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(variables),
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Request failed');
      }
      return json.data as TData;
    },
    onSuccess: (data) => {
      if (queryKeyToInvalidate) {
        queryKeyToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      onSuccess?.(data);
    },
    onError,
  });
}
```

- [ ] **Step 3: Verify hooks build**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Hooks build without errors

---

### Task 15: Staff Management Page

**Files:**
- Rewrite: `apps/dashboard/src/features/staff/AdminStaffPage.tsx`
- Create: `apps/dashboard/src/features/staff/StaffForm.tsx`

**Interfaces:**
- Consumes: StaffDTO types, useApiQuery, useApiMutation
- Produces: Full CRUD page for staff management

- [ ] **Step 1: Create StaffForm component**

```tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const staffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  position: z.string().min(1, 'Position is required'),
  email: z.string().email('Invalid email'),
  departmentId: z.string().min(1, 'Department is required'),
  bio: z.string().optional(),
  areasOfExpertise: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<StaffFormData>;
  onSubmit: (data: StaffFormData) => void;
  loading?: boolean;
}

export function StaffForm({ open, onOpenChange, initialData, onSubmit, loading }: StaffFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: initialData,
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Input id="position" {...register('position')} />
            {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentId">Department *</Label>
            <Input id="departmentId" {...register('departmentId')} />
            {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" {...register('bio')} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="areasOfExpertise">Areas of Expertise (comma-separated)</Label>
            <Input id="areasOfExpertise" {...register('areasOfExpertise')} placeholder="e.g. Soil Science, Agronomy" />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Staff'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Rewrite AdminStaffPage**

```tsx
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DataTable, Column } from '@/features/shared/DataTable';
import { PageHeader } from '@/features/shared/PageHeader';
import { StatusBadge } from '@/features/shared/StatusBadge';
import { ConfirmDialog } from '@/features/shared/ConfirmDialog';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useApiMutation } from '@/hooks/useApiMutation';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { StaffForm } from './StaffForm';
import { StaffDTO } from '@tarcms/shared';

export function AdminStaffPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: staffData, isLoading } = useApiQuery<{ data: StaffDTO[]; meta?: { total: number; totalPages: number } }>({
    queryKey: ['admin-staff', page, search],
    endpoint: `/api/v1/admin/staff?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/admin/staff/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-staff'],
    onSuccess: () => setDeletingId(null),
  });

  const staff = staffData?.data || [];
  const meta = staffData?.meta;

  const columns: Column<StaffDTO>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => (
        <div>
          <p className="font-medium">{item.firstName} {item.lastName}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    { key: 'position', header: 'Position' },
    { key: 'departmentName', header: 'Department', render: (item) => item.departmentName || '-' },
    {
      key: 'areasOfExpertise',
      header: 'Expertise',
      render: (item) => item.areasOfExpertise?.slice(0, 2).join(', ') || '-',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => <StatusBadge status={item.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-[50px]',
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditingStaff(item); setShowForm(true); }}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeletingId(item.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Manage approved staff information."
        action={{ label: 'Add Staff', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-9 w-full max-w-sm rounded-md border bg-transparent px-3 text-sm"
          />
        </div>

        <DataTable
          columns={columns}
          data={staff}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No staff members found"
          emptyDescription="Try changing your filters or add a new staff member."
        />
      </div>

      <StaffForm
        open={showForm}
        onOpenChange={(open) => { setShowForm(open); if (!open) setEditingStaff(null); }}
        initialData={editingStaff ? {
          firstName: editingStaff.firstName,
          lastName: editingStaff.lastName,
          position: editingStaff.position,
          email: editingStaff.email,
          departmentId: editingStaff.departmentId,
          bio: editingStaff.bio || undefined,
          areasOfExpertise: editingStaff.areasOfExpertise?.join(', '),
        } : undefined}
        onSubmit={(data) => console.log('Submit:', data)}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => { if (!open) setDeletingId(null); }}
        title="Delete staff member?"
        description="This action cannot be undone. The staff member will be permanently removed."
        confirmLabel="Delete Staff"
        onConfirm={() => deleteMutation.mutate(deletingId!)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
```

- [ ] **Step 3: Wire StaffPage to App.tsx**

Update `apps/dashboard/src/App.tsx`:

```tsx
import { AdminStaffPage } from '@/features/staff/AdminStaffPage';

// Replace:
// <Route path="/dashboard/staff" element={<Placeholder title="Staff" />} />
// With:
<Route path="/dashboard/staff" element={<AdminStaffPage />} />
```

- [ ] **Step 4: Verify Staff page renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Staff page shows with table, search, add/edit form, delete confirmation

---

### Task 16: Departments Management Page

**Files:**
- Rewrite: `apps/dashboard/src/features/departments/AdminDepartmentsPage.tsx`

**Interfaces:**
- Consumes: DepartmentDTO types, existing patterns from Task 15
- Produces: Full CRUD page for departments

- [ ] **Step 1: Rewrite AdminDepartmentsPage following Staff pattern**

Follow the same pattern as Task 15 (Staff page) but for departments:
- Use `DepartmentDTO` from `@tarcms/shared`
- Endpoint: `/api/v1/admin/departments`
- Columns: Name, Code, Description, Established Year, Actions
- Form fields: Name, Code, Description, Established Year

- [ ] **Step 2: Wire DepartmentsPage to App.tsx**

Update `apps/dashboard/src/App.tsx`:

```tsx
import { AdminDepartmentsPage } from '@/features/departments/AdminDepartmentsPage';

// Replace:
// <Route path="/dashboard/departments" element={<Placeholder title="Departments" />} />
// With:
<Route path="/dashboard/departments" element={<AdminDepartmentsPage />} />
```

- [ ] **Step 3: Verify Departments page renders**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Departments page shows with table, search, add/edit, delete

---

### Task 17: Research Programs Management Page

**Files:**
- Create: `apps/dashboard/src/features/research/AdminResearchProgramsPage.tsx`
- Create: `apps/dashboard/src/features/research/ResearchProgramForm.tsx`

**Interfaces:**
- Consumes: ResearchProgramDTO from `@tarcms/shared`
- Produces: Full CRUD page for research programs

- [ ] **Step 1: Create ResearchProgramForm**

Follow the StaffForm pattern with fields:
- Title, Code, Description, Objectives, Department, Status

- [ ] **Step 2: Create AdminResearchProgramsPage**

Follow the Staff page pattern with columns:
- Title, Code, Department, Status, Projects Count, Actions

- [ ] **Step 3: Wire to App.tsx**

```tsx
import { AdminResearchProgramsPage } from '@/features/research/AdminResearchProgramsPage';

<Route path="/dashboard/research-programs" element={<AdminResearchProgramsPage />} />
```

- [ ] **Step 4: Verify Research Programs page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

### Task 18: Projects Management Page

**Files:**
- Create: `apps/dashboard/src/features/research/AdminProjectsPage.tsx`
- Create: `apps/dashboard/src/features/research/ProjectForm.tsx`
- Create: `apps/dashboard/src/features/research/ProjectDetailPage.tsx`

**Interfaces:**
- Consumes: ResearchProjectDTO from `@tarcms/shared`
- Produces: Full CRUD page + detail view for projects

- [ ] **Step 1: Create ProjectForm**

Fields: Title, Code, Summary, Research Program, Department, Start Date, End Date, Status, Funding Source, Budget

- [ ] **Step 2: Create AdminProjectsPage**

Columns: Title, Program, Status, Start Date, End Date, Actions

- [ ] **Step 3: Create ProjectDetailPage**

Layout: Title, Status Badge, Program, Dates, Team, Description, Related Publications, Actions

- [ ] **Step 4: Wire to App.tsx**

```tsx
import { AdminProjectsPage } from '@/features/research/AdminProjectsPage';
import { ProjectDetailPage } from '@/features/research/ProjectDetailPage';

<Route path="/dashboard/projects" element={<AdminProjectsPage />} />
<Route path="/dashboard/projects/:id" element={<ProjectDetailPage />} />
```

- [ ] **Step 5: Verify Projects page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

## Phase 5: Communication Feature Pages

### Task 19: Publications Management Page

**Files:**
- Create: `apps/dashboard/src/features/publications/AdminPublicationsPage.tsx`
- Create: `apps/dashboard/src/features/publications/PublicationForm.tsx`

**Interfaces:**
- Consumes: PublicationDTO from `@tarcms/shared`
- Produces: Full CRUD page for publications

- [ ] **Step 1: Create PublicationForm**

Fields: Title, Abstract, Type, Publisher/Journal, Year, DOI URL, Project, Peer Reviewed, Authors

- [ ] **Step 2: Create AdminPublicationsPage**

Columns: Title, Authors, Year, Type, Status, Actions

- [ ] **Step 3: Wire to App.tsx**

```tsx
import { AdminPublicationsPage } from '@/features/publications/AdminPublicationsPage';

<Route path="/dashboard/publications" element={<AdminPublicationsPage />} />
```

- [ ] **Step 4: Verify Publications page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

### Task 20: News Management Page

**Files:**
- Create: `apps/dashboard/src/features/news/AdminNewsPage.tsx`
- Create: `apps/dashboard/src/features/news/NewsForm.tsx`

**Interfaces:**
- Consumes: NewsDTO from `@tarcms/shared`
- Produces: Full CRUD page for news

- [ ] **Step 1: Create NewsForm**

Fields: Title, Summary, Content (textarea), Category, Cover Image, Published Date, Status

- [ ] **Step 2: Create AdminNewsPage**

Columns: Title, Author, Category, Published Date, Status, Actions

- [ ] **Step 3: Wire to App.tsx**

```tsx
import { AdminNewsPage } from '@/features/news/AdminNewsPage';

<Route path="/dashboard/news" element={<AdminNewsPage />} />
```

- [ ] **Step 4: Verify News page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

### Task 21: Events Management Page

**Files:**
- Create: `apps/dashboard/src/features/events/AdminEventsPage.tsx`
- Create: `apps/dashboard/src/features/events/EventForm.tsx`

**Interfaces:**
- Consumes: EventDTO from `@tarcms/shared`
- Produces: Full CRUD page for events

- [ ] **Step 1: Create EventForm**

Fields: Title, Description, Event Type, Location, Start Time, End Time, All Day, Banner Image, Status

- [ ] **Step 2: Create AdminEventsPage**

Columns: Title, Type, Location, Date, Status, Actions

- [ ] **Step 3: Wire to App.tsx**

```tsx
import { AdminEventsPage } from '@/features/events/AdminEventsPage';

<Route path="/dashboard/events" element={<AdminEventsPage />} />
```

- [ ] **Step 4: Verify Events page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

### Task 22: Gallery Management Page

**Files:**
- Create: `apps/dashboard/src/features/gallery/AdminGalleryPage.tsx`
- Create: `apps/dashboard/src/features/gallery/GalleryUploadForm.tsx`

**Interfaces:**
- Consumes: GalleryMediaDTO from `@tarcms/shared`
- Produces: Visual grid with upload, preview, delete

- [ ] **Step 1: Create GalleryUploadForm**

Fields: Title, Caption, Category, Image Upload

- [ ] **Step 2: Create AdminGalleryPage**

Layout: Visual grid of images with title, category, date, actions (preview, edit, delete)

- [ ] **Step 3: Wire to App.tsx**

```tsx
import { AdminGalleryPage } from '@/features/gallery/AdminGalleryPage';

<Route path="/dashboard/gallery" element={<AdminGalleryPage />} />
```

- [ ] **Step 4: Verify Gallery page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

## Phase 6: Operations & System Pages

### Task 23: Vehicles Management Page

**Files:**
- Create: `apps/dashboard/src/features/vehicles/AdminVehiclesPage.tsx`
- Create: `apps/dashboard/src/features/vehicles/VehicleForm.tsx`

**Interfaces:**
- Consumes: VehicleDTO from `@tarcms/shared`
- Produces: Full CRUD page for vehicles

- [ ] **Step 1: Create VehicleForm**

Fields: Registration Plate, Make, Model, Year, Type, Department, Driver, Fuel Type, Status, Notes

- [ ] **Step 2: Create AdminVehiclesPage**

Columns: Registration, Make/Model, Type, Department, Status, Actions

- [ ] **Step 3: Wire to App.tsx**

```tsx
import { AdminVehiclesPage } from '@/features/vehicles/AdminVehiclesPage';

<Route path="/dashboard/vehicles" element={<AdminVehiclesPage />} />
```

- [ ] **Step 4: Verify Vehicles page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

### Task 24: Messages Inbox Page

**Files:**
- Create: `apps/dashboard/src/features/messages/AdminMessagesPage.tsx`
- Create: `apps/dashboard/src/features/messages/MessageList.tsx`
- Create: `apps/dashboard/src/features/messages/MessageDetail.tsx`

**Interfaces:**
- Consumes: ContactMessageDTO from `@tarcms/shared`
- Produces: Inbox-style layout with list + detail

- [ ] **Step 1: Create MessageList**

Left panel with sender, subject, preview, date, unread indicator

- [ ] **Step 2: Create MessageDetail**

Right panel with sender info, full message, actions (mark read, archive, delete)

- [ ] **Step 3: Create AdminMessagesPage**

Layout: Two-panel inbox on desktop, list→detail navigation on mobile

- [ ] **Step 4: Wire to App.tsx**

```tsx
import { AdminMessagesPage } from '@/features/messages/AdminMessagesPage';

<Route path="/dashboard/messages" element={<AdminMessagesPage />} />
```

- [ ] **Step 5: Verify Messages page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

### Task 25: Settings Page

**Files:**
- Rewrite: `apps/dashboard/src/features/settings/AdminSettingsPage.tsx`

**Interfaces:**
- Consumes: SystemSettingsDTO from `@tarcms/shared`
- Produces: Tabbed settings page

- [ ] **Step 1: Rewrite AdminSettingsPage**

Tabs: Institution, Branding, Contact, Public Content, System Preferences
Form fields per tab based on SystemSettingsDTO

- [ ] **Step 2: Wire to App.tsx**

```tsx
import { AdminSettingsPage } from '@/features/settings/AdminSettingsPage';

<Route path="/dashboard/settings" element={<AdminSettingsPage />} />
```

- [ ] **Step 3: Verify Settings page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

### Task 26: Profile Page

**Files:**
- Create: `apps/dashboard/src/features/profile/AdminProfilePage.tsx`

**Interfaces:**
- Consumes: User data from auth context
- Produces: Profile display + edit form

- [ ] **Step 1: Create AdminProfilePage**

Display: Avatar, Name, Email, Role
Form: Edit name, email, change password

- [ ] **Step 2: Wire to App.tsx**

```tsx
import { AdminProfilePage } from '@/features/profile/AdminProfilePage';

<Route path="/dashboard/profile" element={<AdminProfilePage />} />
```

- [ ] **Step 3: Verify Profile page renders**

Run: `npm run dev --workspace=apps/dashboard`

---

## Phase 7: Global Search & Polish

### Task 27: Create SearchCommand (Ctrl+K)

**Files:**
- Create: `apps/dashboard/src/features/layout/SearchCommand.tsx`

**Interfaces:**
- Consumes: shadcn Command component
- Produces: Global search dialog

- [ ] **Step 1: Create SearchCommand**

```tsx
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { BookOpen, FolderOpen, Newspaper, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search staff, projects, publications..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Staff">
          <CommandItem onSelect={() => handleSelect('/dashboard/staff')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Staff Directory</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Research">
          <CommandItem onSelect={() => handleSelect('/dashboard/projects')}>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Research Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/dashboard/publications')}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Publications</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Communication">
          <CommandItem onSelect={() => handleSelect('/dashboard/news')}>
            <Newspaper className="mr-2 h-4 w-4" />
            <span>News</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

- [ ] **Step 2: Wire SearchCommand into AdminLayout**

Update `apps/dashboard/src/features/layout/AdminLayout.tsx` to include SearchCommand:

```tsx
import { SearchCommand } from './SearchCommand';

// Add state for search
const [searchOpen, setSearchOpen] = useState(false);

// Add before closing </div> in return:
<SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

// Pass setSearchOpen to AdminHeader:
<AdminHeader onSearchOpen={() => setSearchOpen(true)} ... />
```

- [ ] **Step 3: Verify SearchCommand works**

Run: `npm run dev --workspace=apps/dashboard`
Expected: Ctrl+K opens search dialog

---

### Task 28: Responsive Polish

**Files:**
- Review all pages for responsive behavior

**Interfaces:**
- Consumes: All existing pages
- Produces: Consistent responsive behavior

- [ ] **Step 1: Review KPI cards responsive grid**

Ensure KPI cards use `grid-cols-2 lg:grid-cols-5` on dashboard

- [ ] **Step 2: Review table responsive behavior**

Ensure tables use horizontal scroll on mobile:
```tsx
<div className="overflow-x-auto">
  <Table>...</Table>
</div>
```

- [ ] **Step 3: Review sidebar mobile behavior**

Ensure sidebar uses Sheet component on mobile

- [ ] **Step 4: Review forms responsive layout**

Ensure forms use `grid-cols-1 sm:grid-cols-2` for multi-column layouts

- [ ] **Step 5: Verify responsive behavior**

Run: `npm run dev --workspace=apps/dashboard`
Test at 375px, 768px, 1024px, 1440px widths

---

### Task 29: Accessibility Polish

**Files:**
- Review all components for accessibility

**Interfaces:**
- Consumes: All existing components
- Produces: Accessible interface

- [ ] **Step 1: Add aria-labels to icon buttons**

Ensure all icon-only buttons have `aria-label`:
```tsx
<Button variant="ghost" size="icon" aria-label="Edit staff">
  <Pencil className="h-4 w-4" />
</Button>
```

- [ ] **Step 2: Ensure all form inputs have labels**

Verify every `<Input>` has associated `<Label>`

- [ ] **Step 3: Add focus-visible styles**

Ensure all interactive elements have visible focus states

- [ ] **Step 4: Test keyboard navigation**

Tab through all interactive elements, verify logical order

---

### Task 30: Final Build Verification

**Files:**
- All modified files

**Interfaces:**
- Consumes: Complete codebase
- Produces: Production-ready build

- [ ] **Step 1: Run Biome linter**

Run: `npx biome check apps/dashboard/src/`
Expected: No errors (fix any reported issues)

- [ ] **Step 2: Run TypeScript type check**

Run: `npx tsc --noEmit --project apps/dashboard/tsconfig.json`
Expected: No type errors

- [ ] **Step 3: Run production build**

Run: `npm run build --workspace=apps/dashboard`
Expected: Build succeeds

- [ ] **Step 4: Run dev server and verify all pages**

Run: `npm run dev --workspace=apps/dashboard`
Test all routes manually

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-6 | Design system, sidebar, header, layout |
| 2 | 7-8 | Dashboard overview with KPIs, charts, activity |
| 3 | 9-13 | Reusable CRUD components |
| 4 | 14-18 | Staff, Departments, Research Programs, Projects |
| 5 | 19-22 | Publications, News, Events, Gallery |
| 6 | 23-26 | Vehicles, Messages, Settings, Profile |
| 7 | 27-30 | Search, responsive, accessibility, build |

**Total: 30 tasks across 7 phases**
