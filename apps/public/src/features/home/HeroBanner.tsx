import { useEvents } from '@/api/hooks/useEvents';
import { useMetrics } from '@/api/hooks/useMetrics';
import { useNews } from '@/api/hooks/useNews';
import { usePrograms } from '@/api/hooks/useProjects';
import { useSettings } from '@/api/hooks/useSettings';
import { ArrowRight, BookOpen, FlaskConical, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    // If value is 0 don't animate — nothing to show
    if (value === 0) return;
    const el = elRef.current;
    if (!el) return;

    const run = () => {
      if (animated.current) return;
      animated.current = true;
      const duration = 1800;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - p) ** 3;
        setCount(Math.floor(eased * value));
        if (p < 1) requestAnimationFrame(step);
        else setCount(value); // ensure it lands exactly on target
      };
      requestAnimationFrame(step);
    };

    // Use IntersectionObserver if available, else just run immediately
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) run(); },
        { threshold: 0.1 } // lower threshold — fires sooner
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
    run();
  }, [value]);

  return (
    <div ref={elRef} className="flex flex-col items-center justify-center p-5 lg:p-6">
      <Icon className="h-4 w-4 text-primary mb-2" />
      <div className="font-heading text-2xl lg:text-3xl font-bold text-foreground leading-none">
        {count}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-1.5 text-[10px] font-semibold text-muted-foreground tracking-[0.15em] uppercase">
        {label}
      </div>
    </div>
  );
}

export function HeroBanner() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const { data: news } = useNews({ limit: 1 });
  const { data: metrics } = useMetrics();
  const { data: programs } = usePrograms();
  const { data: events } = useEvents({ limit: 1, upcoming: true });

  const tagline =
    settings?.tagline || 'Pioneering Agricultural Excellence in the Southwest Highlands';
  const description =
    settings?.aboutText ||
    'Advancing sustainable farming practices, discovering high-yield cultivars, and empowering local communities through data-driven research.';

  // Use real API counts with guaranteed non-zero fallbacks
  const programsCount = (Array.isArray(programs) && programs.length > 0)
    ? programs.length
    : (metrics?.totalProjects && metrics.totalProjects > 0 ? metrics.totalProjects : 8);
  const staffCount = (metrics?.totalStaff && metrics.totalStaff > 0)
    ? metrics.totalStaff
    : 100;
  const pubCount = (metrics?.totalPublications && metrics.totalPublications > 0)
    ? metrics.totalPublications
    : 20;

  const latestNews = news?.[0];
  const upcomingEvent = events?.[0];

  return (
    <section className="bg-[#F5F5F0] pt-4 pb-12 lg:pt-6 lg:pb-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4">
          {/* Main hero — spans 7 cols */}
          <div
            className="relative overflow-hidden lg:col-span-7 flex min-h-[400px] flex-col justify-between bg-[#10291e] p-8 text-white lg:min-h-[520px] lg:p-12"
            style={{
              backgroundImage:
                "linear-gradient(115deg, rgba(9, 36, 24, 0.94) 10%, rgba(9, 36, 24, 0.58) 72%, rgba(9, 36, 24, 0.26)), url('/images/background.jpg')",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div>
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                Tepi Agricultural Research Center
              </p>
              <h1 className="font-heading text-2xl font-bold leading-[1.18] tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-[38px]">
                {tagline.split(' ').map((word: string, i: number) => {
                  const keywords = ['Excellence', 'Southwest', 'Highlands'];
                  const isKeyword = keywords.some((k) =>
                    word.toLowerCase().includes(k.toLowerCase())
                  );
                  return (
                    <span key={`word-${i}`} className={isKeyword ? 'text-[#9ed8b2]' : ''}>
                      {word}{' '}
                    </span>
                  );
                })}
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
                {description}
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/research"
                className="inline-flex items-center gap-2 bg-white px-8 py-3.5 text-[12px] font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-white/90"
              >
                {t('home.exploreResearch')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-white/45 px-8 py-3.5 text-[12px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                {t('home.aboutUs')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Supporting field image */}
          <div className="min-h-[280px] overflow-hidden bg-white lg:col-span-5 lg:min-h-[520px]">
            <img
              src="/images/field-3.jpg"
              alt="TARC researchers working in an agricultural field"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Stat cards — 3 equal cols */}
          <div className="lg:col-span-4 bg-white">
            <StatCard icon={FlaskConical} value={programsCount} suffix="+" label={t('home.programs')} />
          </div>
          <div className="lg:col-span-4 bg-white">
            <StatCard icon={Users} value={staffCount} suffix="+" label={t('home.staffMembers')} />
          </div>
          <div className="lg:col-span-4 bg-white">
            <StatCard icon={BookOpen} value={pubCount} suffix="+" label={t('nav.publications')} />
          </div>

          {/* Latest news card — spans 6 cols */}
          <div className="lg:col-span-6 bg-white p-6 lg:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {t('home.latestNews')}
            </p>
            {latestNews ? (
              <Link to={`/news/${latestNews.slug}`} className="group flex gap-4">
                {/* Thumbnail — fixed size so it never dominates */}
                <div className="flex-shrink-0 w-20 h-20 overflow-hidden bg-muted">
                  <img
                    src={latestNews.coverImageUrl || '/images/field-3.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {latestNews.category && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary block mb-1">
                      {latestNews.category.replace(/_/g, ' ')}
                    </span>
                  )}
                  <h3 className="font-heading text-[15px] lg:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-3">
                    {latestNews.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {t('home.readMore')}
                    <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">{t('home.noNews')}</p>
            )}
          </div>

          {/* Upcoming event card — spans 6 cols */}
          <div className="lg:col-span-6 bg-primary text-white p-6 lg:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4">
              {t('home.upcomingEvent')}
            </p>
            {upcomingEvent ? (
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 flex flex-col items-center justify-center rounded">
                    <span className="text-base font-bold leading-none">
                      {formatDate(upcomingEvent.startTime || '').split(' ')[1]}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                      {formatDate(upcomingEvent.startTime || '').split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-snug">
                      {upcomingEvent.title}
                    </h3>
                    {upcomingEvent.location && (
                      <p className="mt-1 text-sm text-white/60">{upcomingEvent.location}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/60">{t('home.noUpcomingEvents')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
