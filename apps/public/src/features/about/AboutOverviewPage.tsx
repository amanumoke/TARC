import { useSettings } from '@/api/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutOverviewPage() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 space-y-16">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">About Us</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            About TARC
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {settings?.aboutText ||
              'Learn about our mission, vision, and agricultural research mandate.'}
          </p>
        </div>
      </section>

      {/* Vision / Mission / Mandate */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            <div className="bg-muted/30 p-8 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-6">
                Our Vision
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {settings?.visionText ||
                  'To be a center of excellence in agricultural research, contributing to the transformation of Ethiopian agriculture through innovative technologies, skilled human resources, and strategic partnerships.'}
              </p>
            </div>
            <div className="bg-muted/30 p-8 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-6">
                Our Mission
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {settings?.missionText ||
                  'To conduct innovative agricultural research and development in spices, coffee, and horticulture, providing improved technologies and knowledge for food security and economic growth in Southwest Ethiopia.'}
              </p>
            </div>
            <div className="bg-muted/30 p-8 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-6">
                Our Mandate
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {settings?.aboutText ||
                  'TARC is mandated to conduct research in spice crops, coffee, horticultural crops, plant genetic resource conservation, and farmer extension and technology dissemination.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16">
          <div className="relative min-h-[360px] overflow-hidden bg-[#173326]">
            <img
              src="/images/cacao-research.jpg"
              alt="Cacao research and seedling development at TARC"
              className="h-full w-full object-cover opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10291e]/90 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 max-w-xs text-sm leading-relaxed text-white/85 lg:left-8 lg:bottom-8">
              A research tradition shaped by the land, crops, and people of Southwest Ethiopia.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Our history
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight lg:text-4xl">
              Rooted in the Southwest highlands
            </h2>
            <div className="mt-10 border-l border-primary/30 pl-6">
              {[
                ['A regional foundation', 'TARC grew from the need for agricultural research that reflects the unique ecology and livelihoods of Southwest Ethiopia.'],
                ['Research close to farmers', 'Field-based trials and partnerships connect scientific inquiry with the questions farmers face in their fields, gardens, and plantations.'],
                ['A future built on knowledge', 'Today, the Center advances productive, climate-resilient agriculture while protecting natural resources and sharing practical technologies.'],
              ].map(([title, description], index) => (
                <div key={title} className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 bg-primary ring-4 ring-background" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">0{index + 1}</p>
                  <h3 className="mt-2 font-heading text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#17231b] py-20 text-white lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Our principles
          </p>
          <div className="grid gap-px bg-white/15 md:grid-cols-3">
            {[
              ['Scientific integrity', 'Evidence-led research, careful experimentation, and honest reporting.'],
              ['Service to farmers', 'Useful technologies and knowledge designed around local needs.'],
              ['Partnership', 'Shared learning across researchers, communities, institutions, and industry.'],
            ].map(([title, description]) => (
              <div key={title} className="bg-[#17231b] p-8 lg:p-10">
                <h3 className="font-heading text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Explore
          </p>
          <h2 className="font-heading text-[32px] lg:text-[48px] font-bold text-foreground leading-[1.05] mb-12">
            Learn More About Us
          </h2>

          <div className="divide-y divide-border border-t border-border">
            {[
              {
                to: '/about/director',
                label: "Director's Message",
                desc: 'Welcome from our leadership',
              },
              {
                to: '/about/departments',
                label: 'Our Departments',
                desc: 'Research divisions and teams',
              },
              { to: '/about/people', label: 'Meet Our Team', desc: 'Researchers and staff' },
              { to: '/about/structure', label: 'Organizational Structure', desc: 'Leadership and institutional functions' },
              { to: '/vacancies', label: 'Work With Us', desc: 'Current career opportunities' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center justify-between py-6"
              >
                <div>
                  <h3 className="text-[18px] font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
