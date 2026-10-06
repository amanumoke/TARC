import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LINKS = [
  {
    title: 'Research Programs',
    subtitle: 'Science & Innovation',
    description: 'Explore TARC\'s ongoing research across crops, livestock, soil science, biotechnology, and more.',
    href: '/research',
    img: '/images/labrat.jpg',
    span: 'lg:col-span-8',
    minH: 'min-h-[280px] lg:min-h-[320px]',
  },
  {
    title: 'Top Management & Staff',
    subtitle: 'Our People',
    description: 'Meet the leadership team and researchers driving agricultural innovation.',
    href: '/about/people',
    img: '/images/agriculture area.jpg',
    span: 'lg:col-span-4',
    minH: 'min-h-[200px]',
  },
  {
    title: 'Vacancies',
    subtitle: 'Work With Us',
    description: 'Open positions and career opportunities at TARC.',
    href: '/vacancies',
    img: '/images/vacancy.jpg',
    span: 'lg:col-span-4',
    minH: 'min-h-[200px]',
  },
  {
    title: 'Contact TARC',
    subtitle: 'Get in Touch',
    description: 'Partner with us, ask questions, or visit our center in Tepi, Sheka Zone.',
    href: '/contact',
    img: '/images/spices.jpg',
    span: 'lg:col-span-8',
    minH: 'min-h-[200px]',
  },
];

export function QuickLinksSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Navigate
          </p>
          <h2 className="font-heading text-[26px] lg:text-[34px] font-bold leading-tight">
            How Can We Help?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`group relative overflow-hidden flex flex-col justify-end ${link.span} ${link.minH}`}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={link.img}
                  alt={link.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/92 via-[#0a1f14]/50 to-[#0a1f14]/10" />
              </div>

              {/* Text */}
              <div className="relative p-6 lg:p-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5">{link.subtitle}</p>
                <h3 className="font-heading text-[17px] lg:text-[20px] font-bold text-white leading-snug group-hover:text-[#9ed8b2] transition-colors">
                  {link.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/55 leading-relaxed line-clamp-2 max-w-md">{link.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                  Learn More <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
