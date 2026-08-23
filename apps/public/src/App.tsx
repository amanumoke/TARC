/**
 * @file apps/public/src/App.tsx
 * @description Main application root for the TARCMS Public Institutional Portal & Portfolio.
 * Provides the public showcase landing view, navigation header, mission overview,
 * and quick access to research, publications, and management links.
 */

import { Button } from '@/lib/../components/ui/button';
import { BookOpen, Compass, ExternalLink, Sprout, Users } from 'lucide-react';
import React from 'react';

/**
 * Root Public Application Component.
 */
export function App(): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. Public Top Navigation Bar */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-lg leading-tight block">TARCMS</span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Tepi Agricultural Research Center
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Research
            </Button>
            <Button variant="ghost" size="sm">
              Publications
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5"
              >
                <span>Management Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* 2. Hero Showcase Section */}
      <main className="flex-1">
        <section className="py-20 px-4 bg-gradient-to-b from-primary/5 via-transparent to-transparent text-center">
          <div className="container mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sprout className="h-3.5 w-3.5" />
              <span>Southwest Ethiopia Agricultural Innovation</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Pioneering Spices, Coffee &amp; Horticultural Excellence
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering farmers, advancing agricultural biodiversity, and publishing peer-reviewed
              research in Sheka, Southwest Ethiopia.
            </p>

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

        {/* 3. High-Level Agricultural Focus Pillars */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Sprout className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold mb-2">Spices &amp; Essential Oils</h2>
              <p className="text-sm text-muted-foreground">
                National research hub for improved varieties of Cardamom, Ginger, and Turmeric.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold mb-2">Coffee &amp; Agroforestry</h2>
              <p className="text-sm text-muted-foreground">
                High-altitude Arabica coffee trials, shade canopy management, and soil health.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold mb-2">Farmer Extension &amp; Advisory</h2>
              <p className="text-sm text-muted-foreground">
                Distributing clean disease-free planting materials and conducting field
                demonstrations.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Public Institutional Footer */}
      <footer className="border-t border-border py-8 bg-muted/40 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Tepi Agricultural Research Center (TARC). All rights
            reserved.
          </p>
          <p className="text-xs mt-1 text-muted-foreground/80">
            Tepi, Sheka Zone, Southwest Ethiopia
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
