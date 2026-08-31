import { useDepartments } from '@/api/hooks/useDepartments';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROGRAM_DESCRIPTIONS: Record<string, string> = {
  'Crop Improvement':
    'Improving productivity, resilience and crop performance through advanced research.',
  'Plant Protection':
    'Research focused on plant health, disease management and protection systems.',
  'Soil & Water': 'Sustainable soil and water management for agricultural development.',
};

const PROGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
];

export function ResearchPrograms() {
  const { data: departments, isLoading } = useDepartments();

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 bg-[var(--r-border)]/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const programs = departments || [];

  return (
    <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-4">
            Research Programs
          </p>
          <h2 className="font-editorial text-[32px] lg:text-[48px] font-bold uppercase tracking-tight text-[var(--r-text)] leading-[0.95]">
            The Areas
            <br />
            We Explore.
          </h2>
        </div>

        <div>
          {programs.map((dept, index) => {
            const num = String(index + 1).padStart(2, '0');
            const description =
              PROGRAM_DESCRIPTIONS[dept.name] ||
              'Research and innovation for sustainable agricultural development.';

            return (
              <Link
                key={dept.id}
                to={`/research/${dept.code}`}
                className="research-program-row group flex items-start gap-6 lg:gap-12 py-8 border-b border-[var(--r-border)] transition-colors hover:border-[var(--r-text)]"
              >
                <span className="text-[48px] lg:text-[64px] font-light text-[var(--r-text-secondary)]/30 leading-none min-w-[80px]">
                  {num}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[20px] lg:text-[28px] font-semibold uppercase tracking-wide text-[var(--r-text)]">
                    {dept.name}
                  </h3>
                  <p className="mt-2 text-sm lg:text-base text-[var(--r-text-secondary)] max-w-lg">
                    {description}
                  </p>
                </div>

                <div className="hidden lg:block relative w-40 h-28 flex-shrink-0 overflow-hidden">
                  <img
                    src={PROGRAM_IMAGES[index % PROGRAM_IMAGES.length]}
                    alt={`${dept.name} research`}
                    className="program-image w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <ArrowRight className="h-5 w-5 text-[var(--r-text-secondary)] group-hover:text-[var(--r-forest)] transition-colors mt-2 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
