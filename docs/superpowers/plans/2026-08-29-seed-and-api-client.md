# Seed + API Client Architecture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a comprehensive database seed, build per-app typed API clients with React Query hooks, and migrate all existing fetch calls to use them.

**Architecture:** Each app (`apps/public`, `apps/dashboard`) gets its own `src/api/` folder with a base HTTP client, domain-specific API functions, and React Query hooks. Types flow from `packages/shared` (DTOs + Zod schemas). The server seed is expanded to cover all 13 tables with realistic data.

**Tech Stack:** Drizzle ORM, MySQL2, TanStack Query v5, Zod, TypeScript, Vitest

**Spec:** This plan (no separate spec file — design was approved in chat)

---

## Global Constraints

- **TypeScript strict** — no `any` types in new code
- **Use existing shared types** — import DTOs and Zod schemas from `@tarcms/shared`
- **TanStack Query v5** — all data fetching via `useQuery`/`useMutation`
- **Existing patterns** — follow the dashboard's `useApiQuery`/`useApiMutation` conventions
- **No new dependencies** — everything needed is already in package.json
- **Base URL** — API client uses relative URLs (`/api/v1/...`) for same-origin deployments

---

## File Structure

### Server Seed
```
apps/server/src/db/seeds/
  tarc-seed.ts                    # MODIFY — expand to all 13 tables
```

### Public App API Client
```
apps/public/src/api/
  client.ts                       # CREATE — base HTTP client
  types.ts                        # CREATE — re-export shared types
  endpoints.ts                    # CREATE — URL constants
  domains/
    settings.ts                   # CREATE
    news.ts                       # CREATE
    events.ts                     # CREATE
    publications.ts               # CREATE
    departments.ts                # CREATE
    staff.ts                      # CREATE
    projects.ts                   # CREATE
    gallery.ts                    # CREATE
    messages.ts                   # CREATE
    dashboard.ts                  # CREATE
  hooks/
    useSettings.ts                # CREATE (replace existing)
    useNews.ts                    # CREATE (replace existing)
    useNewsBySlug.ts              # CREATE (replace existing)
    useEvents.ts                  # CREATE (replace existing)
    usePublications.ts            # CREATE (replace existing)
    useDepartments.ts             # CREATE (replace existing)
    useStaff.ts                   # CREATE (replace existing)
    useProjects.ts                # CREATE (replace existing)
    useGallery.ts                 # CREATE (replace existing)
    useContact.ts                 # CREATE (replace existing)
    useMetrics.ts                 # CREATE (for stats counter)
```

### Dashboard App API Client
```
apps/dashboard/src/api/
  client.ts                       # CREATE — base HTTP client (with auth)
  types.ts                        # CREATE — re-export shared types
  endpoints.ts                    # CREATE — URL constants
  domains/
    auth.ts                       # CREATE
    departments.ts                # CREATE
    staff.ts                      # CREATE
    programs.ts                   # CREATE
    projects.ts                   # CREATE
    publications.ts               # CREATE
    news.ts                       # CREATE
    events.ts                     # CREATE
    gallery.ts                    # CREATE
    vehicles.ts                   # CREATE
    messages.ts                   # CREATE
    settings.ts                   # CREATE
    profile.ts                    # CREATE
    dashboard.ts                  # CREATE
```

### Cleanup
```
apps/public/src/hooks/            # DELETE — replaced by api/hooks/
apps/public/src/features/home/    # MODIFY — update imports
apps/public/src/features/news/    # MODIFY — update imports
... (all feature files)           # MODIFY — update imports
```

---

## Tasks

### Task 1: Expand Server Seed

**Files:**
- Modify: `apps/server/src/db/seeds/tarc-seed.ts`

**Interfaces:**
- Produces: Seeded database with all 13 tables populated

- [ ] **Step 1: Read the current seed file**

```bash
cat apps/server/src/db/seeds/tarc-seed.ts
```

- [ ] **Step 2: Rewrite with comprehensive data**

Replace the entire file with expanded seed data covering all tables. Key changes:
- Add `gallery_media` seed (10 items across all categories)
- Add `vehicle_assignments` seed (3 items)
- Expand `news` to 6 articles (all categories)
- Expand `events` to 6 (upcoming + past, all types)
- Expand `publications` to 8 (all types)
- Expand `staff` to 8 members
- Expand `users` to 5 (all roles)
- Add more `publication_authors` (12)

The seed file should:
- Import all table schemas from `../schema/index.js`
- Use `onDuplicateKeyUpdate` for idempotency
- Use deterministic UUIDs (e.g., `g0000000-...` for gallery)
- Use `bcryptjs` for password hashing
- Export a `seed()` function and auto-run it

- [ ] **Step 3: Run seed to verify**

```bash
cd apps/server && npm run db:seed
```

Expected: All tables populated, no errors

- [ ] **Step 4: Verify data in database**

```bash
cd apps/server && npx drizzle-kit studio
```

Or query directly:
```bash
mysql -u tarc_user -p tarcms_db -e "SELECT COUNT(*) FROM news; SELECT COUNT(*) FROM gallery_media; SELECT COUNT(*) FROM vehicle_assignments;"
```

Expected: news=6, gallery_media=10, vehicle_assignments=3

- [ ] **Step 5: Commit**

```bash
git add apps/server/src/db/seeds/tarc-seed.ts
git commit -m "feat(seed): expand seed to all 13 tables with comprehensive data"
```

---

### Task 2: Create Public App — Base HTTP Client

**Files:**
- Create: `apps/public/src/api/client.ts`

**Interfaces:**
- Produces: `apiClient<T>(endpoint, options?)` function

- [ ] **Step 1: Create the base client**

```typescript
// apps/public/src/api/client.ts
import type { ApiResponse } from '@tarcms/shared';

const BASE_URL = '/api/v1';

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.pathname + url.search;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & RequestOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.error?.message || `Request failed: ${response.status}`,
      response.status,
      json.error,
    );
  }

  return json.data;
}

export function get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET', ...options });
}

export function post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

export function put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

export function del<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE', ...options });
}
```

- [ ] **Step 2: Create endpoint constants**

```typescript
// apps/public/src/api/endpoints.ts
export const endpoints = {
  settings: '/settings',
  departments: '/departments',
  staff: '/staff',
  news: '/communication/news',
  newsBySlug: (slug: string) => `/communication/news/${slug}`,
  events: '/communication/events',
  eventsUpcoming: '/communication/events/upcoming',
  gallery: '/communication/gallery',
  galleryByCategory: (cat: string) => `/communication/gallery/${cat}`,
  researchPrograms: '/research/programs',
  researchProjects: '/research/projects',
  publications: '/publications',
  contact: '/operations/messages',
  metrics: '/admin/dashboard/metrics',
} as const;
```

- [ ] **Step 3: Create type re-exports**

```typescript
// apps/public/src/api/types.ts
export type {
  ApiResponse,
  DepartmentDTO,
  StaffDTO,
  NewsDTO,
  EventDTO,
  PublicationDTO,
  PublicationAuthorDTO,
  ResearchProgramDTO,
  ResearchProjectDTO,
  GalleryMediaDTO,
  SystemSettingsDTO,
  DashboardMetricsDTO,
  ContactFormInput,
} from '@tarcms/shared';
```

- [ ] **Step 4: Commit**

```bash
git add apps/public/src/api/
git commit -m "feat(public): add base API client, endpoints, and type exports"
```

---

### Task 3: Create Public App — Domain API Functions

**Files:**
- Create: `apps/public/src/api/domains/settings.ts`
- Create: `apps/public/src/api/domains/news.ts`
- Create: `apps/public/src/api/domains/events.ts`
- Create: `apps/public/src/api/domains/publications.ts`
- Create: `apps/public/src/api/domains/departments.ts`
- Create: `apps/public/src/api/domains/staff.ts`
- Create: `apps/public/src/api/domains/projects.ts`
- Create: `apps/public/src/api/domains/gallery.ts`
- Create: `apps/public/src/api/domains/messages.ts`
- Create: `apps/public/src/api/domains/dashboard.ts`

**Interfaces:**
- Consumes: `get`, `post` from `../client.ts`, `endpoints` from `../endpoints.ts`
- Produces: Typed async functions for each domain

- [ ] **Step 1: Create settings domain**

```typescript
// apps/public/src/api/domains/settings.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { SystemSettingsDTO } from '../types';

export function getSettings(): Promise<SystemSettingsDTO> {
  return get<SystemSettingsDTO>(endpoints.settings);
}
```

- [ ] **Step 2: Create news domain**

```typescript
// apps/public/src/api/domains/news.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { NewsDTO } from '../types';

interface NewsParams {
  limit?: number;
  category?: string;
}

export function getNews(params?: NewsParams): Promise<NewsDTO[]> {
  return get<NewsDTO[]>(endpoints.news, { params });
}

export function getNewsBySlug(slug: string): Promise<NewsDTO> {
  return get<NewsDTO>(endpoints.newsBySlug(slug));
}
```

- [ ] **Step 3: Create events domain**

```typescript
// apps/public/src/api/domains/events.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { EventDTO } from '../types';

interface EventParams {
  limit?: number;
  upcoming?: boolean;
}

export function getEvents(params?: EventParams): Promise<EventDTO[]> {
  return get<EventDTO[]>(endpoints.events, { params });
}

export function getUpcomingEvents(): Promise<EventDTO[]> {
  return get<EventDTO[]>(endpoints.eventsUpcoming);
}
```

- [ ] **Step 4: Create publications domain**

```typescript
// apps/public/src/api/domains/publications.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { PublicationDTO } from '../types';

interface PublicationParams {
  year?: string;
  type?: string;
}

export function getPublications(params?: PublicationParams): Promise<PublicationDTO[]> {
  return get<PublicationDTO[]>(endpoints.publications, { params });
}
```

- [ ] **Step 5: Create departments domain**

```typescript
// apps/public/src/api/domains/departments.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { DepartmentDTO } from '../types';

export function getDepartments(): Promise<DepartmentDTO[]> {
  return get<DepartmentDTO[]>(endpoints.departments);
}
```

- [ ] **Step 6: Create staff domain**

```typescript
// apps/public/src/api/domains/staff.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { StaffDTO } from '../types';

interface StaffParams {
  departmentId?: string;
}

export function getStaff(params?: StaffParams): Promise<StaffDTO[]> {
  return get<StaffDTO[]>(endpoints.staff, { params });
}
```

- [ ] **Step 7: Create projects domain**

```typescript
// apps/public/src/api/domains/projects.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { ResearchProgramDTO, ResearchProjectDTO } from '../types';

interface ProjectParams {
  programId?: string;
  status?: string;
}

export function getPrograms(): Promise<ResearchProgramDTO[]> {
  return get<ResearchProgramDTO[]>(endpoints.researchPrograms);
}

export function getProjects(params?: ProjectParams): Promise<ResearchProjectDTO[]> {
  return get<ResearchProjectDTO[]>(endpoints.researchProjects, { params });
}
```

- [ ] **Step 8: Create gallery domain**

```typescript
// apps/public/src/api/domains/gallery.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { GalleryMediaDTO } from '../types';

interface GalleryParams {
  category?: string;
}

export function getGallery(params?: GalleryParams): Promise<GalleryMediaDTO[]> {
  if (params?.category) {
    return get<GalleryMediaDTO[]>(endpoints.galleryByCategory(params.category));
  }
  return get<GalleryMediaDTO[]>(endpoints.gallery);
}
```

- [ ] **Step 9: Create messages domain**

```typescript
// apps/public/src/api/domains/messages.ts
import { post } from '../client';
import { endpoints } from '../endpoints';
import type { ContactFormInput } from '../types';

export function submitContact(data: ContactFormInput): Promise<void> {
  return post<void>(endpoints.contact, data);
}
```

- [ ] **Step 10: Create dashboard metrics domain**

```typescript
// apps/public/src/api/domains/dashboard.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { DashboardMetricsDTO } from '../types';

export function getMetrics(): Promise<DashboardMetricsDTO> {
  return get<DashboardMetricsDTO>(endpoints.metrics);
}
```

- [ ] **Step 11: Commit**

```bash
git add apps/public/src/api/domains/
git commit -m "feat(public): add domain API functions for all endpoints"
```

---

### Task 4: Create Public App — React Query Hooks

**Files:**
- Create: `apps/public/src/api/hooks/useSettings.ts`
- Create: `apps/public/src/api/hooks/useNews.ts`
- Create: `apps/public/src/api/hooks/useNewsBySlug.ts`
- Create: `apps/public/src/api/hooks/useEvents.ts`
- Create: `apps/public/src/api/hooks/usePublications.ts`
- Create: `apps/public/src/api/hooks/useDepartments.ts`
- Create: `apps/public/src/api/hooks/useStaff.ts`
- Create: `apps/public/src/api/hooks/useProjects.ts`
- Create: `apps/public/src/api/hooks/useGallery.ts`
- Create: `apps/public/src/api/hooks/useContact.ts`
- Create: `apps/public/src/api/hooks/useMetrics.ts`

**Interfaces:**
- Consumes: Domain functions from `../domains/*`
- Produces: React Query hooks compatible with existing component usage

- [ ] **Step 1: Create useSettings hook**

```typescript
// apps/public/src/api/hooks/useSettings.ts
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../domains/settings';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });
}
```

- [ ] **Step 2: Create useNews hook**

```typescript
// apps/public/src/api/hooks/useNews.ts
import { useQuery } from '@tanstack/react-query';
import { getNews } from '../domains/news';

interface UseNewsParams {
  limit?: number;
  category?: string;
}

export function useNews(params?: UseNewsParams) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => getNews(params),
  });
}
```

- [ ] **Step 3: Create useNewsBySlug hook**

```typescript
// apps/public/src/api/hooks/useNewsBySlug.ts
import { useQuery } from '@tanstack/react-query';
import { getNewsBySlug } from '../domains/news';

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ['news', slug],
    queryFn: () => getNewsBySlug(slug),
    enabled: !!slug,
  });
}
```

- [ ] **Step 4: Create useEvents hook**

```typescript
// apps/public/src/api/hooks/useEvents.ts
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../domains/events';

interface UseEventsParams {
  limit?: number;
  upcoming?: boolean;
}

export function useEvents(params?: UseEventsParams) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => getEvents(params),
  });
}
```

- [ ] **Step 5: Create usePublications hook**

```typescript
// apps/public/src/api/hooks/usePublications.ts
import { useQuery } from '@tanstack/react-query';
import { getPublications } from '../domains/publications';

interface UsePublicationsParams {
  year?: string;
  type?: string;
}

export function usePublications(params?: UsePublicationsParams) {
  return useQuery({
    queryKey: ['publications', params],
    queryFn: () => getPublications(params),
  });
}
```

- [ ] **Step 6: Create useDepartments hook**

```typescript
// apps/public/src/api/hooks/useDepartments.ts
import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../domains/departments';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
}
```

- [ ] **Step 7: Create useStaff hook**

```typescript
// apps/public/src/api/hooks/useStaff.ts
import { useQuery } from '@tanstack/react-query';
import { getStaff } from '../domains/staff';

interface UseStaffParams {
  departmentId?: string;
}

export function useStaff(params?: UseStaffParams) {
  return useQuery({
    queryKey: ['staff', params],
    queryFn: () => getStaff(params),
  });
}
```

- [ ] **Step 8: Create useProjects hook**

```typescript
// apps/public/src/api/hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import { getPrograms, getProjects } from '../domains/projects';

interface UseProjectsParams {
  programId?: string;
  status?: string;
}

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms,
  });
}

export function useProjects(params?: UseProjectsParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
  });
}
```

- [ ] **Step 9: Create useGallery hook**

```typescript
// apps/public/src/api/hooks/useGallery.ts
import { useQuery } from '@tanstack/react-query';
import { getGallery } from '../domains/gallery';

interface UseGalleryParams {
  category?: string;
}

export function useGallery(params?: UseGalleryParams) {
  return useQuery({
    queryKey: ['gallery', params],
    queryFn: () => getGallery(params),
  });
}
```

- [ ] **Step 10: Create useContact hook**

```typescript
// apps/public/src/api/hooks/useContact.ts
import { useMutation } from '@tanstack/react-query';
import { submitContact } from '../domains/messages';
import type { ContactFormInput } from '../types';

export function useContact() {
  return useMutation({
    mutationFn: (data: ContactFormInput) => submitContact(data),
  });
}
```

- [ ] **Step 11: Create useMetrics hook**

```typescript
// apps/public/src/api/hooks/useMetrics.ts
import { useQuery } from '@tanstack/react-query';
import { getMetrics } from '../domains/dashboard';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: getMetrics,
  });
}
```

- [ ] **Step 12: Commit**

```bash
git add apps/public/src/api/hooks/
git commit -m "feat(public): add React Query hooks for all API domains"
```

---

### Task 5: Migrate Public App — Update All Imports

**Files:**
- Modify: All files in `apps/public/src/features/*/` that import from `@/hooks/`
- Delete: `apps/public/src/hooks/` (old hooks)

**Interfaces:**
- Consumes: New hooks from `@/api/hooks/*`
- Produces: All features using new API client

- [ ] **Step 1: Find all files importing old hooks**

```bash
grep -rn "from '@/hooks/" apps/public/src/features/ --include="*.tsx" --include="*.ts"
```

- [ ] **Step 2: Update imports in each file**

For each file found, replace:
- `import { useSettings } from '@/hooks/useSettings'` → `import { useSettings } from '@/api/hooks/useSettings'`
- `import { useNews } from '@/hooks/useNews'` → `import { useNews } from '@/api/hooks/useNews'`
- `import { useNewsBySlug } from '@/hooks/useNewsBySlug'` → `import { useNewsBySlug } from '@/api/hooks/useNewsBySlug'`
- `import { useEvents } from '@/hooks/useEvents'` → `import { useEvents } from '@/api/hooks/useEvents'`
- `import { usePublications } from '@/hooks/usePublications'` → `import { usePublications } from '@/api/hooks/usePublications'`
- `import { useDepartments } from '@/hooks/useDepartments'` → `import { useDepartments } from '@/api/hooks/useDepartments'`
- `import { useStaff } from '@/hooks/useStaff'` → `import { useStaff } from '@/api/hooks/useStaff'`
- `import { useProjects } from '@/hooks/useProjects'` → `import { useProjects } from '@/api/hooks/useProjects'`
- `import { useGallery } from '@/hooks/useGallery'` → `import { useGallery } from '@/api/hooks/useGallery'`
- `import { useContact } from '@/hooks/useContact'` → `import { useContact } from '@/api/hooks/useContact'`
- `import { useMetrics } from '@/hooks/useMetrics'` → `import { useMetrics } from '@/api/hooks/useMetrics'`

Also update the App.test.tsx if it imports from hooks.

- [ ] **Step 3: Delete old hooks**

```bash
rm -rf apps/public/src/hooks/
```

- [ ] **Step 4: Verify build passes**

```bash
npm run build --workspace=apps/public
```

Expected: No errors

- [ ] **Step 5: Run tests**

```bash
npm run test --workspace=apps/public
```

Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add apps/public/src/
git commit -m "feat(public): migrate all features to new API client hooks"
```

---

### Task 6: Create Dashboard App — Base HTTP Client

**Files:**
- Create: `apps/dashboard/src/api/client.ts`
- Create: `apps/dashboard/src/api/endpoints.ts`
- Create: `apps/dashboard/src/api/types.ts`

**Interfaces:**
- Produces: Authenticated `apiClient<T>` with Bearer token injection

- [ ] **Step 1: Create the base client with auth**

```typescript
// apps/dashboard/src/api/client.ts
import type { ApiResponse } from '@tarcms/shared';

const BASE_URL = '/api/v1';

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.pathname + url.search;
}

function getToken(): string | null {
  return localStorage.getItem('token');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & RequestOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new ApiError('Unauthorized', 401);
  }

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.error?.message || `Request failed: ${response.status}`,
      response.status,
      json.error,
    );
  }

  return json.data;
}

export function get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET', ...options });
}

export function post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

export function put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

export function del<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE', ...options });
}
```

- [ ] **Step 2: Create endpoint constants**

```typescript
// apps/dashboard/src/api/endpoints.ts
export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  dashboard: {
    metrics: '/admin/dashboard/metrics',
  },
  departments: {
    list: '/admin/departments',
    byId: (id: string) => `/admin/departments/${id}`,
  },
  staff: {
    list: '/admin/staff',
    byId: (id: string) => `/admin/staff/${id}`,
  },
  programs: {
    list: '/admin/research/programs',
    byId: (id: string) => `/admin/research/programs/${id}`,
  },
  projects: {
    list: '/admin/research/projects',
    byId: (id: string) => `/admin/research/projects/${id}`,
  },
  publications: {
    list: '/admin/publications',
    byId: (id: string) => `/admin/publications/${id}`,
  },
  news: {
    list: '/admin/communication/news',
    byId: (id: string) => `/admin/communication/news/${id}`,
  },
  events: {
    list: '/admin/communication/events',
    byId: (id: string) => `/admin/communication/events/${id}`,
  },
  gallery: {
    list: '/admin/communication/gallery',
    byId: (id: string) => `/admin/communication/gallery/${id}`,
  },
  vehicles: {
    list: '/admin/operations/vehicles',
    byId: (id: string) => `/admin/operations/vehicles/${id}`,
    status: (id: string) => `/admin/operations/vehicles/${id}/status`,
  },
  assignments: {
    list: '/admin/operations/assignments',
    status: (id: string) => `/admin/operations/assignments/${id}/status`,
  },
  messages: {
    list: '/admin/operations/messages',
    unread: '/admin/operations/messages/unread',
    byId: (id: string) => `/admin/operations/messages/${id}`,
  },
  settings: '/admin/settings',
  profile: '/admin/profile',
  profilePassword: '/admin/profile/password',
} as const;
```

- [ ] **Step 3: Create type re-exports**

```typescript
// apps/dashboard/src/api/types.ts
export type {
  ApiResponse,
  UserDTO,
  DepartmentDTO,
  StaffDTO,
  ResearchProgramDTO,
  ResearchProjectDTO,
  PublicationDTO,
  NewsDTO,
  EventDTO,
  GalleryMediaDTO,
  VehicleDTO,
  VehicleAssignmentDTO,
  ContactMessageDTO,
  SystemSettingsDTO,
  DashboardMetricsDTO,
} from '@tarcms/shared';

export type {
  LoginInput,
  DepartmentInput,
  StaffInput,
  ResearchProgramInput,
  ResearchProjectInput,
  PublicationInput,
  NewsInput,
  EventInput,
  VehicleInput,
  VehicleRequisitionInput,
  SystemSettingsInput,
} from '@tarcms/shared';
```

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/api/
git commit -m "feat(dashboard): add base API client with auth, endpoints, and types"
```

---

### Task 7: Create Dashboard App — Domain API Functions

**Files:**
- Create: `apps/dashboard/src/api/domains/auth.ts`
- Create: `apps/dashboard/src/api/domains/departments.ts`
- Create: `apps/dashboard/src/api/domains/staff.ts`
- Create: `apps/dashboard/src/api/domains/programs.ts`
- Create: `apps/dashboard/src/api/domains/projects.ts`
- Create: `apps/dashboard/src/api/domains/publications.ts`
- Create: `apps/dashboard/src/api/domains/news.ts`
- Create: `apps/dashboard/src/api/domains/events.ts`
- Create: `apps/dashboard/src/api/domains/gallery.ts`
- Create: `apps/dashboard/src/api/domains/vehicles.ts`
- Create: `apps/dashboard/src/api/domains/messages.ts`
- Create: `apps/dashboard/src/api/domains/settings.ts`
- Create: `apps/dashboard/src/api/domains/profile.ts`
- Create: `apps/dashboard/src/api/domains/dashboard.ts`

**Interfaces:**
- Consumes: `get`, `post`, `put`, `del` from `../client.ts`
- Produces: Typed async functions for each admin domain

- [ ] **Step 1: Create auth domain**

```typescript
// apps/dashboard/src/api/domains/auth.ts
import { post, get } from '../client';
import { endpoints } from '../endpoints';
import type { UserDTO, LoginInput } from '../types';

interface LoginResponse {
  token: string;
  user: UserDTO;
}

export function login(data: LoginInput): Promise<LoginResponse> {
  return post<LoginResponse>(endpoints.auth.login, data);
}

export function getProfile(): Promise<UserDTO> {
  return get<UserDTO>(endpoints.auth.me);
}
```

- [ ] **Step 2: Create CRUD domains (departments, staff, programs, projects, publications, news, events)**

Each follows the same pattern. Example for departments:

```typescript
// apps/dashboard/src/api/domains/departments.ts
import { get, post, put, del } from '../client';
import { endpoints } from '../endpoints';
import type { DepartmentDTO, DepartmentInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listDepartments(params?: ListParams): Promise<PaginatedResponse<DepartmentDTO>> {
  return get<PaginatedResponse<DepartmentDTO>>(endpoints.departments.list, { params });
}

export function getDepartment(id: string): Promise<DepartmentDTO> {
  return get<DepartmentDTO>(endpoints.departments.byId(id));
}

export function createDepartment(data: DepartmentInput): Promise<DepartmentDTO> {
  return post<DepartmentDTO>(endpoints.departments.list, data);
}

export function updateDepartment(id: string, data: Partial<DepartmentInput>): Promise<DepartmentDTO> {
  return put<DepartmentDTO>(endpoints.departments.byId(id), data);
}

export function deleteDepartment(id: string): Promise<void> {
  return del<void>(endpoints.departments.byId(id));
}
```

Create the same pattern for: staff, programs, projects, publications, news, events, gallery, vehicles, messages.

- [ ] **Step 3: Create settings and profile domains**

```typescript
// apps/dashboard/src/api/domains/settings.ts
import { get, put } from '../client';
import { endpoints } from '../endpoints';
import type { SystemSettingsDTO, SystemSettingsInput } from '../types';

export function getSettings(): Promise<SystemSettingsDTO> {
  return get<SystemSettingsDTO>(endpoints.settings);
}

export function updateSettings(data: SystemSettingsInput): Promise<SystemSettingsDTO> {
  return put<SystemSettingsDTO>(endpoints.settings, data);
}
```

```typescript
// apps/dashboard/src/api/domains/profile.ts
import { get, put } from '../client';
import { endpoints } from '../endpoints';
import type { UserDTO } from '../types';

interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

interface UpdatePasswordInput {
  current_password: string;
  new_password: string;
}

export function getProfile(): Promise<UserDTO> {
  return get<UserDTO>(endpoints.profile);
}

export function updateProfile(data: UpdateProfileInput): Promise<UserDTO> {
  return put<UserDTO>(endpoints.profile, data);
}

export function updatePassword(data: UpdatePasswordInput): Promise<void> {
  return put<void>(endpoints.profilePassword, data);
}
```

- [ ] **Step 4: Create dashboard metrics domain**

```typescript
// apps/dashboard/src/api/domains/dashboard.ts
import { get } from '../client';
import { endpoints } from '../endpoints';
import type { DashboardMetricsDTO } from '../types';

export function getMetrics(): Promise<DashboardMetricsDTO> {
  return get<DashboardMetricsDTO>(endpoints.dashboard.metrics);
}
```

- [ ] **Step 5: Create vehicles and assignments domains**

```typescript
// apps/dashboard/src/api/domains/vehicles.ts
import { get, post, put, del } from '../client';
import { endpoints } from '../endpoints';
import type { VehicleDTO, VehicleInput, VehicleAssignmentDTO, VehicleRequisitionInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listVehicles(params?: ListParams): Promise<PaginatedResponse<VehicleDTO>> {
  return get<PaginatedResponse<VehicleDTO>>(endpoints.vehicles.list, { params });
}

export function getVehicle(id: string): Promise<VehicleDTO> {
  return get<VehicleDTO>(endpoints.vehicles.byId(id));
}

export function createVehicle(data: VehicleInput): Promise<VehicleDTO> {
  return post<VehicleDTO>(endpoints.vehicles.list, data);
}

export function updateVehicleStatus(id: string, status: string): Promise<VehicleDTO> {
  return put<VehicleDTO>(endpoints.vehicles.status(id), { status });
}

export function deleteVehicle(id: string): Promise<void> {
  return del<void>(endpoints.vehicles.byId(id));
}

export function listAssignments(params?: ListParams): Promise<PaginatedResponse<VehicleAssignmentDTO>> {
  return get<PaginatedResponse<VehicleAssignmentDTO>>(endpoints.assignments.list, { params });
}

export function createAssignment(data: VehicleRequisitionInput): Promise<VehicleAssignmentDTO> {
  return post<VehicleAssignmentDTO>(endpoints.assignments.list, data);
}

export function updateAssignmentStatus(id: string, status: string): Promise<VehicleAssignmentDTO> {
  return put<VehicleAssignmentDTO>(endpoints.assignments.status(id), { status });
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/dashboard/src/api/domains/
git commit -m "feat(dashboard): add domain API functions for all admin endpoints"
```

---

### Task 8: Migrate Dashboard App — Update Imports

**Files:**
- Modify: All files in `apps/dashboard/src/features/*/` that use `useApiQuery`/`useApiMutation` or direct fetch
- Keep: `apps/dashboard/src/hooks/useApiQuery.ts` and `useApiMutation.ts` (refactor to use new client)

**Interfaces:**
- Consumes: New API client from `@/api/*`

- [ ] **Step 1: Refactor useApiQuery to use new client**

Update `apps/dashboard/src/hooks/useApiQuery.ts` to use the new `get` function from `@/api/client` instead of raw fetch.

- [ ] **Step 2: Refactor useApiMutation to use new client**

Update `apps/dashboard/src/hooks/useApiMutation.ts` to use the new `post`/`put`/`del` functions.

- [ ] **Step 3: Update direct fetch calls in LoginPage**

Replace the direct `fetch('/api/v1/auth/login')` call in `LoginPage.tsx` with the new `login()` function from `@/api/domains/auth`.

- [ ] **Step 4: Verify build passes**

```bash
npm run build --workspace=apps/dashboard
```

Expected: No errors

- [ ] **Step 5: Run tests**

```bash
npm run test --workspace=apps/dashboard
```

Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add apps/dashboard/src/
git commit -m "feat(dashboard): migrate to new API client"
```

---

### Task 9: Final Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run all workspace tests**

```bash
npm run test --workspace=apps/public --workspace=apps/dashboard --workspace=apps/server --workspace=packages/shared
```

Expected: All tests pass

- [ ] **Step 2: Run all builds**

```bash
npm run build --workspace=apps/public && npm run build --workspace=apps/dashboard
```

Expected: Both build successfully

- [ ] **Step 3: Run Biome lint**

```bash
npx @biomejs/biome check apps/public/src/api/ apps/dashboard/src/api/
```

Expected: No errors

- [ ] **Step 4: Verify seed runs cleanly**

```bash
cd apps/server && npm run db:seed
```

Expected: No errors, all tables populated

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final verification — seed, API clients, all tests passing"
```

- [ ] **Step 6: Push**

```bash
git push origin feat/public-website-redesign
```

---

## Summary

| Task | Description | Files Created |
|------|-------------|---------------|
| 1 | Expand server seed | 1 modified |
| 2 | Public base HTTP client | 3 created |
| 3 | Public domain API functions | 10 created |
| 4 | Public React Query hooks | 11 created |
| 5 | Migrate public app imports | ~20 modified, 11 deleted |
| 6 | Dashboard base HTTP client | 3 created |
| 7 | Dashboard domain API functions | 14 created |
| 8 | Migrate dashboard app | ~10 modified |
| 9 | Final verification | 0 |

**Total new files:** ~55 | **Modified:** ~30 | **Deleted:** 11
