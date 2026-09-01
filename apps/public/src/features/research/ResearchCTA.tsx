import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResearchCTA() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[var(--r-text)] leading-tight">
          Want To
          <br />
          Know More?
        </h2>

        <div className="mt-12 flex flex-col sm:flex-row items-start gap-6">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-widest text-[var(--r-forest)] hover:text-[var(--r-secondary)] transition-colors group"
          >
            Explore Research
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-widest text-[var(--r-text-secondary)] hover:text-[var(--r-text)] transition-colors group"
          >
            Contact TARC
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
