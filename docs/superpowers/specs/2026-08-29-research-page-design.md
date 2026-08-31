# TARCMS Research Page — Design Spec

## Overview

Premium, modern, editorial research page for Tepi Agricultural Research Center (TARC). The page communicates **Research → Field → Knowledge → Impact** through typography, photography, and editorial composition — not through generic agricultural UI patterns.

**Visual target:** Minimal. Modern. Scientific. Human. Editorial. African. Premium.

## Scope

- New research page sections (hero, programs, featured project, archive, process, publications, field image, CTA)
- Research-page-specific header and footer (replaces existing header/footer only on `/research*` routes)
- Existing header/footer unchanged for all other pages
- Departments used as "Research Programs" (via `useDepartments` hook)
- Unsplash URLs for hero/section images during development

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Header/footer | Research-specific, conditional on route | Premium research feel without affecting other pages |
| Programs data | Departments (`useDepartments`) | Existing data model, departments have `code` and `description` |
| Images | Unsplash URLs (swappable) | Real agricultural research photography |
| Color system | New palette (below) | Research-page-specific, overrides CSS vars within research sections only |
| Typography | DM Serif Display (editorial headings) + Inter (UI) | Already in project, add display scale |
| Container | `max-w-[1440px]` with 48-64px padding | Large editorial width |

## Color System (Research Page Sections)

Applied via CSS variables within `.research-page` scope to avoid site-wide impact:

| Token | Value | Usage |
|-------|-------|-------|
| `--research-bg` | `#F5F5F0` | Warm off-white background |
| `--research-dark` | `#101712` | Primary dark, featured section bg |
| `--research-forest` | `#173B2B` | Forest green |
| `--research-secondary` | `#315B43` | Secondary green |
| `--research-accent` | `#B58B45` | Gold accent (sparingly) |
| `--research-text` | `#111511` | Primary text |
| `--research-text-secondary` | `#6B716C` | Secondary text |
| `--research-border` | `#DDDFDA` | Border color |

## Typography Scale

| Element | Size | Weight | Transform | Font |
|---------|------|--------|-----------|------|
| Hero display | 80-110px desktop, 48-56px mobile | 700 | Uppercase | DM Serif Display |
| Section title | 48-64px desktop, 32-40px mobile | 700 | Uppercase | DM Serif Display |
| Program number | 64-80px | 300 | Normal | Inter (light) |
| Program title | 24-32px | 600 | Uppercase | Inter |
| Body | 16-18px | 400 | Normal | Inter |
| Metadata/label | 11-13px | 600 | Uppercase, tracking-wide | Inter |
| CTA link | 14-16px | 500 | Normal | Inter |

## Page Sections

### 1. Research Header (conditional on `/research*`)

- Minimal premium header, 72-84px height
- Logo left, nav center/right, Contact CTA right
- Subtle bottom border, no heavy shadow
- On scroll: solid bg, thin border, optional blur
- Mobile: TARC + MENU (shadcn Sheet)

### 2. Research Hero — Split Editorial

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│ RESEARCH                                                     │
│                                                              │
│ WE STUDY                  ┌────────────────────────────────┐  │
│ WHAT                      │                                │  │
│ MATTERS.                  │       HERO IMAGE (55-60%)      │  │
│                           │                                │  │
│ Description text          │                                │  │
│                           └────────────────────────────────┘  │
│                                                              │
│ EXPLORE RESEARCH →                       TEPI · ETHIOPIA     │
└──────────────────────────────────────────────────────────────┘
```

- Text area: 40-45% width, hero image: 55-60%
- Image is tall (aspect-ratio ~3:4 or 4:5)
- Unsplash agricultural research image
- Hero text: uppercase, tight line-height, negative letter-spacing

### 3. Research Programs — Editorial List

Large editorial list, NOT cards. Each row:
- Large number (01, 02, etc.)
- Title (uppercase)
- Description (1-2 lines)
- Thin separator line between rows
- Hover: floating image appears (desktop only, 300-500ms opacity+translate)
- Mobile: image displayed inline, no hover

Data: `useDepartments()` hook, mapped to program format.

### 4. Featured Project — Dark Full-Width

- Background: `#101712`
- Large image (left/center)
- White/off-white text
- Accent color only for tiny metadata
- Project counter: `01 / 08`
- CTA: `EXPLORE PROJECT →`

Data: First project from `useProjects({ limit: 1 })`.

### 5. Research Project Archive — Clean List

```
number | title | category | date | action
```

- NOT cards
- Grid columns for metadata
- Desktop: horizontal layout
- Mobile: stacked metadata
- `VIEW ALL →` link to `/projects`

Data: `useProjects({ limit: 6 })`.

### 6. From Field to Knowledge — Process

- Horizontal process with thin connecting lines
- 6 stages: Field → Research → Develop → Test → Output → Impact
- Each: small Lucide icon + title + one-word description
- Photographic background with dark overlay
- Mobile: vertical progression

### 7. Publications — Editorial List

- Year-grouped list
- Title, authors, type, year
- `READ →` action
- NOT publication cards
- `ALL PUBLICATIONS →` link

Data: `usePublications({ limit: 5 })`.

### 8. Full-Width Field Image

- Dramatic full-width photograph
- Text overlay: "RESEARCH HAPPENS IN THE FIELD."
- `EXPLORE GALLERY →` link
- Unsplash agricultural field image

### 9. Final CTA

- Huge typography: "WANT TO KNOW MORE?"
- Two simple links: `EXPLORE RESEARCH →` and `CONTACT TARC →`
- No cards, no gradients

### 10. Research Footer (conditional on `/research*`)

- Dark green background (`#173B2B`)
- 4-column grid: TARC info, Research, About, Contact
- Copyright bar
- Sophisticated, not overloaded

## Responsive Breakpoints

| Breakpoint | Width | Padding | Notes |
|------------|-------|---------|-------|
| Desktop | >1024px | 48-64px | Full editorial layout |
| Tablet | 768-1024px | 32px | Adjusted grid |
| Mobile | <768px | 20-24px | Stacked, vertical process |

## Interactions

- Program row hover: image reveal (opacity + translate, 300-500ms)
- Scroll reveal: fade-in for sections (IntersectionObserver)
- Header scroll: bg solid + border
- Image scale on hover: 1 → 1.03
- Arrow movement on CTAs
- Respect `prefers-reduced-motion`

## Loading States

- Skeleton components for programs, projects, publications
- Use existing shadcn `Skeleton` component
- No layout shifts

## Error/Empty States

- Error: "Unable to load [content]. Please try again." + retry button
- Empty: "No [content] available yet." minimal message

## Files to Create/Modify

### New Files
- `apps/public/src/features/research/ResearchHero.tsx`
- `apps/public/src/features/research/ResearchPrograms.tsx`
- `apps/public/src/features/research/FeaturedProject.tsx`
- `apps/public/src/features/research/ProjectArchive.tsx`
- `apps/public/src/features/research/ResearchProcess.tsx`
- `apps/public/src/features/research/LatestPublications.tsx`
- `apps/public/src/features/research/FieldImageSection.tsx`
- `apps/public/src/features/research/ResearchCTA.tsx`
- `apps/public/src/features/research/ResearchFooter.tsx`
- `apps/public/src/features/research/ResearchHeader.tsx`
- `apps/public/src/features/research/ResearchPage.tsx` (composition root)
- `apps/public/src/features/research/research.css` (scoped styles)

### Modified Files
- `apps/public/src/App.tsx` — conditional header/footer on research routes
- `apps/public/src/styles/globals.css` — research-scoped CSS variables
- `apps/public/src/components/navigation/PublicHeader.tsx` — add route check for research variant
- `apps/public/src/components/navigation/PublicFooter.tsx` — add route check for research variant

### Unsplash Image URLs
- Hero: Ethiopian agricultural researchers in field
- Process background: Research plot / crop field
- Field image section: Researchers examining crops
- Program hover images: One per program (4 departments)
