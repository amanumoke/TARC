/**
 * @file apps/public/src/lib/utils.ts
 * @description Standard utility functions for the TARCMS Public Institutional Portal.
 * Includes the `cn` classname merger required for shadcn UI components.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional CSS classes using `clsx` and resolves Tailwind CSS class conflicts
 * using `tailwind-merge`. This ensures predictable utility styling across all shadcn components.
 *
 * @param inputs - Array of class names, conditionals, or objects.
 * @returns Combined and deduplicated CSS class string.
 *
 * @example
 * cn('bg-primary text-white', isActive && 'opacity-100', 'hover:bg-primary-700')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
