import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResearchHero() {
  return (
    <section className="relative bg-[var(--r-bg)] pt-8 pb-16 lg:pt-12 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-6">
          Research
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[42%_1fr] gap-8 lg:gap-12 items-start">
          <div className="flex flex-col">
            <h1 className="font-editorial text-[48px] leading-[0.95] font-bold uppercase tracking-tight text-[var(--r-text)] sm:text-[64px] lg:text-[80px] xl:text-[100px]">
              We Study
              <br />
              What
              <br />
              Matters.
            </h1>

            <p className="mt-8 text-base lg:text-lg text-[var(--r-text-secondary)] max-w-md leading-relaxed">
              Agricultural research focused on real challenges, knowledge creation, and practical
              impact for Ethiopian farming communities.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button
                render={<Link to="/projects" />}
                className="bg-[var(--r-forest)] text-white hover:bg-[var(--r-secondary)] text-[13px] uppercase tracking-widest px-8 py-3 rounded-none inline-flex items-center gap-2"
              >
                Explore Research
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--r-text-secondary)] self-center">
                Tepi &middot; Ethiopia
              </span>
            </div>
          </div>

          <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
              alt="Ethiopian agricultural researchers inspecting crops in a research field"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
