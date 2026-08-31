import { useDepartments } from '@/api/hooks/useDepartments';
import { useEvents } from '@/api/hooks/useEvents';
import { useNews } from '@/api/hooks/useNews';
import { usePublications } from '@/api/hooks/usePublications';
import { useSettings } from '@/api/hooks/useSettings';
import { useStaff } from '@/api/hooks/useStaff';
import { ArrowRight, BookOpen, FlaskConical, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function useCountUp(target: number): number {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return count;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
}: { icon: React.ElementType; value: number; suffix: string; label: string }) {
  const count = useCountUp(value);
  return (
    <div ref={undefined} className="flex flex-col items-center justify-center p-6 lg:p-8">
      <Icon className="h-5 w-5 text-primary mb-3" />
      <div className="font-heading text-[36px] lg:text-[44px] font-bold text-foreground leading-none">
        {count}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-2 text-[10px] font-semibold text-muted-foreground tracking-[0.15em] uppercase">
        {label}
      </div>
    </div>
  );
}

export function HeroBanner() {
  const { data: settings } = useSettings();
  const { data: departments } = useDepartments();
  const { data: news } = useNews({ limit: 1 });
  const { data: publications } = usePublications();
  const { data: staff } = useStaff();
  const { data: events } = useEvents({ limit: 1, upcoming: true });

  const tagline =
    settings?.tagline || 'Pioneering Agricultural Excellence in the Southwest Highlands';
  const description =
    settings?.aboutText ||
    'Advancing sustainable farming practices, discovering high-yield cultivars, and empowering local communities through data-driven research.';

  const deptCount = Array.isArray(departments) ? departments.length : 0;
  const staffCount = Array.isArray(staff) ? staff.length : 0;
  const pubCount = Array.isArray(publications) ? publications.length : 0;

  const latestNews = news?.[0];
  const upcomingEvent = events?.[0];

  return (
    <section className="bg-[#F5F5F0] pt-4 pb-12 lg:pt-6 lg:pb-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4">
          {/* Main hero — spans 7 cols */}
          <div className="lg:col-span-7 bg-white p-8 lg:p-12 flex flex-col justify-between min-h-[400px] lg:min-h-[520px]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Tepi Agricultural Research Center
              </p>
              <h1 className="font-heading text-[36px] leading-[1.05] font-bold text-foreground sm:text-[48px] lg:text-[56px] xl:text-[64px]">
                {tagline.split(' ').map((word: string, i: number) => {
                  const keywords = ['Excellence', 'Southwest', 'Highlands'];
                  const isKeyword = keywords.some((k) =>
                    word.toLowerCase().includes(k.toLowerCase())
                  );
                  return (
                    <span key={`word-${i}`} className={isKeyword ? 'text-primary' : ''}>
                      {word}{' '}
                    </span>
                  );
                })}
              </h1>
              <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-lg leading-relaxed">
                {description}
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/research"
                className="bg-primary text-white px-8 py-3.5 text-[12px] font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Explore Research <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="border border-border px-8 py-3.5 text-[12px] font-semibold uppercase tracking-widest hover:bg-muted transition-colors inline-flex items-center gap-2"
              >
                About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Image — spans 5 cols */}
          <div className="lg:col-span-5 bg-white overflow-hidden min-h-[280px] lg:min-h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
              alt="Ethiopian agricultural researchers inspecting crops in a research field"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Stat cards — 3 equal cols */}
          <div className="lg:col-span-4 bg-white">
            <StatCard icon={FlaskConical} value={deptCount || 6} suffix="+" label="Programs" />
          </div>
          <div className="lg:col-span-4 bg-white">
            <StatCard icon={Users} value={staffCount || 30} suffix="+" label="Staff Members" />
          </div>
          <div className="lg:col-span-4 bg-white">
            <StatCard icon={BookOpen} value={pubCount || 120} suffix="+" label="Publications" />
          </div>

          {/* Latest news card — spans 6 cols */}
          <div className="lg:col-span-6 bg-white p-6 lg:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Latest News
            </p>
            {latestNews ? (
              <Link to={`/news/${latestNews.slug}`} className="group block">
                <h3 className="font-heading text-[20px] lg:text-[24px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {latestNews.title}
                </h3>
                {latestNews.summary && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {latestNews.summary}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
                  Read More{' '}
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">No news yet.</p>
            )}
          </div>

          {/* Upcoming event card — spans 6 cols */}
          <div className="lg:col-span-6 bg-primary text-white p-6 lg:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4">
              Upcoming Event
            </p>
            {upcomingEvent ? (
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-white/10 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold leading-none">
                      {formatDate(upcomingEvent.startTime || '').split(' ')[1]}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                      {formatDate(upcomingEvent.startTime || '').split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold leading-snug">
                      {upcomingEvent.title}
                    </h3>
                    {upcomingEvent.location && (
                      <p className="mt-1 text-sm text-white/60">{upcomingEvent.location}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/60">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
