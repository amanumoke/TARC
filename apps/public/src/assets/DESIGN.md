---
name: TARCMS Design Framework
colors:
  surface: '#f9faf6'
  surface-dim: '#dadad7'
  surface-bright: '#f9faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f1'
  surface-container: '#eeeeeb'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f0f1ee'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#2c694e'
  on-secondary: '#ffffff'
  secondary-container: '#aeeecb'
  on-secondary-container: '#316e52'
  tertiary: '#002d1b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00452c'
  on-tertiary-container: '#53b889'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#b1f0ce'
  secondary-fixed-dim: '#95d4b3'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#0e5138'
  tertiary-fixed: '#92f7c3'
  tertiary-fixed-dim: '#75daa8'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005235'
  background: '#f9faf6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3e0'
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
  headline-md:
    fontFamily: DM Serif Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  headline-sm:
    fontFamily: DM Serif Display
    fontSize: 20px
    fontWeight: '400'
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: DM Serif Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  sidebar-width: 280px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for the **Tepi Agricultural Research Center Management System (TARCMS)**, a platform that balances authoritative governmental oversight with the precision of scientific research. The brand personality is **grounded, institutional, and precise**, reflecting the center's role in the Sheka highlands of Southwest Ethiopia.

The aesthetic follows a **Corporate / Modern** style with **Tactile** influences derived from the local geography. The interface utilizes high-quality whitespace and structured data density to ensure complex research information remains accessible.

**Key Visual Identifiers:**
- **Topographic Textures:** Subtle background overlays using contour line patterns at 5% opacity to evoke the highland landscape.
- **Agricultural Motifs:** Use of organic iconography (coffee beans, spice leaves, soil layers) for category-specific navigation and KPIs.
- **Professionalism:** A focus on data integrity through high-legibility typography and a systematic approach to information hierarchy.

## Colors

The palette is derived from the natural environment of Tepi—integrating deep forest greens with earthy soil tones and a soft, cream-based surface to reduce eye strain during long research sessions.

- **Deep Forest (#1B4332):** Used for primary navigation, headers, and authoritative UI elements.
- **Canopy (#2D6A4F):** Used for primary actions, active states, and secondary navigation.
- **Fern (#52B788):** Utilized for positive status indicators, progress bars, and success messaging.
- **Earth (#D4A373):** Reserved for subtle details, dividers in specific "Field" modules, and earthy highlights that differentiate research sectors.
- **Cream (#FEFAE0):** The primary surface color, providing a warm, organic alternative to stark white.
- **Neutral Greys:** A range of cool greys is used for borders (#E2E8F0) and secondary text (#64748B) to maintain professional contrast levels.

## Typography

This design system uses a dual-font strategy to balance tradition with functionality. 

- **DM Serif Display** is used for page titles and section headers. Its high-contrast serifs provide a sense of established authority and "published" research quality.
- **Inter** handles all functional UI, body copy, and data display. Its neutral, grotesque letterforms ensure clarity in high-density tables and forms.

**Usage Rules:**
- All numeric data in tables should use `Inter` with tabular lining figures enabled for vertical alignment.
- Titles should never be all-caps when using `DM Serif Display`.
- Labels (tags, table headers) use `Inter` at SemiBold weight with slight tracking for improved scannability.

## Layout & Spacing

The system employs a **Fixed Grid** model for desktop dashboards to ensure data visualization components maintain consistent aspect ratios.

- **Sidebar Navigation:** A fixed 280px left-hand navigation bar using the **Deep Forest** color.
- **Main Canvas:** A centered container with a max-width of 1440px for wide-screen readability.
- **Grid System:** A 12-column grid with 24px gutters.
- **Responsive Behavior:** 
    - **Desktop:** Sidebar visible, 32px page margins.
    - **Tablet:** Sidebar collapses to an icon-only rail or drawer, 24px margins.
    - **Mobile:** Single column flow, 16px margins, bottom-sheet menus for CRUD actions.
- **Vertical Rhythm:** Spacing between sections follows a 8px linear scale (8, 16, 24, 32, 48, 64).

## Elevation & Depth

To maintain a "Professional / Data-driven" feel, this design system avoids heavy shadows in favor of **Tonal Layers** and subtle depth markers.

- **Level 0 (Base):** The Cream (#FEFAE0) background.
- **Level 1 (Cards/Surface):** White (#FFFFFF) surfaces with a 1px border (#E2E8F0). Used for table containers and content blocks.
- **Level 2 (Hover/Active):** A soft, diffused ambient shadow (Y: 4px, Blur: 12px, Color: Primary @ 8% opacity). Used for interactive KPI cards.
- **Level 3 (Modals/Popovers):** Sharp 1px border in **Earth** (#D4A373) with a background blur (12px) to focus user attention on CRUD operations.

Avoid using gradients for depth; rely on solid color shifts and thin, precise borders to separate information tiers.

## Shapes

The shape language is **Rounded**, reflecting the organic nature of agricultural research while maintaining a modern software feel.

- **Standard Components:** Buttons, input fields, and small cards use a **0.5rem (8px)** corner radius.
- **Containers:** Main dashboard widgets and data tables use a **1rem (16px)** corner radius for a softer, distinct container look.
- **Badges/Chips:** Use **Pill-shaped (Full round)** corners to distinguish them from interactive buttons.
- **Iconography:** Icons should feature rounded terminals and a 2px stroke weight to match the typography's weight.

## Components

### Role-Based Sidebar
The sidebar is the primary navigation hub. Use **Deep Forest** as the background with **Canopy** for active state highlights. Icons should be accompanied by clear text labels in `body-sm` SemiBold.

### KPI Cards
Key Performance Indicators (e.g., "Active Research Plots," "Staff Count") should be housed in Level 1 Cards. Include a small illustrative icon in the top right using the **Earth** or **Fern** palette to categorize the data type.

### Data Tables
Tables are the backbone of TARCMS. 
- **Header:** Light grey background (#F8FAFC) with uppercase `label-md` text.
- **Rows:** 56px minimum height, 1px bottom border.
- **Cell Content:** Use `body-sm` for standard data.

### Status Badges
Status indicators must use the following semantic color mapping:
- **Active:** Fern (#52B788) background with Deep Forest text.
- **Pending:** Earth (#D4A373) background with 80% opacity.
- **Completed:** Canopy (#2D6A4F) background with White text.

### Form Elements
Inputs should use white backgrounds with a 1px border. On focus, the border shifts to **Canopy** with a 2px outer glow of the same color at 20% opacity. Labels must always be visible above the input field.

### Agricultural Accents
Incorporate topographic contour lines as a decorative element in the header of large cards or as a subtle watermark in the dashboard empty-state illustrations.