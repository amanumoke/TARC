import { Globe, Mail, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'About', path: '/about' },
  { label: 'Research', path: '/research' },
  { label: 'Publications', path: '/publications' },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Green top bar */}
      <div className="bg-primary text-white">
        <div className="max-w-[1440px] mx-auto px-6 h-9 flex items-center justify-between text-[11px] tracking-wide">
          <div className="flex items-center gap-6">
            <a
              href="tel:+251475560000"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Phone className="h-3 w-3" />
              +251 47 556 0000
            </a>
            <a
              href="mailto:info@tarc.gov.et"
              className="hidden sm:flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Mail className="h-3 w-3" />
              info@tarc.gov.et
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-white/80">
            <Globe className="h-3 w-3" />
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-border shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-white border-b border-border'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center text-white font-heading text-lg">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold text-foreground leading-tight">
                TARC
              </span>
              <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground leading-tight hidden sm:block">
                Agricultural Research
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-[13px] font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA + mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden lg:flex items-center gap-2 bg-primary text-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              Contact
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 -mr-2 hover:bg-muted rounded-sm transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setMobileOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close menu"
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <span className="font-heading text-lg font-bold text-primary">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2 -mr-2 hover:bg-muted rounded-sm transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col py-4 px-2">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`mx-2 px-4 py-3 text-[15px] font-medium rounded-sm transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                className="mx-2 mt-4 px-4 py-3 bg-primary text-white text-[13px] font-semibold uppercase tracking-widest text-center hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </Link>
            </nav>
            <div className="mt-auto border-t border-border px-6 py-5 space-y-3">
              <a
                href="tel:+251475560000"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" /> +251 47 556 0000
              </a>
              <a
                href="mailto:info@tarc.gov.et"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
