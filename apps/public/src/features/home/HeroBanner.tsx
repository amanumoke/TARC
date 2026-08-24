/**
 * @file apps/public/src/features/home/HeroBanner.tsx
 * @description Hero banner component with agricultural backdrop and call-to-action.
 * Features responsive design with gradient overlay and action buttons.
 */

import { Button } from '@/components/ui/button';
import { BookOpen, Compass, Sprout } from 'lucide-react';

/**
 * Hero banner section with agricultural theme.
 * Displays main headline, subtitle, and call-to-action buttons.
 */
export function HeroBanner() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-primary/5 via-transparent to-transparent text-center">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sprout className="h-3.5 w-3.5" />
          <span>Southwest Ethiopia Agricultural Innovation</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Pioneering Spices, Coffee &amp; Horticultural Excellence
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Empowering farmers, advancing agricultural biodiversity, and publishing peer-reviewed
          research in Sheka, Southwest Ethiopia.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" className="shadow-lg">
            <BookOpen className="mr-2 h-4 w-4" />
            Explore Publications
          </Button>
          <Button variant="outline" size="lg">
            <Compass className="mr-2 h-4 w-4" />
            Research Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
