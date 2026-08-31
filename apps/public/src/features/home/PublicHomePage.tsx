import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroBanner } from './HeroBanner';
import { NewsEventsBento } from './NewsEventsBento';
import { PublicationsBento } from './PublicationsBento';
import { QuickLinksSection } from './QuickLinksSection';

function FieldImageSection() {
  return (
    <section className="relative h-[50vh] lg:h-[70vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
        alt="Agricultural research field in Ethiopian highlands"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#101712]/60" />
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 lg:px-16">
        <div className="w-full max-w-[1440px] mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
            Research in the Field
          </p>
          <h2 className="font-heading text-[36px] lg:text-[64px] xl:text-[80px] font-bold uppercase tracking-tight text-white leading-[0.9]">
            From Soil
            <br />
            To Society.
          </h2>
          <Link
            to="/research"
            className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-white/80 hover:text-white transition-colors"
          >
            Explore Research <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 lg:py-36">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4">
          {/* Large text — 8 cols */}
          <div className="lg:col-span-8 bg-[#F5F5F0] p-8 lg:p-12 flex flex-col justify-between min-h-[280px] lg:min-h-[360px]">
            <h2 className="font-heading text-[36px] lg:text-[64px] xl:text-[80px] font-bold uppercase tracking-tight text-foreground leading-[0.9]">
              Want To
              <br />
              Know More?
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-6">
              <Link
                to="/research"
                className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors group"
              >
                Explore Research{' '}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
              >
                Contact TARC{' '}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Contact card — 4 cols */}
          <div className="lg:col-span-4 bg-primary text-white p-8 lg:p-10 flex flex-col justify-between min-h-[200px]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4">
                Get In Touch
              </p>
              <p className="font-heading text-[20px] lg:text-[24px] font-bold leading-snug">
                Ready to collaborate or learn more?
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-white text-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors self-start"
            >
              Contact Us <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PublicHomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroBanner />
      <NewsEventsBento />
      <PublicationsBento />
      <FieldImageSection />
      <QuickLinksSection />
      <CTASection />
    </div>
  );
}
