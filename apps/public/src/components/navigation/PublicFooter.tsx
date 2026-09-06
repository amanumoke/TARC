import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RESEARCH_LINKS = [
  { label: 'Programs', path: '/research' },
  { label: 'Projects', path: '/projects' },
  { label: 'Publications', path: '/publications' },
];

const ABOUT_LINKS = [
  { label: 'About TARC', path: '/about' },
  { label: 'Director', path: '/about/director' },
  { label: 'Departments', path: '/about/departments' },
  { label: 'People', path: '/about/people' },
  { label: 'Structure', path: '/about/structure' },
];

const RESOURCE_LINKS = [
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Vacancies', path: '/vacancies' },
];

export function PublicFooter() {
  return (
    <footer className="shrink-0 bg-[#101712] text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column — 2 cols wide on lg */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 bg-white rounded-md p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/images/eiar-logo.jpg"
                  alt="EIAR / TARC Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading text-lg font-bold text-white leading-tight">
                    TARC
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/90 uppercase tracking-wider">
                    EIAR
                  </span>
                </div>
                <span className="text-[10px] text-white/50 block">Tepi Agricultural Research Center</span>
              </div>
            </Link>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed mb-6">
              Tepi Agricultural Research Center — Advancing agricultural research and innovation for
              sustainable development in southwestern Ethiopia.
            </p>
            <div className="space-y-2.5">
              <a
                href="tel:+251920654572"
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" /> 092 065 4572
              </a>
              <a
                href="mailto:tepiagriculturalresearchcenter@eiar.gov.et"
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" /> tepiagriculturalresearchcenter@eiar.gov.et
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/50">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Tepi, Yeki Woreda, Sheka Zone, Southwest Ethiopia</span>
              </div>
              <a
                href="https://facebook.com/tepiaresearch"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/50 transition-colors hover:text-white"
              >
                <Facebook className="h-4 w-4" /> Official Facebook page
              </a>
            </div>
          </div>

          {/* Research */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              Research
            </h3>
            <ul className="space-y-3">
              {RESEARCH_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              About
            </h3>
            <ul className="space-y-3">
              {ABOUT_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Tepi Agricultural Research Center
          </p>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <span className="text-[11px] text-white/30 uppercase tracking-widest">
              Privacy Policy
            </span>
            <span className="text-[11px] text-white/30">Developed by Amanumoke</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
