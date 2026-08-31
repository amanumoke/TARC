# Research Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, modern, editorial research page for TARC with 10 distinct sections, research-specific header/footer, and full responsive design.

**Architecture:** Create a self-contained research feature under `apps/public/src/features/research/` with scoped CSS variables, section components, and a composition root. Conditionally render research-specific header/footer on `/research*` routes via route checks in existing navigation components.

**Tech Stack:** React 19, Tailwind CSS 3.4, shadcn/ui (Skeleton, Button, Sheet), Lucide icons, TanStack Query v5, React Router v6, DM Serif Display + Inter fonts

**Spec:** `docs/superpowers/specs/2026-08-29-research-page-design.md`

## Global Constraints

- Color palette: `#F5F5F0` bg, `#101712` dark, `#173B2B` forest, `#315B43` secondary, `#B58B45` accent, `#111511` text, `#6B716C` secondary text, `#DDDFDA` border
- Typography: DM Serif Display for editorial headings, Inter for UI/body
- Container: `max-w-[1440px]` with 48-64px desktop / 20-24px mobile padding
- Hero display: 80-110px desktop, 48-56px mobile, uppercase, tight line-height
- All images via Unsplash URLs (swappable later)
- Departments as programs via `useDepartments()` hook
- Respect `prefers-reduced-motion`
- No site-wide theme changes — research-scoped CSS only

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `features/research/research.css` | Scoped CSS variables + custom styles |
| `features/research/ResearchHero.tsx` | Split editorial hero section |
| `features/research/ResearchPrograms.tsx` | Editorial program list with hover images |
| `features/research/FeaturedProject.tsx` | Dark full-width featured project |
| `features/research/ProjectArchive.tsx` | Clean project list archive |
| `features/research/ResearchProcess.tsx` | Horizontal process timeline |
| `features/research/LatestPublications.tsx` | Editorial publication list |
| `features/research/FieldImageSection.tsx` | Full-width photo with text overlay |
| `features/research/ResearchCTA.tsx` | Final call-to-action section |
| `features/research/ResearchPage.tsx` | Composition root assembling all sections |
| `features/research/skeletons.tsx` | Loading skeleton components |

### Modified Files
| File | Change |
|------|--------|
| `styles/globals.css` | Add `.research-page` scoped CSS variables |
| `tailwind.config.ts` | Add `editorial` font family |

---

## Task Dependency Graph

| Task | Component | Depends On |
|------|-----------|------------|
| 1 | CSS Variables | None |
| 2 | Research Hero | Task 1 |
| 3 | Research Programs | Task 1 |
| 4 | Featured Project | Task 1 |
| 5 | Project Archive | Task 1 |
| 6 | Research Process | Task 1 |
| 7 | Latest Publications | Task 1 |
| 8 | Field Image | Task 1 |
| 9 | Research CTA | Task 1 |
| 10 | Page Composition | Tasks 2-9 |
| 11 | Loading Skeletons | Task 1 |
| 12 | Responsive Polish | Tasks 2-9 |
| 13 | Integration Test | All |

**Critical path:** 1 -> 2-9 (parallel) -> 10 -> 12 -> 13

---

### Task 1: Research Scoped CSS Variables

**Files:**
- Create: `apps/public/src/features/research/research.css`
- Modify: `apps/public/src/styles/globals.css` (add `@import` at top)

**Interfaces:**
- Consumes: None (foundation task)
- Produces: CSS class `.research-page` that scopes all research design tokens

- [ ] **Step 1: Create `research.css` with scoped variables**

```css
/* apps/public/src/features/research/research.css */

.research-page {
  --r-bg: #F5F5F0;
  --r-dark: #101712;
  --r-forest: #173B2B;
  --r-secondary: #315B43;
  --r-accent: #B58B45;
  --r-text: #111511;
  --r-text-secondary: #6B716C;
  --r-border: #DDDFDA;

  background-color: var(--r-bg);
  color: var(--r-text);
}

/* Program hover image reveal */
.research-program-row .program-image {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
  transition: opacity 400ms ease, transform 400ms ease;
}

.research-program-row:hover .program-image {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .research-program-row .program-image,
  .research-reveal {
    transition: none;
  }
  .research-program-row:hover .program-image {
    transform: none;
  }
  .research-reveal {
    opacity: 1;
    transform: none;
  }
}

/* Scroll reveal animation */
.research-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms ease, transform 600ms ease;
}

.research-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Add import to `globals.css`**

At the top of `apps/public/src/styles/globals.css`, before `@tailwind` layers:

```css
@import '../features/research/research.css';
```

- [ ] **Step 3: Add `font-editorial` to Tailwind config**

In `apps/public/tailwind.config.ts`, add to `theme.extend.fontFamily`:

```ts
editorial: ['"DM Serif Display"', 'serif'],
```

- [ ] **Step 4: Commit**

```bash
git add apps/public/src/features/research/research.css apps/public/src/styles/globals.css apps/public/tailwind.config.ts
git commit -m "feat(research): add scoped CSS variables and animation utilities"
```

---

### Task 2: Research Hero Section

**Files:**
- Create: `apps/public/src/features/research/ResearchHero.tsx`

**Interfaces:**
- Consumes: None (static content)
- Produces: `<ResearchHero />` split editorial hero

- [ ] **Step 1: Create `ResearchHero.tsx`**

```tsx
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResearchHero() {
  return (
    <section className="relative bg-[var(--r-bg)] pt-8 pb-16 lg:pt-12 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-6">
          Research
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[42%_1fr] gap-8 lg:gap-12 items-start">
          <div className="flex flex-col">
            <h1 className="font-editorial text-[48px] leading-[0.95] font-bold uppercase tracking-tight text-[var(--r-text)] sm:text-[64px] lg:text-[80px] xl:text-[100px]">
              We Study
              <br />
              What
              <br />
              Matters.
            </h1>

            <p className="mt-8 text-base lg:text-lg text-[var(--r-text-secondary)] max-w-md leading-relaxed">
              Agricultural research focused on real challenges, knowledge
              creation, and practical impact for Ethiopian farming communities.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button
                render={<Link to="/projects" />}
                className="bg-[var(--r-forest)] text-white hover:bg-[var(--r-secondary)] text-[13px] uppercase tracking-widest px-8 py-3 rounded-none inline-flex items-center gap-2"
              >
                Explore Research
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--r-text-secondary)] self-center">
                Tepi &middot; Ethiopia
              </span>
            </div>
          </div>

          <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
              alt="Ethiopian agricultural researchers inspecting crops in a research field"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/ResearchHero.tsx
git commit -m "feat(research): add split editorial hero section"
```

---

### Task 3: Research Programs Section

**Files:**
- Create: `apps/public/src/features/research/ResearchPrograms.tsx`

**Interfaces:**
- Consumes: `useDepartments()` from `@/api/hooks/useDepartments`
- Produces: `<ResearchPrograms />` editorial list with hover images

- [ ] **Step 1: Create `ResearchPrograms.tsx`**

```tsx
import { useDepartments } from '@/api/hooks/useDepartments';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROGRAM_DESCRIPTIONS: Record<string, string> = {
  'Crop Improvement': 'Improving productivity, resilience and crop performance through advanced research.',
  'Plant Protection': 'Research focused on plant health, disease management and protection systems.',
  'Soil & Water': 'Sustainable soil and water management for agricultural development.',
};

const PROGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
];

export function ResearchPrograms() {
  const { data: departments, isLoading } = useDepartments();

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 bg-[var(--r-border)]/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const programs = departments || [];

  return (
    <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-4">
            Research Programs
          </p>
          <h2 className="font-editorial text-[32px] lg:text-[48px] font-bold uppercase tracking-tight text-[var(--r-text)] leading-[0.95]">
            The Areas
            <br />
            We Explore.
          </h2>
        </div>

        <div>
          {programs.map((dept, index) => {
            const num = String(index + 1).padStart(2, '0');
            const description = PROGRAM_DESCRIPTIONS[dept.name] || 'Research and innovation for sustainable agricultural development.';

            return (
              <Link
                key={dept.id}
                to={`/research/${dept.code}`}
                className="research-program-row group flex items-start gap-6 lg:gap-12 py-8 border-b border-[var(--r-border)] transition-colors hover:border-[var(--r-text)]"
              >
                <span className="text-[48px] lg:text-[64px] font-light text-[var(--r-text-secondary)]/30 leading-none min-w-[80px]">
                  {num}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[20px] lg:text-[28px] font-semibold uppercase tracking-wide text-[var(--r-text)]">
                    {dept.name}
                  </h3>
                  <p className="mt-2 text-sm lg:text-base text-[var(--r-text-secondary)] max-w-lg">
                    {description}
                  </p>
                </div>

                <div className="hidden lg:block relative w-40 h-28 flex-shrink-0 overflow-hidden">
                  <img
                    src={PROGRAM_IMAGES[index % PROGRAM_IMAGES.length]}
                    alt={`${dept.name} research`}
                    className="program-image w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <ArrowRight className="h-5 w-5 text-[var(--r-text-secondary)] group-hover:text-[var(--r-forest)] transition-colors mt-2 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/ResearchPrograms.tsx
git commit -m "feat(research): add editorial program list with hover images"
```

---

### Task 4: Featured Project Section

**Files:**
- Create: `apps/public/src/features/research/FeaturedProject.tsx`

**Interfaces:**
- Consumes: `useProjects({ limit: 1 })` from `@/api/hooks/useProjects`
- Produces: `<FeaturedProject />` dark full-width section

- [ ] **Step 1: Create `FeaturedProject.tsx`**

```tsx
import { Button } from '@/components/ui/button';
import { useProjects } from '@/api/hooks/useProjects';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedProject() {
  const { data, isLoading } = useProjects({ limit: 1 });

  if (isLoading) {
    return (
      <section className="bg-[var(--r-dark)] py-20 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="h-96 bg-white/5 animate-pulse" />
        </div>
      </section>
    );
  }

  const project = data?.data?.[0];
  if (!project) return null;

  const words = project.title.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <section className="bg-[var(--r-dark)] text-white py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="flex items-center justify-between mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Featured Project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-10 lg:gap-16 items-center">
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80"
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="font-editorial text-[36px] lg:text-[56px] font-bold uppercase leading-[0.95] tracking-tight">
              {line1}
              <br />
              {line2}
            </h2>

            <div className="mt-8 flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-white/50">
              <span>{project.departmentName || 'Research'}</span>
              <span>
                {project.startDate?.slice(0, 4)} — {project.endDate?.slice(0, 4) || 'Present'}
              </span>
            </div>

            <Button
              render={<Link to="/projects" />}
              className="mt-10 bg-transparent border border-white/30 text-white hover:bg-white/10 text-[13px] uppercase tracking-widest px-8 py-3 rounded-none inline-flex items-center gap-2"
            >
              Explore Project
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/FeaturedProject.tsx
git commit -m "feat(research): add dark featured project section"
```

---

### Task 5: Project Archive Section

**Files:**
- Create: `apps/public/src/features/research/ProjectArchive.tsx`

**Interfaces:**
- Consumes: `useProjects({ limit: 6 })` from `@/api/hooks/useProjects`
- Produces: `<ProjectArchive />` clean list

- [ ] **Step 1: Create `ProjectArchive.tsx`**

```tsx
import { useProjects } from '@/api/hooks/useProjects';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProjectArchive() {
  const { data, isLoading } = useProjects({ limit: 6 });

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 bg-[var(--r-border)]/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const projects = data?.data || [];

  if (projects.length === 0) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 text-center">
          <p className="text-[var(--r-text-secondary)]">No research projects available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-4">
              Research Projects
            </p>
            <h2 className="font-editorial text-[32px] lg:text-[48px] font-bold uppercase tracking-tight text-[var(--r-text)] leading-[0.95]">
              Project Archive
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden sm:flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[var(--r-forest)] hover:text-[var(--r-secondary)] transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          {projects.map((project, index) => {
            const num = String(index + 1).padStart(2, '0');
            return (
              <div
                key={project.id}
                className="flex items-start gap-6 lg:gap-12 py-6 border-b border-[var(--r-border)]"
              >
                <span className="text-[32px] lg:text-[40px] font-light text-[var(--r-text-secondary)]/30 leading-none min-w-[60px]">
                  {num}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] lg:text-[20px] font-semibold text-[var(--r-text)] uppercase tracking-wide">
                    {project.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-4 text-[12px] uppercase tracking-widest text-[var(--r-text-secondary)]">
                    <span>{project.departmentName || 'Research'}</span>
                    <span>
                      {project.startDate?.slice(0, 4)}—{project.endDate?.slice(0, 4) || 'Present'}
                    </span>
                  </div>
                </div>

                <Link
                  to="/projects"
                  className="hidden sm:flex items-center gap-1 text-[12px] font-medium uppercase tracking-widest text-[var(--r-text-secondary)] hover:text-[var(--r-forest)] transition-colors flex-shrink-0"
                >
                  View
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>

        <Link
          to="/projects"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-[13px] font-medium uppercase tracking-widest text-[var(--r-forest)]"
        >
          View All Projects
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/ProjectArchive.tsx
git commit -m "feat(research): add clean project archive list"
```

---

### Task 6: Research Process Section

**Files:**
- Create: `apps/public/src/features/research/ResearchProcess.tsx`

**Interfaces:**
- Consumes: None (static content)
- Produces: `<ResearchProcess />` horizontal timeline with background image

- [ ] **Step 1: Create `ResearchProcess.tsx`**

```tsx
import { Search, Microscope, Lightbulb, CheckCircle, FileText, TrendingUp } from 'lucide-react';

const STEPS = [
  { icon: Search, label: 'Field', word: 'Observe' },
  { icon: Microscope, label: 'Research', word: 'Study' },
  { icon: Lightbulb, label: 'Develop', word: 'Innovate' },
  { icon: CheckCircle, label: 'Test', word: 'Validate' },
  { icon: FileText, label: 'Output', word: 'Share' },
  { icon: TrendingUp, label: 'Impact', word: 'Improve' },
];

export function ResearchProcess() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[var(--r-dark)]/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
            Our Process
          </p>
          <h2 className="font-editorial text-[32px] lg:text-[56px] font-bold uppercase tracking-tight text-white leading-[0.95]">
            From Field
            <br />
            To Knowledge.
          </h2>
        </div>

        <div className="hidden lg:flex items-start justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <step.icon className="h-6 w-6 text-[var(--r-accent)] mb-3" />
                <span className="text-[13px] font-semibold uppercase tracking-widest text-white/90">
                  {step.label}
                </span>
                <span className="text-[11px] text-white/40 mt-1">{step.word}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-full h-px bg-white/15 flex-shrink-0 mx-2 mt-[-20px]" />
              )}
            </div>
          ))}
        </div>

        <div className="lg:hidden flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <step.icon className="h-5 w-5 text-[var(--r-accent)]" />
                {i < STEPS.length - 1 && (
                  <div className="w-px h-12 bg-white/15 mt-2" />
                )}
              </div>
              <div>
                <span className="text-[13px] font-semibold uppercase tracking-widest text-white/90">
                  {step.label}
                </span>
                <span className="text-[11px] text-white/40 ml-3">{step.word}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/ResearchProcess.tsx
git commit -m "feat(research): add field-to-knowledge process timeline"
```

---

### Task 7: Latest Publications Section

**Files:**
- Create: `apps/public/src/features/research/LatestPublications.tsx`

**Interfaces:**
- Consumes: `usePublications({ limit: 5 })` from `@/api/hooks/usePublications`
- Produces: `<LatestPublications />` editorial list

- [ ] **Step 1: Create `LatestPublications.tsx`**

```tsx
import { usePublications } from '@/api/hooks/usePublications';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LatestPublications() {
  const { data, isLoading } = usePublications({ limit: 5 });

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-24 bg-[var(--r-border)]/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const publications = data || [];

  return (
    <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-4">
              Latest Research Outputs
            </p>
            <h2 className="font-editorial text-[32px] lg:text-[48px] font-bold uppercase tracking-tight text-[var(--r-text)] leading-[0.95]">
              Publications
            </h2>
          </div>
          <Link
            to="/publications"
            className="hidden sm:flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[var(--r-forest)] hover:text-[var(--r-secondary)] transition-colors"
          >
            All Publications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {publications.length === 0 ? (
          <p className="text-[var(--r-text-secondary)]">No publications available yet.</p>
        ) : (
          <div>
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="flex items-start justify-between gap-6 py-6 border-b border-[var(--r-border)]"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-accent)]">
                    {pub.publicationYear}
                  </span>
                  <h3 className="mt-2 text-[16px] lg:text-[20px] font-medium text-[var(--r-text)] leading-snug">
                    {pub.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-[12px] text-[var(--r-text-secondary)]">
                    <span>{pub.authors?.slice(0, 2).join(', ')}</span>
                    <span className="text-[var(--r-border)]">&middot;</span>
                    <span className="uppercase tracking-widest">{pub.publicationType}</span>
                  </div>
                </div>

                <Link
                  to="/publications"
                  className="hidden sm:flex items-center gap-1 text-[12px] font-medium uppercase tracking-widest text-[var(--r-text-secondary)] hover:text-[var(--r-forest)] transition-colors flex-shrink-0"
                >
                  Read
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/LatestPublications.tsx
git commit -m "feat(research): add editorial publications list"
```

---

### Task 8: Field Image Section

**Files:**
- Create: `apps/public/src/features/research/FieldImageSection.tsx`

**Interfaces:**
- Consumes: None (static content)
- Produces: `<FieldImageSection />` full-width photo with text overlay

- [ ] **Step 1: Create `FieldImageSection.tsx`**

```tsx
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FieldImageSection() {
  return (
    <section className="relative h-[60vh] lg:h-[80vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
        alt="Agricultural research field in Ethiopian highlands"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[var(--r-dark)]/60" />

      <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-16 mx-auto max-w-[1440px]">
        <h2 className="font-editorial text-[40px] lg:text-[72px] xl:text-[96px] font-bold uppercase tracking-tight text-white leading-[0.9]">
          Research
          <br />
          Happens
          <br />
          In The Field.
        </h2>

        <Link
          to="/gallery"
          className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-white/80 hover:text-white transition-colors self-start"
        >
          Explore Gallery
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/FieldImageSection.tsx
git commit -m "feat(research): add full-width field image section"
```

---

### Task 9: Research CTA Section

**Files:**
- Create: `apps/public/src/features/research/ResearchCTA.tsx`

**Interfaces:**
- Consumes: None (static content)
- Produces: `<ResearchCTA />` final call-to-action

- [ ] **Step 1: Create `ResearchCTA.tsx`**

```tsx
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResearchCTA() {
  return (
    <section className="py-24 lg:py-40 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <h2 className="font-editorial text-[40px] lg:text-[72px] xl:text-[96px] font-bold uppercase tracking-tight text-[var(--r-text)] leading-[0.9]">
          Want To
          <br />
          Know More?
        </h2>

        <div className="mt-12 flex flex-col sm:flex-row items-start gap-6">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-widest text-[var(--r-forest)] hover:text-[var(--r-secondary)] transition-colors group"
          >
            Explore Research
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-widest text-[var(--r-text-secondary)] hover:text-[var(--r-text)] transition-colors group"
          >
            Contact TARC
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/ResearchCTA.tsx
git commit -m "feat(research): add final CTA section"
```

---

### Task 10: Research Page Composition

**Files:**
- Create: `apps/public/src/features/research/ResearchPage.tsx`
- Modify: `apps/public/src/features/research/ResearchRoutes.tsx`

**Interfaces:**
- Consumes: All section components from Tasks 2-9
- Produces: Complete `<ResearchPage />` assembled from all sections, wired into routes

- [ ] **Step 1: Create `ResearchPage.tsx`**

```tsx
import { useEffect } from 'react';
import { ResearchHero } from './ResearchHero';
import { ResearchPrograms } from './ResearchPrograms';
import { FeaturedProject } from './FeaturedProject';
import { ProjectArchive } from './ProjectArchive';
import { ResearchProcess } from './ResearchProcess';
import { LatestPublications } from './LatestPublications';
import { FieldImageSection } from './FieldImageSection';
import { ResearchCTA } from './ResearchCTA';

export function ResearchPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="research-page">
      <ResearchHero />
      <ResearchPrograms />
      <FeaturedProject />
      <ProjectArchive />
      <ResearchProcess />
      <LatestPublications />
      <FieldImageSection />
      <ResearchCTA />
    </div>
  );
}
```

- [ ] **Step 2: Update `ResearchRoutes.tsx`**

```tsx
import { Route, Routes } from 'react-router-dom';
import { ResearchPage } from './ResearchPage';
import { ResearchDetailPage } from './ResearchDetailPage';

export function ResearchRoutes() {
  return (
    <Routes>
      <Route index element={<ResearchPage />} />
      <Route path=":slug" element={<ResearchDetailPage />} />
    </Routes>
  );
}
```

- [ ] **Step 3: Verify full page renders**

Navigate to `/research` — all 8 sections should render in order.

- [ ] **Step 4: Commit**

```bash
git add apps/public/src/features/research/ResearchPage.tsx apps/public/src/features/research/ResearchRoutes.tsx
git commit -m "feat(research): assemble complete research page from sections"
```

---

### Task 11: Loading Skeletons

**Files:**
- Create: `apps/public/src/features/research/skeletons.tsx`

**Interfaces:**
- Consumes: shadcn `Skeleton` component
- Produces: Reusable skeleton components

- [ ] **Step 1: Create `skeletons.tsx`**

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export function HeroSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-16">
      <Skeleton className="h-4 w-24 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton className="h-24 w-3/4" />
          <Skeleton className="h-20 w-1/2" />
          <Skeleton className="h-12 w-40" />
        </div>
        <Skeleton className="aspect-[3/4]" />
      </div>
    </div>
  );
}

export function ProgramsSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-20">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-12 w-64 mb-12" />
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

export function PublicationsSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-20">
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-12 w-48 mb-12" />
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/public/src/features/research/skeletons.tsx
git commit -m "feat(research): add shared loading skeleton components"
```

---

### Task 12: Responsive Polish

**Files:**
- Modify: Any section files that need responsive fixes

**Interfaces:**
- Consumes: All section components
- Produces: Polished responsive behavior

- [ ] **Step 1: Test at mobile (375px), tablet (768px), desktop (1440px)**

Check each section:
- Hero: stacks on mobile, split on desktop
- Programs: vertical stack on mobile
- Featured project: image above text on mobile
- Process: vertical on mobile, horizontal on desktop
- Publications: full-width on mobile
- Field image: text readable at all sizes
- CTA: stacks on mobile

- [ ] **Step 2: Fix any issues found**

- [ ] **Step 3: Commit**

```bash
git add apps/public/src/features/research/
git commit -m "feat(research): polish responsive behavior across breakpoints"
```

---

### Task 13: Integration Test

**Files:**
- Verify all components render correctly

**Interfaces:**
- Consumes: All previous tasks
- Produces: Fully working research page

- [ ] **Step 1: Start dev server and test**

```bash
npm run dev --workspace=@tarcms/public
```

Navigate to `/research` — verify all 8 sections render.
Navigate to `/` — verify standard header/footer still works.

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck --workspace=@tarcms/public
```

- [ ] **Step 3: Run biome check**

```bash
npx biome check apps/public/src/features/research/
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(research): complete premium editorial research page"
```
