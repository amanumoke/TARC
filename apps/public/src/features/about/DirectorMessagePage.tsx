import { useSettings } from '@/api/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fallbackDirectorPhoto = '/images/director-dereje.jpg';

export function DirectorMessagePage() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 space-y-16">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const defaultMessage =
    '<p>It is my pleasure to welcome you to the Tepi Agricultural Research Center (TARC) website. For over five decades, TARC has been at the forefront of agricultural research and innovation in Southwest Ethiopia.</p><p>Our dedicated team of researchers works tirelessly to develop improved varieties of spices, coffee, and horticultural crops, while promoting sustainable farming practices that benefit smallholder farmers in our region.</p><p>Through this website, we aim to share our research findings, publications, and technologies with the broader agricultural community. I invite you to explore our work and join us in our mission to transform Ethiopian agriculture.</p>';

  const directorHtml = settings?.directorMessage || defaultMessage;

  return (
    <div>
      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Director's Message</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Director's Message
          </h1>
        </div>
      </section>

      {/* Message */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-20">
            <div>
              <img
                src={settings?.directorPhotoUrl || fallbackDirectorPhoto}
                alt={settings?.directorName || 'Dr. Dereje Tulu'}
                className="w-full max-h-[560px] rounded-lg bg-muted object-contain object-center"
              />
              <div className="mt-6">
                <p className="font-heading text-xl font-bold">
                  {settings?.directorName || 'Dr. Dereje Tulu'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {settings?.directorTitle || 'Center Director, Tepi Agricultural Research Center (EIAR)'}
                </p>
              </div>
            </div>

            <div>
              <div
                className="prose prose-lg max-w-none text-muted-foreground leading-relaxed [&_p]:mb-6"
                dangerouslySetInnerHTML={{ __html: directorHtml }}
              />
              <div className="mt-8 pt-8 border-t border-border">
                <p className="font-heading text-lg font-bold">
                  {settings?.directorName || 'Dr. Dereje Tulu'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {settings?.directorTitle || 'Center Director & Senior Researcher (EIAR)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
