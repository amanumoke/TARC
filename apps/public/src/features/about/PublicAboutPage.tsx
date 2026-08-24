/**
 * @file apps/public/src/features/about/PublicAboutPage.tsx
 * @description Public about page with institutional mandate, mission, and vision.
 * Displays TARC's history, goals, and organizational structure.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, History, Target } from 'lucide-react';

/**
 * Public about page component.
 * Displays institutional information with mission, vision, and history.
 */
export function PublicAboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">About TARC</h1>
        <p className="text-muted-foreground">
          Learn about our mission, vision, and agricultural research mandate.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Target className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To conduct innovative agricultural research and development in spices, coffee, and
              horticulture, providing improved technologies and knowledge for food security and
              economic growth in Southwest Ethiopia.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Eye className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be a center of excellence in agricultural research, contributing to the
              transformation of Ethiopian agriculture through innovative technologies, skilled human
              resources, and strategic partnerships.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <History className="h-8 w-8 text-primary mb-2" />
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Established in 1970, TARC has been at the forefront of agricultural research in
              Southwest Ethiopia for over five decades, developing improved varieties and
              sustainable farming practices.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Mandate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            TARC is mandated to conduct research in the following areas:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Spice crops: Cardamom, Ginger, Turmeric, and essential oils</li>
            <li>Coffee research: Arabica varieties, agroforestry systems, and soil health</li>
            <li>Horticultural crops: Fruits, vegetables, and ornamental plants</li>
            <li>Plant genetic resource conservation and management</li>
            <li>Farmer extension and technology dissemination</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
