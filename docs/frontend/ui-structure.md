# TARCMS Frontend & Information Architecture

> **Framework**: React 19 + Vite + Tailwind CSS + **shadcn UI** + Lucide Icons + Framer Motion  
> **Component System**: shadcn UI (Radix UI Primitives, `class-variance-authority`, `cn` helper)  
> **State & Cache**: TanStack Query v5  
> **Form Management**: React Hook Form + Zod Resolvers  
> **Workspace Distribution**: `apps/public` (Public Institutional Showcase / Portfolio) & `apps/dashboard` (Authenticated Management Dashboard)

---

## 1. Information Architecture & Navigation

```
                                  [ TARCMS MONOREPO ]
                                          |
                +-------------------------+-------------------------+
                |                                                   |
                v                                                   v
     [ apps/public (Port 3000) ]                        [ apps/dashboard (Port 3001) ]
   (Public Institutional Web Portal)                     (Guarded Operations Dashboard)
                |                                                   |
   +-- / (Home Showcase & Hero)                           +-- / (Overview KPI Metrics)
   +-- /about (Mandate, History & Team)                   +-- /departments (Department CRUD)
   +-- /director (Director's Message)                     +-- /staff (Staff Roster Management)
   +-- /departments (Research Departments)                +-- /research-programs (Programs Manager)
   +-- /research-programs (Programs Catalog)              +-- /projects (Trials & Projects CRUD)
   +-- /projects (Ongoing & Completed Trials)             +-- /publications (PDF Upload & Papers)
   +-- /publications (Scientific Catalog)                 +-- /news (Editorial News Composer)
   +-- /news (News & Farmer Advisories)                   +-- /events (Field Days & Workshops)
   +-- /events (Field Days & Workshops)                   +-- /gallery (Photo & Trial Albums)
   +-- /gallery (Photo & Field Albums)                    +-- /vehicles (Fleet Tracking & Logs)
   +-- /contact (Inquiries, Map & Form)                   +-- /messages (Inquiry Moderation Inbox)
                                                          +-- /settings (Center Configuration)
                                                          +-- /profile (User Profile & Password)
```

---

## 2. Layouts & Navigation Components

### 2.1 `PublicLayout` (`apps/public`)
- **Header**:
  - Center Seal / Logo, Institutional Title (*Tepi Agricultural Research Center*), Primary Nav Links (*About*, *Departments*, *Research*, *Publications*, *News & Events*, *Gallery*, *Contact*).
  - Quick Search Bar & Portal Login Link (`http://localhost:3001`).
  - Mobile Hamburger Menu with animated drawer (shadcn `Sheet` / `Dialog`).
- **Main Content**: Containerized viewport with smooth Framer Motion page transitions.
- **Footer**:
  - Institutional summary, quick links, research links, physical address in Tepi, contact phone/email, copyright notice.

### 2.2 `DashboardLayout` (`apps/dashboard`)
- **Sidebar**:
  - Collapsible desktop sidebar and slide-out mobile drawer.
  - Role-filtered navigation links (Users/Settings only rendered for `SUPER_ADMIN`).
  - Active route highlighting and badge counters (e.g., Unread messages count).
- **Top Header**:
  - Breadcrumbs navigation, global search, quick "Visit Public Site" link, notifications dropdown, and User Profile menu (Avatar, Role tag, Logout).
- **Page Container (`ModulePage`)**:
  - Consistent layout primitive providing: Title, Subtitle/Description, Action Buttons (e.g. `+ Add New Publication`), Filter Toolbar, and Status Banner.

---

## 3. shadcn UI Component System

Both `apps/public` and `apps/dashboard` implement standard **shadcn UI** primitives in `@/components/ui`:

| shadcn Component | Purpose | Key Implementation Details |
| :--- | :--- | :--- |
| `Button` (`ui/button.tsx`) | Standard Actions | Variants: `default` (emerald green), `outline`, `ghost`, `destructive`, `secondary`. Built on `@radix-ui/react-slot` with `cva`. |
| `Card` (`ui/card.tsx`) | Content Containers | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. |
| `Dialog` / `Sheet` (`ui/dialog.tsx`, `ui/sheet.tsx`) | Modals & Drawers | Accessible dialogs with smooth backdrop blur, focus trapping, and keyboard dismiss (`Esc`). |
| `DropdownMenu` (`ui/dropdown-menu.tsx`) | Action Menus | Profile menus, row actions (Edit, Delete, Download), export selectors. |
| `Input` & `Textarea` (`ui/input.tsx`, `ui/textarea.tsx`) | Form Controls | Integrated with `react-hook-form` and Tailwind focus rings. |
| `Select` (`ui/select.tsx`) | Dropdown Pickers | Custom styled dropdowns for departments, categories, statuses, and publication types. |
| `Table` (`ui/table.tsx`) | Data Grid Presentation | `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` with hover states. |
| `Tabs` (`ui/tabs.tsx`) | Content Switching | Tabbed filtering for research categories, fleet statuses, and inquiry inboxes. |
| `Avatar` (`ui/avatar.tsx`) | Profile Portraits | Staff and researcher portraits with automatic fallback initials. |
| `Badge` (`ui/badge.tsx`) | Status Indicators | Color-coded status pills (`AVAILABLE` = emerald, `IN_USE` = amber, `UNDER_MAINTENANCE` = rose). |
| `Skeleton` (`ui/skeleton.tsx`) | Loading Placeholders | Shimmering placeholders for async data fetching in public and admin views. |
| `cn` helper (`@/lib/utils.ts`) | Class Merging | Combines `clsx` and `tailwind-merge` for conflict-free dynamic styling. |
