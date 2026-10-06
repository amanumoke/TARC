import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroBanner } from './HeroBanner';
import { NewsEventsBento } from './NewsEventsBento';
import { PublicationsBento } from './PublicationsBento';
import { QuickLinksSection } from './QuickLinksSection';

function CTASection() {
  return (
    <section className="py-12 lg:py-16 bg-[#F5F5F0]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left — compact text block */}
          <div className="lg:col-span-8 bg-white p-7 lg:p-8 flex flex-col justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Want to know more?
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/research"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 text-[12px] font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Explore Research <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-2.5 text-[12px] font-semibold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
              >
                Contact TARC <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right — get in touch card */}
          <div className="lg:col-span-4 bg-primary text-white p-7 lg:p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-2">
                Get In Touch
              </p>
              <p className="font-heading text-[17px] lg:text-[19px] font-bold leading-snug">
                Ready to collaborate or learn more?
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors self-start"
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
      <CTASection />
      <QuickLinksSection />
    </div>
  );
}
