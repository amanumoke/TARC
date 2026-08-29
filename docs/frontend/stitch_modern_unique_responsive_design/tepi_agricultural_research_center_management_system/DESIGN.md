---
name: Tepi Agricultural Research Center Management System
colors:
  surface: '#fefae0'
  surface-dim: '#dedbc2'
  surface-bright: '#fefae0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f4db'
  surface-container: '#f2efd5'
  surface-container-high: '#ede9cf'
  surface-container-highest: '#e7e3ca'
  on-surface: '#1d1c0d'
  on-surface-variant: '#414844'
  inverse-surface: '#323120'
  inverse-on-surface: '#f5f1d8'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#7d562d'
  on-secondary: '#ffffff'
  secondary-container: '#ffca98'
  on-secondary-container: '#7a532a'
  tertiary: '#002d1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#00452e'
  on-tertiary-container: '#75b393'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#f0bd8b'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#623f18'
  tertiary-fixed: '#b1f0ce'
  tertiary-fixed-dim: '#95d4b3'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#0e5138'
  background: '#fefae0'
  on-background: '#1d1c0d'
  surface-variant: '#e7e3ca'
  deep-forest: '#1B4332'
  canopy: '#2D6A4F'
  fern: '#52B788'
  earth: '#D4A373'
  cream: '#FEFAE0'
  surface-muted: '#F2EED7'
typography:
  display-lg:
    fontFamily: DM Serif Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-lg:
    fontFamily: DM Serif Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: DM Serif Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system for TARCMS is rooted in the intersection of **Scientific Precision** and **Ecological Stewardship**. It captures the identity of the Tepi Agricultural Research Center by blending the professional rigor of a government research institution with the organic, lush environment of the Sheka highlands in Southwest Ethiopia.

The aesthetic follows a **Modern Corporate** approach infused with **Organic Minimalism**. This is achieved through:
- **Scientific Authority:** Structured grids and high-contrast information density for the administrative dashboard.
- **Ecological Narrative:** Subtle topographic contour patterns (inspired by the Sheka terrain) used as background overlays to break the "sterile" feel of standard SaaS products.
- **Trustworthy Warmth:** Use of "Cream" as a primary background surface instead of pure white to reduce eye strain and evoke a natural, paper-like quality suitable for long-form research reading.

## Colors

The palette is a "Biophilic Professional" scheme. 

- **Primary (Deep Forest):** Used for primary navigation, high-level headers, and core brand moments. It conveys stability and institutional authority.
- **Secondary (Earth):** Used sparingly as an accent for call-to-actions (CTAs), special highlights, and to represent the literal soil/ground of agricultural research.
- **Tertiary (Canopy/Fern):** Applied to success states, data visualization, and progress indicators.
- **Neutral (Cream):** The primary surface color. This differentiates the portal from generic "tech" platforms, providing a warm, approachable backdrop for complex data.

**Color Usage:**
- **Dashboard:** Relies more on `Deep Forest` and `Canopy` for a focused, efficient environment.
- **Public Portal:** Utilizes `Cream` and `Fern` more extensively to feel welcoming and open to the community.

## Typography

The typography strategy creates a clear distinction between **Storytelling** and **Utility**.

- **DM Serif Display:** Reserved for high-level headings, hero sections, and page titles. Its elegant serifs project the "Academic Authority" of the research center.
- **Inter:** Used for all functional UI elements, body copy, and data tables. It ensures maximum legibility for researchers handling dense data.

**Hierarchy Rules:**
- Use `display-lg` exclusively for Home Page heroes.
- Use `label-md` with `0.02em` letter spacing for all navigation items and table headers to enhance scanability.
- Avoid using DM Serif Display for text smaller than 24px to maintain readability.

## Layout & Spacing

The system uses a **12-column Fluid Grid** for the public portal and a **Fixed Sidebar / Fluid Content** model for the administrative dashboard.

**Spacing Philosophy:**
- **Generous Whitespace:** Inspired by the openness of the Sheka highlands, sections should have significant vertical separation (80px - 120px on desktop) to allow the topographic patterns to breathe.
- **Rhythm:** All margins and paddings are derived from an 8px base unit. 
- **Dashboard Density:** In the management interface, the spacing unit can be halved (4px) for data-heavy tables, while maintaining 24px padding within cards to ensure a premium feel.

**Breakpoints:**
- **Mobile (< 640px):** Single column, 16px side margins.
- **Tablet (640px - 1024px):** 8-column grid, 24px margins.
- **Desktop (> 1024px):** 12-column grid, 48px margins.

## Elevation & Depth

To maintain the "Realistic but Clean" aesthetic, elevation is achieved through **Tonal Layering** and **Subtle Shadows** rather than aggressive skeuomorphism.

- **Surface Strategy:** Backgrounds use `Cream`. Content containers (cards) use pure `#FFFFFF` to "pop" from the background.
- **Shadow Profile:** Use extremely soft, long shadows with a slight tint of `Deep Forest` (e.g., `rgba(27, 67, 50, 0.08)`) to give the impression of physical paper resting on a wooden desk.
- **The Topographic Layer:** Contour line SVGs should be placed at the lowest Z-index, rendered in `Earth` at 10-15% opacity. They should appear to be "watermarked" into the background rather than floating.
- **Interactive Depth:** Buttons and interactive cards should use a subtle 2px "lift" on hover (increased shadow spread) to provide tactile feedback.

## Shapes

The shape language reflects the "Fern" and "Canopy" concepts—organic and soft, yet structured.

- **Primary Containers:** 0.5rem (8px) corner radius provides a modern, friendly feel without looking "childish."
- **Interactive Elements:** Buttons and Chips should use `rounded-lg` (16px) or `rounded-xl` (24px) to create a soft, organic "pebble" feel that contrasts against the structured 12-column grid.
- **Dashboard Icons:** Should be housed in rounded-square containers to maintain a sense of scientific organization.

## Components

### Buttons
- **Primary:** `Deep Forest` background with `Cream` text. Rounded-lg (16px).
- **Secondary:** `Earth` border (2px) with `Deep Forest` text. 
- **Actionable:** High-efficiency buttons in the dashboard use a slightly tighter padding and `Inter Bold`.

### Cards
- **Research Cards:** Feature a top border of 4px in `Fern` or `Canopy`. Content is set against a white background with a `Soft` shadow.
- **KPI Cards (Dashboard):** Use a subtle topographic pattern fragment in the bottom right corner as a decorative element.

### Inputs & Fields
- Use "Soft" (4px) rounded corners. 
- Backgrounds should be a shade darker than the main surface (`#F2EED7`) to clearly define the input area.
- Focus state: 2px solid `Canopy`.

### Lists & Tables
- **Zebra Striping:** Use `Cream` and `Surface-Muted` for row alternation.
- **Headers:** `Deep Forest` text, uppercase, `label-md` typography.

### Specialized Components
- **Topographic Hero:** A full-width section with animated SVG contour lines that move slightly on mouse hover, creating a dynamic, modern entrance for the public portal.
- **Status Badges:** Use `Fern` (Success), `Earth` (Pending), and a muted Red (Error), all with low-opacity backgrounds and high-opacity text.