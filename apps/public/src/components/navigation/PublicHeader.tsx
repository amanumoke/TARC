/**
 * @file apps/public/src/components/navigation/PublicHeader.tsx
 * @description Public site header with TARC branding, navigation links, and mobile toggle.
 * Responsive header with sticky positioning and mobile menu support.
 */

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sprout } from 'lucide-react';
import { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#/' },
  { label: 'About', href: '#/about' },
  { label: 'Research', href: '#/research' },
  { label: 'Publications', href: '#/publications' },
  { label: 'News', href: '#/news' },
  { label: 'Contact', href: '#/contact' },
];

/**
 * Public site header with navigation and branding.
 * Includes mobile menu toggle for responsive design.
 */
export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and branding */}
        <a href="#/" className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold text-lg leading-tight block">TARCMS</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Tepi Agricultural Research Center
            </span>
          </div>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button variant="outline" size="sm">
            <a href="http://localhost:3001" target="_blank" rel="noreferrer">
              Management Portal
            </a>
          </Button>
        </nav>

        {/* Mobile menu toggle */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                TARCMS
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <a href="http://localhost:3001" target="_blank" rel="noreferrer">
                  Management Portal
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
