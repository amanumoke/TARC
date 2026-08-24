/**
 * @file apps/public/src/components/navigation/PublicFooter.tsx
 * @description Public site footer with institutional info, quick links, and copyright.
 * Displays contact information and navigation links.
 */

import { Mail, MapPin, Phone, Sprout } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Research', href: '/research' },
  { label: 'Publications', href: '/publications' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Public site footer with institutional information and quick links.
 * Includes contact details and copyright notice.
 */
export function PublicFooter() {
  return (
    <footer className="border-t border-border py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Institutional info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <span className="font-bold text-lg leading-tight block">TARCMS</span>
                <span className="text-xs text-muted-foreground">
                  Tepi Agricultural Research Center
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Pioneering agricultural research in spices, coffee, and horticulture for Southwest
              Ethiopia.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Tepi, Sheka Zone, Southwest Ethiopia</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+251 46 550 XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@tarc.gov.et</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Tepi Agricultural Research Center (TARC). All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
