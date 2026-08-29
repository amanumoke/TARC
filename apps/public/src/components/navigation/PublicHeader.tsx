/**
 * @file apps/public/src/components/navigation/PublicHeader.tsx
 * @description Public site header matching the TARCMS design system.
 * Two-part header: top info bar + main navigation with search.
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Mail, Menu, Phone, Search } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '#/' },
  { label: 'Research', href: '#/research' },
  { label: 'Publications', href: '#/publications' },
  { label: 'Staff', href: '#/about' },
  { label: 'Contact', href: '#/contact' },
];

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top info bar */}
      <div className="bg-[#1B4332] text-white">
        <div className="max-w-[1440px] mx-auto px-6 h-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href="tel:+251111234567" className="flex items-center gap-1.5 hover:opacity-80">
              <Phone className="h-3 w-3" />
              +251 11 123 4567
            </a>
            <a
              href="mailto:info@tarc.gov.et"
              className="flex items-center gap-1.5 hover:opacity-80"
            >
              <Mail className="h-3 w-3" />
              info@tarc.gov.et
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="http://localhost:3001" className="hover:opacity-80">
              Portal Login
            </a>
            <span className="opacity-60">English (EN)</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-2">
            <div className="h-9 w-9 bg-[#1B4332] rounded flex items-center justify-center text-white font-bold text-base">
              T
            </div>
            <span className="font-bold text-xl text-[#1a1c1a]">TARC</span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#414844] hover:text-[#1a1c1a] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Search + Director's Message */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#717973]" />
              <Input
                placeholder="Search research..."
                className="pl-9 w-56 h-9 bg-[#f9faf6] border-[#c1c8c2] text-sm"
              />
            </div>
            <Button className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white text-xs font-semibold tracking-wide rounded">
              DIRECTOR'S MESSAGE
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetTitle className="text-left">Menu</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-[#414844] hover:text-[#1a1c1a]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
