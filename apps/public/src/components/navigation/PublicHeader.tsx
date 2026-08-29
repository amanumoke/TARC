import { Mail, Menu, Phone, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Research', path: '/research' },
  { label: 'Publications', path: '/publications' },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50">
      {/* Green top bar */}
      <div className="bg-primary text-white">
        <div className="max-w-[1440px] mx-auto px-6 h-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href="tel:+251475560000" className="flex items-center gap-1.5 hover:opacity-80">
              <Phone className="h-3 w-3" />
              +251 47 556 0000
            </a>
            <a
              href="mailto:info@tarc.gov.et"
              className="hidden sm:flex items-center gap-1.5 hover:opacity-80"
            >
              <Mail className="h-3 w-3" />
              info@tarc.gov.et
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-80">EN ▾</span>
          </div>
        </div>
      </div>

      {/* White nav bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary rounded flex items-center justify-center text-white font-bold text-base">
              T
            </div>
            <span className="font-bold text-xl text-foreground">TARC</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-2 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setMobileOpen(false)}
            role="button"
            tabIndex={-1}
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="font-heading text-lg font-bold text-primary">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t px-4 py-4">
              <a
                href="tel:+251475560000"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Phone className="h-4 w-4" /> +251 47 556 0000
              </a>
              <a
                href="mailto:info@tarc.gov.et"
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Mail className="h-4 w-4" /> info@tarc.gov.et
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
