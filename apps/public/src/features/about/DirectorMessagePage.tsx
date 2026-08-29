import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/hooks/useSettings';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DirectorMessagePage() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const defaultMessage =
    '<p>It is my pleasure to welcome you to the Tepi Agricultural Research Center (TARC) website. For over five decades, TARC has been at the forefront of agricultural research and innovation in Southwest Ethiopia.</p><p>Our dedicated team of researchers works tirelessly to develop improved varieties of spices, coffee, and horticultural crops, while promoting sustainable farming practices that benefit smallholder farmers in our region.</p><p>Through this website, we aim to share our research findings, publications, and technologies with the broader agricultural community. I invite you to explore our work and join us in our mission to transform Ethiopian agriculture.</p>';

  const directorHtml = settings?.directorMessage || defaultMessage;

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/about" className="hover:text-foreground transition-colors">
          About
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Director's Message</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold">Director's Message</h1>
        <p className="text-muted-foreground mt-2">A welcome message from the Director of TARC.</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <PlaceholderImage label="Director Photo" aspectRatio="square" className="w-48 h-48" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{settings?.directorName || 'Director of TARC'}</h2>
              <p className="text-sm text-muted-foreground">
                {settings?.directorTitle || 'Director, Tepi Agricultural Research Center'}
              </p>

              <div
                className="text-muted-foreground leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: directorHtml }}
              />

              <div className="pt-4">
                <p className="font-semibold">{settings?.directorName || 'Dr. [Director Name]'}</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.directorTitle || 'Director, TARC'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
