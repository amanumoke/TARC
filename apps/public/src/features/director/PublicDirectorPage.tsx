/**
 * @file apps/public/src/features/director/PublicDirectorPage.tsx
 * @description Public director's welcome page with leadership message.
 * Displays the director's official welcome address and institutional leadership.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const directorPhoto = '/images/director-dereje.jpg';

/**
 * Public director's welcome page component.
 * Displays the director's official welcome message and leadership information.
 */
export function PublicDirectorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Director's Welcome</h1>
        <p className="text-muted-foreground">Welcome message from the Director of TARC.</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={directorPhoto}
                alt="Dr. Dereje Tulu"
                className="w-48 h-auto max-h-72 rounded-lg bg-muted object-contain object-center"
              />
            </div>

            {/* Welcome message */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Welcome to TARC</h2>
              <p className="text-muted-foreground">
                It is my pleasure to welcome you to the official portal of Tepi Agricultural
                Research Center (TARC), operating under the Ethiopian Institute of Agricultural
                Research (EIAR).
              </p>
              <p className="text-muted-foreground">
                As the national coordinating center for spice research and development in Ethiopia,
                TARC leads national efforts in spices (Korarima, Black Pepper, Ginger, Turmeric,
                Vanilla) and the national cacao research and development program. We also drive
                critical research in Arabica coffee productivity, tropical horticulture, veterinary
                disease epidemiology, and sustainable agroforestry across Southwest Ethiopia.
              </p>
              <p className="text-muted-foreground">
                Through this platform, we share our latest scientific findings, publications,
                variety releases, and farmer-focused technologies to advance Ethiopian agriculture.
              </p>
              <div className="pt-4">
                <p className="font-semibold">Dr. Dereje Tulu (DVM, MSc)</p>
                <p className="text-sm text-muted-foreground">
                  Center Director & Senior Researcher, Tepi Agricultural Research Center (EIAR)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership & Research Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Center Director</p>
              <p className="text-sm text-muted-foreground">
                Dr. Dereje Tulu — Overall institutional leadership, strategic direction, and external partnerships
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Research Directorates (13 Divisions)</p>
              <p className="text-sm text-muted-foreground">
                Spices, Coffee, Cacao, Field Crops, Horticulture, Livestock, Biotech, Protection, Soil, Economics, Extension & Food Science
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Administration & Operations Directorate</p>
              <p className="text-sm text-muted-foreground">
                Finance, HR, Fleet Operations, Procurement & Research Station Infrastructure
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Technology Transfer & Seed Multiplication</p>
              <p className="text-sm text-muted-foreground">
                Outreach, Farmer Field Schools, certified spice/coffee seedling distribution
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
