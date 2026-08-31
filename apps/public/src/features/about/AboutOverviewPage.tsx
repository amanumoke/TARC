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
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">About Us</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            About TARC
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
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
