import { useProjects } from '@/api/hooks/useProjects';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProjectArchive() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 bg-[var(--r-border)]/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const projectsList = projects || [];

  if (projectsList.length === 0) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 text-center">
          <p className="text-[var(--r-text-secondary)]">No research projects available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-4">
              Research Projects
            </p>
            <h2 className="font-editorial text-[32px] lg:text-[48px] font-bold uppercase tracking-tight text-[var(--r-text)] leading-[0.95]">
              Project Archive
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden sm:flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[var(--r-forest)] hover:text-[var(--r-secondary)] transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          {projectsList.map((project, index) => {
            const num = String(index + 1).padStart(2, '0');
            return (
              <div
                key={project.id}
                className="flex items-start gap-6 lg:gap-12 py-6 border-b border-[var(--r-border)]"
              >
                <span className="text-[32px] lg:text-[40px] font-light text-[var(--r-text-secondary)]/30 leading-none min-w-[60px]">
                  {num}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] lg:text-[20px] font-semibold text-[var(--r-text)] uppercase tracking-wide">
                    {project.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-4 text-[12px] uppercase tracking-widest text-[var(--r-text-secondary)]">
                    <span>{project.departmentName || 'Research'}</span>
                    <span>
                      {project.startDate?.slice(0, 4)}—{project.endDate?.slice(0, 4) || 'Present'}
                    </span>
                  </div>
                </div>

                <Link
                  to="/projects"
                  className="hidden sm:flex items-center gap-1 text-[12px] font-medium uppercase tracking-widest text-[var(--r-text-secondary)] hover:text-[var(--r-forest)] transition-colors flex-shrink-0"
                >
                  View
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>

        <Link
          to="/projects"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-[13px] font-medium uppercase tracking-widest text-[var(--r-forest)]"
        >
          View All Projects
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
