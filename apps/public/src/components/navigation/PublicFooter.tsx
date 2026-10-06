import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NAV_COLUMNS = [
  {
    heading: 'Research',
    links: [
      { label: 'Programs', path: '/research' },
      { label: 'Projects', path: '/projects' },
      { label: 'Publications', path: '/publications' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'About TARC', path: '/about' },
      { label: 'Director', path: '/about/director' },
      { label: 'Departments', path: '/about/departments' },
      { label: 'Our Team', path: '/about/people' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'News', path: '/news' },
      { label: 'Events', path: '/events' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Vacancies', path: '/vacancies' },
      { label: 'Contact', path: '/contact' },
    ],
  },
];

export function PublicFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 bg-[#0d1a11] text-white">
      {/* ── Main footer body ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8">

          {/* Brand — col 1 */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 bg-white rounded p-0.5 shrink-0 overflow-hidden">
                <img
                  src="/images/eiar-logo.jpg"
                  alt="TARC logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading text-base font-bold text-white tracking-tight">
                  TARC
                </span>
                <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">
                  EIAR
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/45 leading-relaxed max-w-[220px]">
              Advancing agricultural research for sustainable development in Southwest Ethiopia.
            </p>

            <div className="space-y-2">
              <a
                href="tel:+251920654572"
                className="flex items-center gap-2 text-xs text-white/45 hover:text-white transition-colors"
              >
                <Phone className="h-3 w-3 shrink-0" />
                092 065 4572
              </a>
              <a
                href="mailto:tepiagriculturalresearchcenter@eiar.gov.et"
                className="flex items-center gap-2 text-xs text-white/45 hover:text-white transition-colors"
              >
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">eiar.gov.et</span>
              </a>
              <div className="flex items-start gap-2 text-xs text-white/45">
                <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                <span>Tepi, Sheka Zone, SW Ethiopia</span>
              </div>
              <a
                href="https://facebook.com/tepiaresearch"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-white/45 hover:text-white transition-colors"
              >
                <Facebook className="h-3 w-3 shrink-0" />
                Facebook
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-xs text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-white/8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-white/25 uppercase tracking-widest">
            © {year} Tepi Agricultural Research Center
          </p>
          <div className="flex items-center gap-4 text-[10px] text-white/25">
            <span>Privacy Policy</span>
            <span className="text-white/10">·</span>
            <span>{t('footer.developedBy', 'Developed by Amanumoke')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
