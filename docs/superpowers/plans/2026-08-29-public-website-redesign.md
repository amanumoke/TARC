# Public Website Redesign — Implementation Plan

**Date:** 2026-08-29
**Branch:** `feat/tarcms-admin-dashboard-crud`
**Apps affected:** `apps/public`, `apps/server` (new public endpoint), `apps/dashboard` (minor route fix)
**Approach:** Hybrid (Approach C) — keep existing structure, rewrite all contents

---

## Global Constraints

- **Tailwind CSS only** — no inline styles, no CSS modules
- **shadcn/ui** component library (`@/components/ui/*`)
- **React Router v6** with `BrowserRouter` (clean URLs, no hash router)
- **TanStack Query v5** for all data fetching
- **Lucide React** for all icons
- **No new dependencies** beyond react-router-dom (already in package.json)
- **Images:** Placeholder boxes (dashed border + label) for now
- **Green header bar:** Phone + email + language selector (NO Portal Login)
- **All content** pulled from API endpoints (no hardcoded strings)

---

## File Structure

```
apps/public/src/
├── main.tsx                              # Entry point (QueryClientProvider + BrowserRouter)
├── App.tsx                               # Route definitions
├── styles/
│   └── globals.css                       # Design tokens, fonts, CSS variables
├── hooks/
│   ├── useSettings.ts                    # GET /api/v1/settings
│   ├── useNews.ts                        # GET /api/v1/news
│   ├── useNewsBySlug.ts                  # GET /api/v1/news/:slug
│   ├── useEvents.ts                      # GET /api/v1/events
│   ├── usePublications.ts                # GET /api/v1/publications
│   ├── useDepartments.ts                 # GET /api/v1/departments
│   ├── useStaff.ts                       # GET /api/v1/staff
│   ├── useProjects.ts                    # GET /api/v1/projects
│   └── useGallery.ts                     # GET /api/v1/gallery
├── components/
│   ├── navigation/
│   │   ├── PublicHeader.tsx              # Green top bar + white sticky nav
│   │   ├── PublicFooter.tsx              # Three-column footer
│   │   ├── MobileDrawer.tsx              # Mobile slide-out menu
│   │   └── LanguageSelector.tsx          # EN/Am toggle
│   ├── ui/                               # shadcn/ui components (existing)
│   ├── PlaceholderImage.tsx              # Reusable dashed-border placeholder
│   └── NotFoundPage.tsx                  # 404 page
├── features/
│   ├── home/
│   │   ├── PublicHomePage.tsx            # Homepage assembler
│   │   ├── HeroBanner.tsx               # Editorial split hero
│   │   ├── LatestNewsSection.tsx         # 3-column news cards
│   │   ├── UpcomingEventsSection.tsx     # Date sidebar + event cards
│   │   ├── FeaturedPublicationSection.tsx # Publication cards
│   │   ├── StatsSection.tsx             # Animated counters
│   │   └── QuickLinksSection.tsx         # Research/Departments/Contact links
│   ├── research/
│   │   ├── ResearchRoutes.tsx            # /research/* nested routes
│   │   ├── ResearchListPage.tsx          # Program cards grid
│   │   ├── ResearchDetailPage.tsx        # Program detail + projects
│   │   └── ProjectsPage.tsx             # Standalone /projects page
│   ├── publications/
│   │   └── PublicationsPage.tsx          # Publication list with filters
│   ├── news/
│   │   ├── NewsRoutes.tsx               # /news/* nested routes
│   │   ├── NewsListPage.tsx             # News cards with featured article
│   │   └── NewsDetailPage.tsx           # Full article view
│   ├── events/
│   │   └── EventsPage.tsx               # Events with date filtering
│   ├── about/
│   │   ├── AboutRoutes.tsx              # /about/* nested routes
│   │   ├── AboutOverviewPage.tsx         # Vision/mission/mandate
│   │   ├── DirectorMessagePage.tsx       # Director profile + message
│   │   ├── DepartmentsPage.tsx          # Department cards grid
│   │   └── PeoplePage.tsx               # Staff grid (public-safe fields only)
│   ├── gallery/
│   │   └── GalleryPage.tsx              # Masonry grid + lightbox
│   ├── contact/
│   │   └── ContactPage.tsx              # Contact form + info panel
│   └── search/
│       └── SearchPage.tsx               # Global search with category groups
```

---

## Phase 1: Foundation — Design Tokens, Router, Header, Footer, Server Endpoint, Hooks

### Task 1: Verify and Update Design Tokens

**Files:**
- Edit: `apps/public/src/styles/globals.css`

**Interfaces:**
- Consumes: Approved color palette, typography scale
- Produces: Working CSS variables for Tailwind

- [ ] **Step 1: Verify CSS variables**

Ensure the following variables exist and match the approved palette:

```css
:root {
  /* Primary — Institutional Green */
  --color-primary: #1B4332;
  --color-primary-light: #2D6A4F;
  --color-primary-lighter: #40916C;
  --color-primary-pale: #95D5B2;

  /* Accent — Warm Orange */
  --color-accent: #E76F51;

  /* Neutrals */
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E5E7EB;
  --color-text: #1F2937;
  --color-text-muted: #6B7280;
}
```

- [ ] **Step 2: Verify font declarations**

Ensure Inter (body) and Merriweather (headings) are imported:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap');
```

- [ ] **Step 3: Verify Tailwind config**

Ensure `tailwind.config.js` extends fontFamily with:

```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  heading: ['Merriweather', 'Georgia', 'serif'],
}
```

- [ ] **Step 4: Verify build**

Run: `npm run dev --workspace=apps/public`
Expected: No CSS errors, fonts load correctly

---

### Task 2: Convert Public App to React Router v6

**Files:**
- Edit: `apps/public/src/main.tsx`
- Rewrite: `apps/public/src/App.tsx`
- Delete: `apps/public/src/components/navigation/PublicRoutes.tsx`

**Interfaces:**
- Consumes: All page components
- Produces: Clean URL routing via BrowserRouter

- [ ] **Step 1: Install react-router-dom (if not present)**

Run: `npm install react-router-dom --workspace=apps/public`

- [ ] **Step 2: Rewrite main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

- [ ] **Step 3: Rewrite App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicHeader } from './components/navigation/PublicHeader';
import { PublicFooter } from './components/navigation/PublicFooter';
import { PublicHomePage } from './features/home/PublicHomePage';
import { ResearchRoutes } from './features/research/ResearchRoutes';
import { ProjectsPage } from './features/research/ProjectsPage';
import { PublicationsPage } from './features/publications/PublicationsPage';
import { NewsRoutes } from './features/news/NewsRoutes';
import { EventsPage } from './features/events/EventsPage';
import { AboutRoutes } from './features/about/AboutRoutes';
import { GalleryPage } from './features/gallery/GalleryPage';
import { ContactPage } from './features/contact/ContactPage';
import { SearchPage } from './features/search/SearchPage';
import { NotFoundPage } from './components/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <PublicHeader />
        <main>
          <Routes>
            <Route path="/" element={<PublicHomePage />} />
            <Route path="/research/*" element={<ResearchRoutes />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/news/*" element={<NewsRoutes />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about/*" element={<AboutRoutes />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <PublicFooter />
      </div>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Delete old PublicRoutes.tsx**

Remove the hash-based routing file.

- [ ] **Step 5: Verify routing works**

Run: `npm run dev --workspace=apps/public`
Expected: App loads, `/` shows homepage, no hash in URL

---

### Task 3: Rewrite PublicHeader Component

**Files:**
- Rewrite: `apps/public/src/components/navigation/PublicHeader.tsx`
- Create: `apps/public/src/components/navigation/MobileDrawer.tsx`
- Create: `apps/public/src/components/navigation/LanguageSelector.tsx`

**Interfaces:**
- Consumes: Navigation links, language state
- Produces: Green top bar + white sticky nav + mobile drawer

- [ ] **Step 1: Create LanguageSelector**

```tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function LanguageSelector() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-white/90 hover:text-white"
      >
        {lang === 'en' ? 'EN' : 'አመ'} <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-md bg-white py-1 shadow-lg">
          <button
            onClick={() => { setLang('en'); setOpen(false); }}
            className="block w-full px-4 py-1.5 text-left text-sm hover:bg-muted"
          >
            English
          </button>
          <button
            onClick={() => { setLang('am'); setOpen(false); }}
            className="block w-full px-4 py-1.5 text-left text-sm hover:bg-muted"
          >
            አማርኛ
          </button>
        </div>
      )}
    </div>
  );
```

- [ ] **Step 2: Create MobileDrawer**

```tsx
import { Link } from 'react-router-dom';
import { X, Phone, Mail } from 'lucide-react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: 'Research', path: '/research' },
  { label: 'Projects', path: '/projects' },
  { label: 'Publications', path: '/publications' },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-heading text-lg font-bold text-primary">Menu</span>
          <button onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t px-4 py-4">
          <a href="tel:+251475560000" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" /> +251 47 556 0000
          </a>
          <a href="mailto:info@tarc.gov.et" className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" /> info@tarc.gov.et
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite PublicHeader**

```tsx
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { MobileDrawer } from './MobileDrawer';
import { LanguageSelector } from './LanguageSelector';

const navLinks = [
  { label: 'Research', path: '/research' },
  { label: 'Projects', path: '/projects' },
  { label: 'Publications', path: '/publications' },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export function PublicHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40">
      {/* Green top bar */}
      <div className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 text-sm">
            <a href="tel:+251475560000" className="flex items-center gap-1.5 hover:text-white/80">
              <Phone className="h-3.5 w-3.5" /> +251 47 556 0000
            </a>
            <a href="mailto:info@tarc.gov.et" className="hidden items-center gap-1.5 hover:text-white/80 sm:flex">
              <Mail className="h-3.5 w-3.5" /> info@tarc.gov.et
            </a>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* White nav bar */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-white">
              T
            </div>
            <span className="font-heading text-xl font-bold text-primary">TARC</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              className="ml-2 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="rounded-md p-2 text-foreground hover:bg-muted lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
```

- [ ] **Step 4: Verify header renders**

Run: `npm run dev --workspace=apps/public`
Expected: Green bar shows phone + email + language selector (no Portal Login). White nav shows logo + links. Mobile shows hamburger.

---

### Task 4: Rewrite PublicFooter Component

**Files:**
- Rewrite: `apps/public/src/components/navigation/PublicFooter.tsx`

**Interfaces:**
- Consumes: Settings data (optional), navigation links
- Produces: Three-column footer with bottom bar

- [ ] **Step 1: Rewrite PublicFooter**

```tsx
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'Research Programs', path: '/research' },
  { label: 'Projects', path: '/projects' },
  { label: 'Publications', path: '/publications' },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function PublicFooter() {
  return (
    <footer className="border-t bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 font-heading text-sm font-bold">
                T
              </div>
              <span className="font-heading text-lg font-bold">TARC</span>
            </div>
            <p className="mt-3 text-sm text-white/70">
              Tepi Agricultural Research Center — Advancing agricultural research and innovation for sustainable development.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">
              Contact Us
            </h3>
            <div className="mt-3 space-y-2">
              <a href="tel:+251475560000" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
                <Phone className="h-4 w-4" /> +251 47 556 0000
              </a>
              <a href="mailto:info@tarc.gov.et" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
                <Mail className="h-4 w-4" /> info@tarc.gov.et
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Tepi, South West Ethiopia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Tepi Agricultural Research Center. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/50 hover:text-white/70" aria-label="Facebook">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="text-white/50 hover:text-white/70" aria-label="Twitter">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify footer renders**

Run: `npm run dev --workspace=apps/public`
Expected: Three-column footer on desktop, single column on mobile. All links navigate correctly.

---

### Task 5: Add Server Endpoint for Public Settings

**Files:**
- Edit: `apps/server/src/modules/settings/settings.routes.ts`
- Edit: `apps/server/src/modules/settings/settings.controller.ts`

**Interfaces:**
- Consumes: `system_settings` database table
- Produces: `GET /api/v1/settings` (no auth required)

- [ ] **Step 1: Add public GET endpoint to settings routes**

```ts
// In settings.routes.ts — add BEFORE the authenticated routes:
router.get('/settings', settingsController.getPublicSettings);
```

- [ ] **Step 2: Add getPublicSettings controller method**

```ts
static async getPublicSettings(req: Request, res: Response) {
  try {
    const settings = await db.select().from(systemSettings).limit(1).first();

    if (!settings) {
      return res.json({
        success: true,
        data: {
          directorName: '',
          directorMessage: '',
          directorPhoto: '',
          phone: '+251 47 556 0000',
          email: 'info@tarc.gov.et',
          address: 'Tepi, South West Ethiopia',
          aboutText: '',
          vision: '',
          mission: '',
        },
      });
    }

    // Return only public-safe fields
    const publicSettings = {
      directorName: settings.directorName || '',
      directorMessage: settings.directorMessage || '',
      directorPhoto: settings.directorPhoto || '',
      phone: settings.phone || '+251 47 556 0000',
      email: settings.email || 'info@tarc.gov.et',
      address: settings.address || 'Tepi, South West Ethiopia',
      aboutText: settings.aboutText || '',
      vision: settings.vision || '',
      mission: settings.mission || '',
    };

    res.json({ success: true, data: publicSettings });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch settings' } });
  }
}
```

- [ ] **Step 3: Verify endpoint works**

Run: `curl http://localhost:3001/api/v1/settings`
Expected: Returns JSON with `success: true` and public settings data

---

### Task 6: Create TanStack Query Hooks

**Files:**
- Create: `apps/public/src/hooks/useSettings.ts`
- Create: `apps/public/src/hooks/useNews.ts`
- Create: `apps/public/src/hooks/useNewsBySlug.ts`
- Create: `apps/public/src/hooks/useEvents.ts`
- Create: `apps/public/src/hooks/usePublications.ts`
- Create: `apps/public/src/hooks/useDepartments.ts`
- Create: `apps/public/src/hooks/useStaff.ts`
- Create: `apps/public/src/hooks/useProjects.ts`
- Create: `apps/public/src/hooks/useGallery.ts`

**Interfaces:**
- Consumes: API endpoints
- Produces: `{ data, isLoading, error }` for each resource

- [ ] **Step 1: Create useSettings**

```ts
import { useQuery } from '@tanstack/react-query';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/v1/settings');
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch settings');
      return json.data;
    },
  });
}
```

- [ ] **Step 2: Create useNews**

```ts
import { useQuery } from '@tanstack/react-query';

export function useNews(params?: { limit?: number; category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.category) searchParams.set('category', params.category);

  return useQuery({
    queryKey: ['news', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/news?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch news');
      return json.data;
    },
  });
}
```

- [ ] **Step 3: Create useNewsBySlug**

```ts
import { useQuery } from '@tanstack/react-query';

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ['news', slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await fetch(`/api/v1/news/${slug}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch article');
      return json.data;
    },
  });
}
```

- [ ] **Step 4: Create useEvents**

```ts
import { useQuery } from '@tanstack/react-query';

export function useEvents(params?: { limit?: number; upcoming?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.upcoming) searchParams.set('upcoming', 'true');

  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/events?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch events');
      return json.data;
    },
  });
}
```

- [ ] **Step 5: Create usePublications**

```ts
import { useQuery } from '@tanstack/react-query';

export function usePublications(params?: { year?: string; type?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.set('year', params.year);
  if (params?.type) searchParams.set('type', params.type);

  return useQuery({
    queryKey: ['publications', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/publications?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch publications');
      return json.data;
    },
  });
}
```

- [ ] **Step 6: Create useDepartments**

```ts
import { useQuery } from '@tanstack/react-query';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await fetch('/api/v1/departments');
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch departments');
      return json.data;
    },
  });
}
```

- [ ] **Step 7: Create useStaff**

```ts
import { useQuery } from '@tanstack/react-query';

export function useStaff(params?: { departmentId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.departmentId) searchParams.set('departmentId', params.departmentId);

  return useQuery({
    queryKey: ['staff', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/staff?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch staff');
      return json.data;
    },
  });
}
```

- [ ] **Step 8: Create useProjects**

```ts
import { useQuery } from '@tanstack/react-query';

export function useProjects(params?: { programId?: string; status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.programId) searchParams.set('programId', params.programId);
  if (params?.status) searchParams.set('status', params.status);

  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/projects?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch projects');
      return json.data;
    },
  });
}
```

- [ ] **Step 9: Create useGallery**

```ts
import { useQuery } from '@tanstack/react-query';

export function useGallery(params?: { category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);

  return useQuery({
    queryKey: ['gallery', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/gallery?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch gallery');
      return json.data;
    },
  });
}
```

- [ ] **Step 10: Create PlaceholderImage component**

```tsx
interface PlaceholderImageProps {
  label?: string;
  className?: string;
  aspectRatio?: 'video' | 'square';
}

export function PlaceholderImage({
  label = 'Image',
  className = '',
  aspectRatio = 'video',
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 ${
        aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'
      } ${className}`}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
```

- [ ] **Step 11: Verify all hooks compile**

Run: `npm run dev --workspace=apps/public`
Expected: No TypeScript errors

---

## Phase 2: Homepage

### Task 7: Rewrite HeroBanner

**Files:**
- Rewrite: `apps/public/src/features/home/HeroBanner.tsx`

**Interfaces:**
- Consumes: useSettings hook
- Produces: Editorial split hero with CTA

- [ ] **Step 1: Rewrite HeroBanner**

```tsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function HeroBanner() {
  const { data: settings } = useSettings();

  return (
    <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left: Text */}
          <div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {settings?.aboutText
                ? settings.aboutText.slice(0, 100) + '...'
                : 'Advancing Agricultural Research for Sustainable Development'}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {settings?.mission ||
                'The Tepi Agricultural Research Center conducts research to improve agricultural productivity and livelihoods in South West Ethiopia.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/research"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
              >
                Explore Our Research <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Right: Image placeholder */}
          <div className="hidden md:block">
            <PlaceholderImage label="TARC Research Facility" className="rounded-xl shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify hero renders**

Run: `npm run dev --workspace=apps/public`
Expected: Hero shows with title, description, CTA buttons, and placeholder image

---

### Task 8: Rewrite LatestNewsSection

**Files:**
- Rewrite: `apps/public/src/features/home/LatestNewsSection.tsx`

**Interfaces:**
- Consumes: useNews hook
- Produces: 3-column news card grid

- [ ] **Step 1: Rewrite LatestNewsSection**

```tsx
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function LatestNewsSection() {
  const { data: news, isLoading } = useNews({ limit: 3 });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Latest News</h2>
            <p className="mt-2 text-muted-foreground">Stay updated with TARC activities</p>
          </div>
          <Link
            to="/news"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
          >
            View All News <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border bg-card p-4">
                <div className="aspect-video rounded bg-muted" />
                <div className="mt-4 h-4 w-1/4 rounded bg-muted" />
                <div className="mt-2 h-5 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news?.map((article: any) => (
              <Link
                key={article.id}
                to={`/news/${article.slug}`}
                className="group rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <PlaceholderImage label="News Image" className="rounded-md" />
                <div className="mt-4">
                  {article.category && (
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {article.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {article.summary || article.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All News <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify news section renders**

Run: `npm run dev --workspace=apps/public`
Expected: 3 news cards load, clicking navigates to `/news/:slug`

---

### Task 9: Rewrite UpcomingEventsSection

**Files:**
- Rewrite: `apps/public/src/features/home/UpcomingEventsSection.tsx`

**Interfaces:**
- Consumes: useEvents hook
- Produces: Date sidebar + event cards

- [ ] **Step 1: Rewrite UpcomingEventsSection**

```tsx
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';

export function UpcomingEventsSection() {
  const { data: events, isLoading } = useEvents({ limit: 5, upcoming: true });

  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Upcoming Events</h2>
            <p className="mt-2 text-muted-foreground">Workshops, conferences, and field activities</p>
          </div>
          <Link
            to="/events"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
          >
            View All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 rounded-lg border bg-card p-4">
                <div className="h-16 w-16 rounded bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {events?.map((event: any) => {
              const date = new Date(event.startTime || event.startDate);
              return (
                <div
                  key={event.id}
                  className="flex gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  {/* Date badge */}
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
                    <span className="text-xl font-bold leading-none">{date.getDate()}</span>
                    <span className="text-xs uppercase">{date.toLocaleString('en-US', { month: 'short' })}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground">{event.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {event.location}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify events section renders**

Run: `npm run dev --workspace=apps/public`
Expected: Event cards with date badges display correctly

---

### Task 10: Rewrite FeaturedPublicationSection

**Files:**
- Rewrite: `apps/public/src/features/home/FeaturedPublicationSection.tsx`

**Interfaces:**
- Consumes: usePublications hook
- Produces: Publication cards with abstract preview

- [ ] **Step 1: Rewrite FeaturedPublicationSection**

```tsx
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { usePublications } from '@/hooks/usePublications';

export function FeaturedPublicationSection() {
  const { data: publications, isLoading } = usePublications();

  const featured = publications?.slice(0, 3) || [];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Featured Publications</h2>
            <p className="mt-2 text-muted-foreground">Research outputs from TARC</p>
          </div>
          <Link
            to="/publications"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border bg-card p-4">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="mt-2 h-5 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pub: any) => (
              <div key={pub.id} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {pub.type || 'Publication'}
                  </span>
                </div>
                <h3 className="mt-2 font-heading text-lg font-semibold text-foreground line-clamp-2">
                  {pub.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pub.authors?.join(', ') || 'Unknown authors'}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {pub.abstract || 'No abstract available.'}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {pub.year && `${pub.year}`}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/publications"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All Publications <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify publications section renders**

Run: `npm run dev --workspace=apps/public`
Expected: 3 publication cards display with title, authors, abstract

---

### Task 11: Rewrite StatsSection

**Files:**
- Rewrite: `apps/public/src/features/home/StatsSection.tsx`

**Interfaces:**
- Consumes: Intersection Observer + requestAnimationFrame
- Produces: Animated counter section

- [ ] **Step 1: Create useCountUp hook**

```ts
import { useEffect, useState, useRef } from 'react';

export function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}
```

- [ ] **Step 2: Rewrite StatsSection**

```tsx
import { useCountUp } from './useCountUp';

const stats = [
  { label: 'Research Projects', value: 45, suffix: '+' },
  { label: 'Staff Members', value: 30, suffix: '+' },
  { label: 'Publications', value: 120, suffix: '+' },
  { label: 'Years of Service', value: 25, suffix: '+' },
];

function StatItem({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl font-bold text-primary">
        {count}{suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify counters animate**

Run: `npm run dev --workspace=apps/public`
Expected: Counters animate from 0 when scrolled into view

---

### Task 12: Rewrite PublicHomePage

**Files:**
- Rewrite: `apps/public/src/features/home/PublicHomePage.tsx`

**Interfaces:**
- Consumes: All homepage section components
- Produces: Assembled homepage

- [ ] **Step 1: Rewrite PublicHomePage**

```tsx
import { useEffect } from 'react';
import { HeroBanner } from './HeroBanner';
import { LatestNewsSection } from './LatestNewsSection';
import { UpcomingEventsSection } from './UpcomingEventsSection';
import { FeaturedPublicationSection } from './FeaturedPublicationSection';
import { StatsSection } from './StatsSection';
import { QuickLinksSection } from './QuickLinksSection';

export function PublicHomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HeroBanner />
      <StatsSection />
      <LatestNewsSection />
      <UpcomingEventsSection />
      <FeaturedPublicationSection />
      <QuickLinksSection />
    </>
  );
}
```

- [ ] **Step 2: Create QuickLinksSection**

```tsx
import { Link } from 'react-router-dom';
import { BookOpen, Users, Mail } from 'lucide-react';

const links = [
  {
    icon: BookOpen,
    title: 'Research Programs',
    description: 'Explore our research areas and ongoing projects.',
    path: '/research',
  },
  {
    icon: Users,
    title: 'Our Team',
    description: 'Meet the researchers and staff behind our work.',
    path: '/about/people',
  },
  {
    icon: Mail,
    title: 'Get in Touch',
    description: 'Have questions? We would love to hear from you.',
    path: '/contact',
  },
];

export function QuickLinksSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-foreground">
          How Can We Help?
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <link.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{link.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify full homepage**

Run: `npm run dev --workspace=apps/public`
Expected: All sections render in order: hero, stats, news, events, publications, quick links

---

## Phase 3: Research Pages

### Task 13: Create ResearchRoutes Component

**Files:**
- Create: `apps/public/src/features/research/ResearchRoutes.tsx`

**Interfaces:**
- Consumes: React Router nested routes
- Produces: `/research` and `/research/:slug` routes

- [ ] **Step 1: Create ResearchRoutes**

```tsx
import { Routes, Route } from 'react-router-dom';
import { ResearchListPage } from './ResearchListPage';
import { ResearchDetailPage } from './ResearchDetailPage';

export function ResearchRoutes() {
  return (
    <Routes>
      <Route index element={<ResearchListPage />} />
      <Route path=":slug" element={<ResearchDetailPage />} />
    </Routes>
  );
}
```

- [ ] **Step 2: Verify route nesting works**

Run: `npm run dev --workspace=apps/public`
Expected: `/research` shows list, `/research/some-slug` shows detail

---

### Task 14: Create ResearchListPage

**Files:**
- Create: `apps/public/src/features/research/ResearchListPage.tsx`

**Interfaces:**
- Consumes: useDepartments hook
- Produces: Card grid of research programs

- [ ] **Step 1: Create ResearchListPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';

export function ResearchListPage() {
  const { data: departments, isLoading } = useDepartments();
  const [search, setSearch] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = departments?.filter((d: any) =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Research Programs</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Research Programs</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Explore the research areas and programs at Tepi Agricultural Research Center.
      </p>

      {/* Search */}
      <div className="relative mt-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card p-6">
              <div className="h-5 w-2/3 rounded bg-muted" />
              <div className="mt-3 h-3 w-full rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dept: any) => (
            <Link
              key={dept.id}
              to={`/research/${dept.slug || dept.id}`}
              className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary">
                {dept.name}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {dept.description || 'No description available.'}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Learn More <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No research programs found.</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify research list renders**

Run: `npm run dev --workspace=apps/public`
Expected: Department cards display, search filters, clicking navigates to detail

---

### Task 15: Create ResearchDetailPage

**Files:**
- Create: `apps/public/src/features/research/ResearchDetailPage.tsx`

**Interfaces:**
- Consumes: URL params, useDepartments hook, useProjects hook
- Produces: Program detail with related projects

- [ ] **Step 1: Create ResearchDetailPage**

```tsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { useProjects } from '@/hooks/useProjects';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function ResearchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: departments } = useDepartments();
  const { data: projects } = useProjects();

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const department = departments?.find(
    (d: any) => (d.slug || d.id) === slug
  );

  const relatedProjects = projects?.filter(
    (p: any) => p.departmentId === department?.id
  ) || [];

  if (!department) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Research program not found.</p>
        <Link to="/research" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Research
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/research" className="hover:text-primary">Research</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{department.name}</span>
      </nav>

      {/* Header */}
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="font-heading text-4xl font-bold text-foreground">{department.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {department.description || 'No description available.'}
          </p>

          {department.objectives && (
            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold text-foreground">Objectives</h2>
              <p className="mt-2 text-muted-foreground">{department.objectives}</p>
            </div>
          )}
        </div>
        <div>
          <PlaceholderImage label="Department Photo" className="rounded-xl" />
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-2xl font-bold text-foreground">Related Projects</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((project: any) => (
              <div key={project.id} className="rounded-lg border bg-card p-4">
                <h3 className="font-heading font-semibold text-foreground">{project.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.summary || project.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {project.status || 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-12">
        <Link
          to="/research"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Research Programs
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify detail page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Department detail shows with related projects, breadcrumbs work

---

### Task 15.5: Create Standalone ProjectsPage

**Files:**
- Create: `apps/public/src/features/research/ProjectsPage.tsx`

**Interfaces:**
- Consumes: useProjects, useDepartments hooks
- Produces: Standalone `/projects` page

- [ ] **Step 1: Create ProjectsPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useDepartments } from '@/hooks/useDepartments';

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const { data: departments } = useDepartments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = projects?.filter((p: any) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const statuses = [...new Set(projects?.map((p: any) => p.status).filter(Boolean))] || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Projects</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Research Projects</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Explore ongoing and completed research projects at TARC.
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border bg-white px-4 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card p-5">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              <div className="mt-2 h-3 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project: any) => {
            const dept = departments?.find((d: any) => d.id === project.departmentId);
            return (
              <div key={project.id} className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {project.status || 'Active'}
                  </span>
                </div>
                <h2 className="mt-3 font-heading text-lg font-semibold text-foreground line-clamp-2">
                  {project.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {project.summary || project.description || 'No description available.'}
                </p>
                {dept && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Department: {dept.name}
                  </p>
                )}
                {(project.startDate || project.endDate) && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {project.startDate && new Date(project.startDate).getFullYear()}
                    {project.startDate && project.endDate && ' — '}
                    {project.endDate && new Date(project.endDate).getFullYear()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify projects page renders**

Run: `npm run dev --workspace=apps/public`
Expected: `/projects` shows project cards with search and status filter

---

## Phase 4: Publications

### Task 16: Create PublicationsPage

**Files:**
- Create: `apps/public/src/features/publications/PublicationsPage.tsx`

**Interfaces:**
- Consumes: usePublications hook
- Produces: Publication list with filters

- [ ] **Step 1: Create PublicationsPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import { usePublications } from '@/hooks/usePublications';

export function PublicationsPage() {
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');

  const { data: publications, isLoading } = usePublications({ year: year || undefined, type: type || undefined });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const years = [...new Set(publications?.map((p: any) => p.year).filter(Boolean))].sort().reverse() || [];
  const types = [...new Set(publications?.map((p: any) => p.type).filter(Boolean))] || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Publications</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Publications</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Research outputs and publications from TARC.
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search publications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="h-10 rounded-lg border bg-white px-4 text-sm">
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-lg border bg-white px-4 text-sm">
          <option value="">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="mt-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card p-5">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-2 h-5 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-3 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {publications?.filter((p: any) =>
            !search || p.title?.toLowerCase().includes(search.toLowerCase())
          ).map((pub: any) => (
            <div key={pub.id} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">{pub.type || 'Publication'}</span>
                {pub.year && <span className="text-xs text-muted-foreground">{pub.year}</span>}
              </div>
              <h2 className="mt-2 font-heading text-lg font-semibold text-foreground">{pub.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pub.authors?.join(', ') || 'Unknown authors'}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {pub.abstract || 'No abstract available.'}
              </p>
              {pub.doiUrl && (
                <a href={pub.doiUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary hover:underline">
                  View Publication →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify publications page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Publications list shows with year/type filters

---

## Phase 5: News

### Task 17: Create NewsRoutes and NewsListPage

**Files:**
- Create: `apps/public/src/features/news/NewsRoutes.tsx`
- Create: `apps/public/src/features/news/NewsListPage.tsx`

**Interfaces:**
- Consumes: useNews hook
- Produces: News list with featured article

- [ ] **Step 1: Create NewsRoutes**

```tsx
import { Routes, Route } from 'react-router-dom';
import { NewsListPage } from './NewsListPage';
import { NewsDetailPage } from './NewsDetailPage';

export function NewsRoutes() {
  return (
    <Routes>
      <Route index element={<NewsListPage />} />
      <Route path=":slug" element={<NewsDetailPage />} />
    </Routes>
  );
}
```

- [ ] **Step 2: Create NewsListPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function NewsListPage() {
  const { data: news, isLoading } = useNews();
  const [category, setCategory] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = [...new Set(news?.map((n: any) => n.category).filter(Boolean))] || [];
  const filtered = news?.filter((n: any) => !category || n.category === category) || [];
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">News</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">News</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Latest announcements and updates from TARC.
      </p>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !category ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="mt-10 space-y-6">
          <div className="animate-pulse rounded-xl border bg-card p-6">
            <div className="aspect-video rounded-lg bg-muted" />
            <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ) : (
        <>
          {/* Featured article */}
          {featured && (
            <Link
              to={`/news/${featured.slug}`}
              className="mt-10 block rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <PlaceholderImage label="Featured News" className="rounded-lg" />
              <div className="mt-4">
                {featured.category && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {featured.category}
                  </span>
                )}
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">{featured.title}</h2>
                <p className="mt-2 text-muted-foreground">{featured.summary || featured.excerpt}</p>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article: any) => (
              <Link
                key={article.id}
                to={`/news/${article.slug}`}
                className="group rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <PlaceholderImage label="News Image" className="rounded-md" />
                <div className="mt-4">
                  {article.category && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {article.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {article.summary || article.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify news pages render**

Run: `npm run dev --workspace=apps/public`
Expected: `/news` shows featured article + grid, category filters work

---

### Task 18: Create NewsDetailPage

**Files:**
- Create: `apps/public/src/features/news/NewsDetailPage.tsx`

**Interfaces:**
- Consumes: useNewsBySlug hook
- Produces: Full article view with sidebar

- [ ] **Step 1: Create NewsDetailPage**

```tsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { useNewsBySlug } from '@/hooks/useNewsBySlug';
import { useNews } from '@/hooks/useNews';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useNewsBySlug(slug || '');
  const { data: allNews } = useNews({ limit: 5 });

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const relatedNews = allNews?.filter((n: any) => n.slug !== slug).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/4 rounded bg-muted" />
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="aspect-video rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link to="/news" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/news" className="hover:text-primary">News</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground line-clamp-1">{article.title}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        {/* Main content */}
        <article className="lg:col-span-2">
          {article.category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {article.category}
            </span>
          )}
          <h1 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
            <button className="flex items-center gap-1.5 hover:text-primary">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          <PlaceholderImage label="Article Image" className="mt-6 rounded-xl" />

          <div className="prose prose-gray mt-8 max-w-none">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p>{article.summary || 'No content available.'}</p>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <aside>
          <h3 className="font-heading text-lg font-semibold text-foreground">Related News</h3>
          <div className="mt-4 space-y-4">
            {relatedNews.map((n: any) => (
              <Link
                key={n.id}
                to={`/news/${n.slug}`}
                className="block rounded-lg border p-3 transition-shadow hover:shadow-sm"
              >
                <h4 className="font-heading text-sm font-semibold text-foreground line-clamp-2">{n.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(n.publishedAt || n.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </Link>
            ))}
          </div>

          <Link
            to="/news"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All News
          </Link>
        </aside>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify news detail renders**

Run: `npm run dev --workspace=apps/public`
Expected: Article loads with full content, related news sidebar shows

---

## Phase 6: Events

### Task 19: Create EventsPage

**Files:**
- Create: `apps/public/src/features/events/EventsPage.tsx`

**Interfaces:**
- Consumes: useEvents hook
- Produces: Events with date filtering

- [ ] **Step 1: Create EventsPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Filter } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';

type TimeFilter = 'all' | 'upcoming' | 'past';

export function EventsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const { data: events, isLoading } = useEvents({
    upcoming: timeFilter === 'upcoming' ? true : undefined,
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = events?.filter((e: any) => {
    if (timeFilter === 'past') return new Date(e.startTime || e.startDate) < new Date();
    return true;
  }) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Events</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Events</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Workshops, conferences, and activities at TARC.
      </p>

      {/* Time filter */}
      <div className="mt-8 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(['all', 'upcoming', 'past'] as TimeFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              timeFilter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Events list */}
      {isLoading ? (
        <div className="mt-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4 rounded-lg border bg-card p-4">
              <div className="h-16 w-16 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {filtered.map((event: any) => {
            const date = new Date(event.startTime || event.startDate);
            return (
              <div
                key={event.id}
                className="flex gap-4 rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
                  <span className="text-xl font-bold leading-none">{date.getDate()}</span>
                  <span className="text-xs uppercase">
                    {date.toLocaleString('en-US', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{event.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No events found.</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify events page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Events page shows with time filter tabs, events display with date badges

---

## Phase 7: About Pages

### Task 20: Create AboutRoutes Component

**Files:**
- Create: `apps/public/src/features/about/AboutRoutes.tsx`

**Interfaces:**
- Consumes: React Router nested routes
- Produces: `/about/*` routes

- [ ] **Step 1: Create AboutRoutes**

```tsx
import { Routes, Route } from 'react-router-dom';
import { AboutOverviewPage } from './AboutOverviewPage';
import { DirectorMessagePage } from './DirectorMessagePage';
import { DepartmentsPage } from './DepartmentsPage';
import { PeoplePage } from './PeoplePage';

export function AboutRoutes() {
  return (
    <Routes>
      <Route index element={<AboutOverviewPage />} />
      <Route path="director" element={<DirectorMessagePage />} />
      <Route path="departments" element={<DepartmentsPage />} />
      <Route path="people" element={<PeoplePage />} />
    </Routes>
  );
}
```

- [ ] **Step 2: Verify about routes work**

Run: `npm run dev --workspace=apps/public`
Expected: `/about`, `/about/director`, `/about/departments`, `/about/people` all load

---

### Task 21: Create AboutOverviewPage

**Files:**
- Create: `apps/public/src/features/about/AboutOverviewPage.tsx`

**Interfaces:**
- Consumes: useSettings hook
- Produces: Vision, mission, mandate overview

- [ ] **Step 1: Create AboutOverviewPage**

```tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Shield, ArrowRight } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function AboutOverviewPage() {
  const { data: settings } = useSettings();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">About Us</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">About TARC</h1>

      {/* Overview */}
      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <div>
          <p className="text-lg text-muted-foreground">
            {settings?.aboutText ||
              'The Tepi Agricultural Research Center (TARC) is dedicated to advancing agricultural research and innovation for sustainable development in South West Ethiopia.'}
          </p>
        </div>
        <div>
          <PlaceholderImage label="TARC Facility" className="rounded-xl" />
        </div>
      </div>

      {/* Vision, Mission, Mandate */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Eye className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">Vision</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {settings?.vision || 'To be a leading center of excellence in agricultural research.'}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">Mission</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {settings?.mission || 'To conduct quality agricultural research and disseminate findings for sustainable development.'}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">Mandate</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Conducting research in crop production, natural resource management, and agricultural innovation.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-16 flex flex-wrap gap-4">
        <Link
          to="/about/director"
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Director's Message <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/about/departments"
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Our Departments <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/about/people"
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Meet Our Team <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify about overview renders**

Run: `npm run dev --workspace=apps/public`
Expected: About page shows overview, vision/mission/mandate cards, quick links

---

### Task 22: Create DirectorMessagePage

**Files:**
- Create: `apps/public/src/features/about/DirectorMessagePage.tsx`

**Interfaces:**
- Consumes: useSettings hook
- Produces: Director profile + message

- [ ] **Step 1: Create DirectorMessagePage**

```tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function DirectorMessagePage() {
  const { data: settings } = useSettings();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/about" className="hover:text-primary">About</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Director's Message</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Director's Message</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-3">
        {/* Director info */}
        <div className="md:col-span-1">
          <PlaceholderImage label="Director Photo" aspectRatio="square" className="rounded-xl" />
          <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
            {settings?.directorName || 'Center Director'}
          </h2>
          <p className="text-sm text-muted-foreground">Tepi Agricultural Research Center</p>
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <div className="prose prose-gray max-w-none">
            {settings?.directorMessage ? (
              <div dangerouslySetInnerHTML={{ __html: settings.directorMessage }} />
            ) : (
              <p className="text-muted-foreground">
                The director's message will be displayed here once provided by the Center.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify director page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Director page shows with photo placeholder and message

---

### Task 23: Create DepartmentsPage

**Files:**
- Create: `apps/public/src/features/about/DepartmentsPage.tsx`

**Interfaces:**
- Consumes: useDepartments hook
- Produces: Department cards grid

- [ ] **Step 1: Create DepartmentsPage**

```tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';

export function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/about" className="hover:text-primary">About</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Departments</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Departments</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        The organizational units that drive research at TARC.
      </p>

      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-card p-6">
              <div className="h-5 w-2/3 rounded bg-muted" />
              <div className="mt-3 h-3 w-full rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments?.map((dept: any) => (
            <div key={dept.id} className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
              <h2 className="font-heading text-xl font-semibold text-foreground">{dept.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {dept.description || 'No description available.'}
              </p>
              {dept.establishedYear && (
                <p className="mt-2 text-xs text-muted-foreground">Est. {dept.establishedYear}</p>
              )}
              <Link
                to={`/research/${dept.slug || dept.id}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View Research <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify departments page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Department cards display with descriptions

---

### Task 24: Create PeoplePage

**Files:**
- Create: `apps/public/src/features/about/PeoplePage.tsx`

**Interfaces:**
- Consumes: useStaff, useDepartments hooks
- Produces: Staff grid (public-safe fields only)

**Privacy constraint:** Only display name, position, department, bio, areasOfExpertise. Never expose personal email, phone, or sensitive data.

- [ ] **Step 1: Create PeoplePage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { useDepartments } from '@/hooks/useDepartments';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function PeoplePage() {
  const { data: staff, isLoading } = useStaff();
  const { data: departments } = useDepartments();
  const [deptFilter, setDeptFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = staff?.filter((s: any) => {
    const matchesDept = !deptFilter || s.departmentId === deptFilter;
    const matchesSearch = !search ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.position?.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  }) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/about" className="hover:text-primary">About</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Our People</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Our People</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        The researchers and staff behind TARC's work.
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="h-10 rounded-lg border bg-white px-4 text-sm"
        >
          <option value="">All Departments</option>
          {departments?.map((d: any) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-card p-4">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((person: any) => {
            const dept = departments?.find((d: any) => d.id === person.departmentId);
            return (
              <div key={person.id} className="rounded-xl border bg-card p-4 text-center transition-shadow hover:shadow-md">
                <PlaceholderImage label="Photo" aspectRatio="square" className="mx-auto w-32 rounded-full" />
                <h3 className="mt-3 font-heading font-semibold text-foreground">
                  {person.firstName} {person.lastName}
                </h3>
                <p className="text-sm text-primary">{person.position}</p>
                {dept && <p className="mt-1 text-xs text-muted-foreground">{dept.name}</p>}
                {person.bio && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{person.bio}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify people page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Staff grid shows with name, position, department only (no sensitive data)

---

## Phase 8: Gallery, Contact, Search, 404

### Task 25: Create GalleryPage

**Files:**
- Create: `apps/public/src/features/gallery/GalleryPage.tsx`

**Interfaces:**
- Consumes: useGallery hook
- Produces: Masonry grid + lightbox

- [ ] **Step 1: Create GalleryPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useGallery } from '@/hooks/useGallery';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function GalleryPage() {
  const { data: media, isLoading } = useGallery();
  const [category, setCategory] = useState('');
  const [lightbox, setLightbox] = useState<any>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = [...new Set(media?.map((m: any) => m.category).filter(Boolean))] || [];
  const filtered = media?.filter((m: any) => !category || m.category === category) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Gallery</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Gallery</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Visual highlights from TARC activities and facilities.
      </p>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !category ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse aspect-square rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((item: any) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item)}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <PlaceholderImage label={item.title || 'Gallery'} className="h-full w-full" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm font-medium text-white">{item.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
          <button className="absolute right-4 top-4 text-white" onClick={() => setLightbox(null)}>
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <PlaceholderImage label={lightbox.title || 'Gallery Image'} className="rounded-lg" />
            {lightbox.title && (
              <p className="mt-3 text-center text-white">{lightbox.title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify gallery renders**

Run: `npm run dev --workspace=apps/public`
Expected: Gallery grid shows, lightbox opens on click, category filter works

---

### Task 26: Create ContactPage

**Files:**
- Create: `apps/public/src/features/contact/ContactPage.tsx`

**Interfaces:**
- Consumes: useSettings hook
- Produces: Contact form + info panel

**Privacy note:** Only collect name, email, subject, message. Add data handling notice below form.

- [ ] **Step 1: Create ContactPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function ContactPage() {
  const { data: settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/v1/messages when endpoint is ready
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Contact</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Contact Us</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        We would love to hear from you.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        {/* Form */}
        <div>
          {submitted ? (
            <div className="rounded-xl border bg-primary/5 p-8 text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">Message Sent!</h2>
              <p className="mt-2 text-muted-foreground">
                Thank you for contacting us. We will review your message and respond through our normal process.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border bg-white px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border bg-white px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground">Subject *</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border bg-white px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground">Message *</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
              <p className="text-xs text-muted-foreground">
                Your message will be reviewed by authorized Center personnel. Personal information is handled in accordance with institutional policy.
              </p>
            </form>
          )}
        </div>

        {/* Info panel */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Contact Information</h2>
            <div className="mt-4 space-y-3">
              <a href="tel:+251475560000" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary">
                <Phone className="h-4 w-4" /> {settings?.phone || '+251 47 556 0000'}
              </a>
              <a href="mailto:info@tarc.gov.et" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary">
                <Mail className="h-4 w-4" /> {settings?.email || 'info@tarc.gov.et'}
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{settings?.address || 'Tepi, South West Ethiopia'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Office Hours</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Monday — Friday: 8:00 AM — 5:00 PM
            </p>
            <p className="text-sm text-muted-foreground">
              Saturday — Sunday: Closed
            </p>
          </div>

          {/* Map placeholder */}
          <div className="rounded-xl border bg-card p-6">
            <PlaceholderImage label="Map Location" className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify contact page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Contact form with validation, info panel, privacy notice

---

### Task 27: Create SearchPage

**Files:**
- Create: `apps/public/src/features/search/SearchPage.tsx`

**Interfaces:**
- Consumes: All data hooks
- Produces: Global search with category groups

- [ ] **Step 1: Create SearchPage**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Newspaper, BookOpen, Calendar, Users } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { usePublications } from '@/hooks/usePublications';
import { useEvents } from '@/hooks/useEvents';
import { useStaff } from '@/hooks/useStaff';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: news } = useNews();
  const { data: publications } = usePublications();
  const { data: events } = useEvents();
  const { data: staff } = useStaff();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const q = query.toLowerCase();
  const results = {
    news: news?.filter((n: any) => n.title?.toLowerCase().includes(q) || n.summary?.toLowerCase().includes(q)) || [],
    publications: publications?.filter((p: any) => p.title?.toLowerCase().includes(q) || p.authors?.some((a: string) => a.toLowerCase().includes(q))) || [],
    events: events?.filter((e: any) => e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)) || [],
    staff: staff?.filter((s: any) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.position?.toLowerCase().includes(q)) || [],
  };

  const totalResults = results.news.length + results.publications.length + results.events.length + results.staff.length;

  const groups = [
    { key: 'news', label: 'News', icon: Newspaper, items: results.news, render: (item: any) => ({ title: item.title, path: `/news/${item.slug}` }) },
    { key: 'publications', label: 'Publications', icon: BookOpen, items: results.publications, render: (item: any) => ({ title: item.title, path: '/publications' }) },
    { key: 'events', label: 'Events', icon: Calendar, items: results.events, render: (item: any) => ({ title: item.title, path: '/events' }) },
    { key: 'staff', label: 'Staff', icon: Users, items: results.staff, render: (item: any) => ({ title: `${item.firstName} ${item.lastName}`, path: '/about/people' }) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Search</span>
      </nav>

      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Search</h1>

      <div className="relative mt-6 max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search news, publications, events, staff..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {query && (
        <p className="mt-4 text-sm text-muted-foreground">
          {totalResults} result{totalResults !== 1 ? 's' : ''} found
        </p>
      )}

      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          group.items.length > 0 && (
            <div key={group.key}>
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <group.icon className="h-5 w-5 text-primary" />
                {group.label}
                <span className="text-sm font-normal text-muted-foreground">({group.items.length})</span>
              </h2>
              <div className="mt-3 space-y-2">
                {group.items.slice(0, 5).map((item: any) => {
                  const { title, path } = group.render(item);
                  return (
                    <Link
                      key={item.id}
                      to={path}
                      className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <h3 className="font-medium text-foreground hover:text-primary">{title}</h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>

      {query && totalResults === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">No results found for "{query}"</p>
          <p className="mt-2 text-sm text-muted-foreground">Try different keywords</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify search page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Search returns results grouped by category

---

### Task 28: Create NotFoundPage

**Files:**
- Create: `apps/public/src/components/NotFoundPage.tsx`

**Interfaces:**
- Produces: 404 page with back link

- [ ] **Step 1: Create NotFoundPage**

```tsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-foreground">Page Not Found</p>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify 404 page renders**

Run: `npm run dev --workspace=apps/public`
Expected: Navigating to `/nonexistent` shows 404 page

---

## Phase 9: Polish, Responsive, Accessibility, SEO, Lint, Build

### Task 29: Responsive Polish

**Files:**
- Review all pages for responsive behavior

- [ ] **Step 1: Test at all breakpoints**

Open `npm run dev --workspace=apps/public` and test at:
- 375px (mobile)
- 768px (tablet)
- 1024px (laptop)
- 1440px (desktop)

- [ ] **Step 2: Verify header responsive behavior**

- Mobile: hamburger menu, single column
- Desktop: full nav visible, three columns

- [ ] **Step 3: Verify footer responsive behavior**

- Mobile: single column
- Desktop: three columns

- [ ] **Step 4: Verify all grids collapse properly**

- News: 3 cols → 2 → 1
- Events: sidebar collapses on mobile
- Publications: cards stack on mobile
- People: 4 cols → 2 → 1

- [ ] **Step 5: Verify no horizontal overflow**

Check all pages for horizontal scroll

---

### Task 30: Accessibility Audit

**Files:**
- Review all components

- [ ] **Step 1: Add alt text to all images**

Ensure every `PlaceholderImage` has a meaningful `label`

- [ ] **Step 2: Ensure all form inputs have labels**

Verify every `<input>` and `<textarea>` has associated `<label>`

- [ ] **Step 3: Add aria-labels to icon buttons**

```tsx
<button aria-label="Close menu"><X /></button>
<button aria-label="Search"><Search /></button>
```

- [ ] **Step 4: Verify color contrast**

Ensure text colors meet WCAG AA contrast ratios against backgrounds

- [ ] **Step 5: Test keyboard navigation**

Tab through all interactive elements, verify logical order

- [ ] **Step 6: Add focus-visible styles**

Ensure all interactive elements show visible focus ring

---

### Task 31: SEO & Meta Tags

**Files:**
- Edit: `apps/public/index.html`

- [ ] **Step 1: Set default title**

```html
<title>TARC - Tepi Agricultural Research Center</title>
```

- [ ] **Step 2: Set meta description**

```html
<meta name="description" content="Tepi Agricultural Research Center — Advancing agricultural research and innovation for sustainable development in South West Ethiopia." />
```

- [ ] **Step 3: Set Open Graph tags**

```html
<meta property="og:title" content="TARC - Tepi Agricultural Research Center" />
<meta property="og:description" content="Advancing agricultural research and innovation for sustainable development." />
<meta property="og:type" content="website" />
```

- [ ] **Step 4: Verify meta tags**

View page source at `/` — confirm tags present

---

### Task 32: Lint & Type Check

**Files:**
- All modified files

- [ ] **Step 1: Run Biome linter**

Run: `npx @biomejs/biome check apps/public/src/`
Expected: No errors (fix any reported issues)

- [ ] **Step 2: Run TypeScript type check**

Run: `npx tsc --noEmit --project apps/public/tsconfig.json`
Expected: No type errors

- [ ] **Step 3: Fix any reported issues**

---

### Task 33: Final Build Verification

**Files:**
- All modified files

- [ ] **Step 1: Run production build**

Run: `npm run build --workspace=apps/public`
Expected: Build succeeds

- [ ] **Step 2: Run tests**

Run: `npm run test --workspace=apps/public`
Expected: All tests pass (update any broken assertions)

- [ ] **Step 3: Manual smoke test**

Navigate all routes manually:
- `/` (homepage)
- `/research` and `/research/:slug`
- `/projects`
- `/publications`
- `/news` and `/news/:slug`
- `/events`
- `/about`, `/about/director`, `/about/departments`, `/about/people`
- `/gallery`
- `/contact`
- `/search`
- `/nonexistent` (404)

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-6 | Design tokens, router conversion, header, footer, server endpoint, hooks |
| 2 | 7-12 | Homepage sections (hero, news, events, publications, stats) |
| 3 | 13-15.5 | Research pages (list + detail + standalone projects) |
| 4 | 16 | Publications page |
| 5 | 17-18 | News pages (list + detail) |
| 6 | 19 | Events page |
| 7 | 20-24 | About pages (overview, director, departments, people) |
| 8 | 25-28 | Gallery, Contact, Search, 404 |
| 9 | 29-33 | Responsive, accessibility, SEO, lint, build |

**Total: 35 tasks across 9 phases**

---

## Key Decisions

1. **Approach C (Hybrid):** Keep existing structure, rewrite all contents
2. **Router:** Switch from hash router to BrowserRouter (clean URLs)
3. **Header:** Green top bar (phone + email + language selector, NO Portal Login) + white sticky nav
4. **Images:** Placeholder boxes for now (dashed border + label)
5. **Data:** All content from API endpoints, no hardcoded strings
6. **Privacy:** Staff page only shows public-safe fields; contact form has data handling notice
7. **Projects:** Standalone `/projects` route in addition to research detail pages
