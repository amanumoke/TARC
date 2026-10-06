import { useDepartments } from '@/api/hooks/useDepartments';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGES = [
  '/images/red-coffee.jpg',       // coffee research
  '/images/cacao-research.jpg',   // cacao
  '/images/spices.jpg',           // spices/crops
  '/images/plant seeds.jpg',      // planting
  '/images/labrat.jpg',           // lab/biotech
  '/images/livestocks.jpg',       // livestock
  '/images/seed.jpg',             // seeds/agronomy
  '/images/papaye.jpg',           // horticulture
  '/images/red pepper.jpg',       // spice crops
  '/images/agriculture area.jpg', // general agri
];

function getDeptImage(imageUrl: string | null | undefined, index: number): string {
  if (imageUrl) return imageUrl;
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

export function ResearchPrograms() {
  const { data: departments, isLoading } = useDepartments();

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-72 bg-[var(--r-border)]/30 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const programs = departments || [];

  return (
    <section className="py-16 lg:py-24 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">

        {/* Section header */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-3">
              Research Programs
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[var(--r-text)] leading-tight">
              The Areas
              <br />
              We Explore.
            </h2>
          </div>
          <p className="text-sm text-[var(--r-text-secondary)] max-w-sm leading-relaxed lg:text-right">
            Each department advances a distinct scientific discipline — from genetics and soil
            science to crop protection and livestock systems.
          </p>
        </div>

        {/* ── Card grid with explicit gap so cards are clearly separated ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((dept, index) => {
            const img = getDeptImage(dept.imageUrl, index);
            const num = String(index + 1).padStart(2, '0');

            return (
              <Link
                key={dept.id}
                to={`/research/${dept.code}`}
                className="
                  group relative flex flex-col overflow-hidden bg-[var(--r-bg)]
                  border border-[var(--r-border)]
                  min-h-[340px]
                  /* slide-up animation on hover */
                  transition-transform duration-300 ease-out
                  hover:-translate-y-2
                  hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]
                  hover:border-[var(--r-forest)]
                "
                style={{ willChange: 'transform' }}
              >
                {/* ── Image ── */}
                <div className="relative h-52 overflow-hidden flex-shrink-0">
                  <img
                    src={img}
                    alt={`${dept.name} research`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  {/* Gradient so number badge is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  {/* Index number watermark */}
                  <span className="absolute bottom-3 left-4 text-[44px] font-light text-white/20 leading-none select-none">
                    {num}
                  </span>
                  {/* Hover reveal: "View Program" label */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--r-forest)]/0 group-hover:bg-[var(--r-forest)]/20 transition-colors duration-300">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[11px] font-bold uppercase tracking-[0.2em] text-white bg-[var(--r-forest)] px-4 py-2">
                      View Program
                    </span>
                  </div>
                </div>

                {/* ── Text ── */}
                <div className="flex flex-col flex-1 p-6 bg-[var(--r-bg)]">
                  <h3 className="text-[15px] font-bold uppercase tracking-wide text-[var(--r-text)] leading-snug group-hover:text-[var(--r-forest)] transition-colors">
                    {dept.name}
                  </h3>
                  {dept.description && (
                    <p className="mt-2 text-xs text-[var(--r-text-secondary)] line-clamp-3 leading-relaxed flex-1">
                      {dept.description}
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-[var(--r-border)] flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--r-text-secondary)]">
                      {dept.establishedYear ? `Est. ${dept.establishedYear}` : 'Research Dept.'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[var(--r-text-secondary)] group-hover:text-[var(--r-forest)] transition-colors">
                      Explore
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
