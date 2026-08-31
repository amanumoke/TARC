import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LINKS = [
  {
    title: 'Research Programs',
    description:
      'Explore our ongoing research initiatives in agriculture, horticulture, and plant pathology.',
    href: '/research',
    large: true,
  },
  {
    title: 'Our Team',
    description: 'Meet the dedicated scientists and staff driving innovation at TARC.',
    href: '/about',
    large: false,
  },
  {
    title: 'Get in Touch',
    description: 'Have questions or want to collaborate? Reach out to our team.',
    href: '/contact',
    large: false,
  },
];

export function QuickLinksSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#101712] text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-3">
            Navigate
          </p>
          <h2 className="font-heading text-[28px] lg:text-[36px] font-bold leading-[1.1]">
            How Can We Help?
          </h2>
        </div>

        {/* Bento: 2 cols on md, 12 cols on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Research — large (8 cols) */}
          <Link
            to={LINKS[0].href}
            className="group lg:col-span-8 bg-white/5 p-8 lg:p-10 hover:bg-white/10 transition-colors flex flex-col justify-between min-h-[240px]"
          >
            <div>
              <h3 className="text-[22px] lg:text-[28px] font-heading font-bold mb-3 group-hover:text-[#B58B45] transition-colors">
                {LINKS[0].title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-md">
                {LINKS[0].description}
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
              Learn More{' '}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Team + Contact — stacked in 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group bg-white/5 p-6 lg:p-8 hover:bg-white/10 transition-colors flex-1 flex flex-col justify-between min-h-[112px]"
              >
                <div>
                  <h3 className="text-[17px] font-heading font-bold mb-2 group-hover:text-[#B58B45] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">{link.description}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                  Learn More{' '}
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
