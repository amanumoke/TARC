import { useProjects } from '@/api/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedProject() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <section className="bg-[var(--r-dark)] py-20 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="h-96 bg-white/5 animate-pulse" />
        </div>
      </section>
    );
  }

  const project = projects?.[0];
  if (!project) return null;

  const words = project.title.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <section className="bg-[var(--r-dark)] text-white py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="flex items-center justify-between mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Featured Project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-10 lg:gap-16 items-center">
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80"
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="font-editorial text-[36px] lg:text-[56px] font-bold uppercase leading-[0.95] tracking-tight">
              {line1}
              <br />
              {line2}
            </h2>

            <div className="mt-8 flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-white/50">
              <span>{project.departmentName || 'Research'}</span>
              <span>
                {project.startDate?.slice(0, 4)} — {project.endDate?.slice(0, 4) || 'Present'}
              </span>
            </div>

            <Button
              render={<Link to="/projects" />}
              className="mt-10 bg-transparent border border-white/30 text-white hover:bg-white/10 text-[13px] uppercase tracking-widest px-8 py-3 rounded-none inline-flex items-center gap-2"
            >
              Explore Project
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
