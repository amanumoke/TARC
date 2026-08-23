# ADR-010: shadcn UI Component Architecture & Design System

## Status
Accepted

## Context
TARCMS features two distinct frontend client applications:
1. `apps/public` (Public institutional web portal & portfolio)
2. `apps/dashboard` (Authenticated administration & researcher management dashboard)

To guarantee high visual polish, complete accessibility (WAI-ARIA compliance), full design customization, and seamless consistency without the lock-in and bloat of heavyweight monolithic UI component libraries, a modern component design system is required.

## Decision
We adopt **shadcn UI** as the unified component architecture across both `apps/public` and `apps/dashboard`:
- **Underlying Primitives**: Radix UI headless unstyled accessible primitives (`@radix-ui/react-*`).
- **Styling**: Tailwind CSS utility classes using CSS design tokens (`--primary`, `--background`, `--card`, `--radius`, etc.) tailored to TARC's agricultural identity (emerald greens and earthy tones).
- **Variant Management**: `class-variance-authority` (cva) for type-safe component variant states (`default`, `outline`, `ghost`, `destructive`).
- **Utility**: `cn` utility function combining `clsx` and `tailwind-merge` for predictable conditional class composition.
- **Location**: Direct code ownership in `@/components/ui/` in each frontend application.

## Consequences
### Positive
- **Complete Ownership**: Components live directly in the codebase; no black-box third-party library constraints.
- **Accessibility by Default**: Keyboard navigation, screen reader support, focus trapping, and ARIA roles out-of-the-box via Radix UI.
- **Clean Shared Aesthetic**: Both the public portal and management dashboard share a unified modern design language.
- **Zero Runtime Overhead**: Unused components are not bundled, minimizing bundle size for fast page loads in rural network conditions.

### Negative
- Component source files reside within each application and must be maintained across updates.
