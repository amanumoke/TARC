/**
 * @file apps/public/src/components/navigation/PublicFooter.tsx
 * @description Public footer matching the TARCMS design screenshot.
 * Dark green background with three columns.
 */

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#/privacy' },
  { label: 'Terms of Service', href: '#/terms' },
];

const INSTITUTIONAL_LINKS = [
  { label: 'Ministry of Agriculture', href: 'https://agriculture.gov.et' },
  { label: 'EAR Portal', href: 'https://ear.gov.et' },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#1B4332] text-white">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo and description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 bg-white/10 rounded flex items-center justify-center font-bold text-base">
                T
              </div>
              <span className="font-bold text-xl">TARC</span>
            </div>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed">
              Advancing agricultural science in the southwest highlands through dedicated research
              and community partnership.
            </p>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Legal & Privacy
            </h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Institutional Links
            </h3>
            <ul className="space-y-2">
              {INSTITUTIONAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] text-white/40 tracking-wider">
          <p className="uppercase">
            © 2024 TEPI AGRICULTURAL RESEARCH CENTER (TARC). ALL RIGHTS RESERVED. GOVERNMENT OF
            ETHIOPIA INSTITUTIONAL PARTNER.
          </p>
          <p className="mt-2 md:mt-0">SYS_VER_4.2_2029</p>
        </div>
      </div>
    </footer>
  );
}
