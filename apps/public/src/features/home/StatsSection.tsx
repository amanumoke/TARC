import { BookOpen, CalendarClock, FlaskConical, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 2000): number {
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
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return count;
}

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

function StatItem({ icon: Icon, value, suffix, label }: StatItemProps) {
  const count = useCountUp(value);

  return (
    <div className="flex items-center gap-4 px-6 py-6">
      <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <div className="text-3xl font-bold text-white">
          {count}
          <span className="text-white/80">{suffix}</span>
        </div>
        <div className="text-xs font-semibold text-white/70 tracking-widest uppercase">{label}</div>
      </div>
    </div>
  );
}

const STATS = [
  { icon: FlaskConical, value: 45, suffix: '+', label: 'Research Projects' },
  { icon: Users, value: 30, suffix: '+', label: 'Staff Members' },
  { icon: BookOpen, value: 120, suffix: '+', label: 'Publications' },
  { icon: CalendarClock, value: 25, suffix: '+', label: 'Years of Service' },
];

export function StatsSection() {
  return (
    <section className="bg-primary">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
