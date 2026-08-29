import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Research', path: '/research' },
  { label: 'Publications', path: '/publications' },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function PublicFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 bg-white/10 rounded flex items-center justify-center font-bold text-base">
                T
              </div>
              <span className="font-bold text-xl">TARC</span>
            </div>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed">
              Tepi Agricultural Research Center — Advancing agricultural research and innovation for
              sustainable development.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <a
                href="tel:+251475560000"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <Phone className="h-4 w-4" /> +251 47 556 0000
              </a>
              <a
                href="mailto:info@tarc.gov.et"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <Mail className="h-4 w-4" /> info@tarc.gov.et
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Tepi, South West Ethiopia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] text-white/40 tracking-wider">
          <p className="uppercase">
            © {new Date().getFullYear()} TEPI AGRICULTURAL RESEARCH CENTER (TARC). ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
