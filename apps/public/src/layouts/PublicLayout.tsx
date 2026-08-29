/**
 * @file apps/public/src/layouts/PublicLayout.tsx
 * @description Public site layout shell with header, main content, and footer.
 * Provides consistent page structure for all public pages.
 */

import { PublicFooter } from '@/components/navigation/PublicFooter';
import { PublicHeader } from '@/components/navigation/PublicHeader';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public site layout wrapper.
 * Wraps page content with consistent header and footer.
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col dot-grid-bg text-foreground">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
