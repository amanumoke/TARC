import { useSettings } from '@/api/hooks/useSettings';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Button } from '@/components/ui/button';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroBanner() {
  const { data: settings } = useSettings();

  const siteName = settings?.institutionName || 'Tepi Agricultural Research Center';
  const tagline =
    settings?.tagline || 'Pioneering Agricultural Excellence in the Southwest Highlands';
  const description =
    settings?.aboutText ||
    'Advancing sustainable farming practices, discovering high-yield cultivars, and empowering local communities through data-driven research.';

  return (
    <section className="py-16 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary" />
              AGRICULTURAL EXCELLENCE HUB
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground font-heading">
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

            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold tracking-wide uppercase"
                render={<Link to="/research" />}
              >
                <FlaskConical className="mr-2 h-3.5 w-3.5" />
                Explore Our Research
              </Button>
              <Button
                variant="outline"
                className="text-xs font-semibold tracking-wide uppercase"
                render={<Link to="/about" />}
              >
                About Us
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <PlaceholderImage
              label="TARC Research Facility"
              aspectRatio="video"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
