/**
 * @file apps/public/src/features/director/PublicDirectorPage.tsx
 * @description Public director's welcome page with leadership message.
 * Displays the director's official welcome address and institutional leadership.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

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
            {/* Director photo placeholder */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-lg bg-muted flex items-center justify-center">
                <User className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </div>

            {/* Welcome message */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Welcome to TARC</h2>
              <p className="text-muted-foreground">
                It is my pleasure to welcome you to the Tepi Agricultural Research Center (TARC)
                website. For over five decades, TARC has been at the forefront of agricultural
                research and innovation in Southwest Ethiopia.
              </p>
              <p className="text-muted-foreground">
                Our dedicated team of researchers works tirelessly to develop improved varieties of
                spices, coffee, and horticultural crops, while promoting sustainable farming
                practices that benefit smallholder farmers in our region.
              </p>
              <p className="text-muted-foreground">
                Through this website, we aim to share our research findings, publications, and
                technologies with the broader agricultural community. I invite you to explore our
                work and join us in our mission to transform Ethiopian agriculture.
              </p>
              <div className="pt-4">
                <p className="font-semibold">Dr. [Director Name]</p>
                <p className="text-sm text-muted-foreground">Director, TARC</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Director</p>
              <p className="text-sm text-muted-foreground">
                Overall leadership and strategic direction
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Deputy Director (Research)</p>
              <p className="text-sm text-muted-foreground">
                Research programs and scientific output
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Deputy Director (Administration)</p>
              <p className="text-sm text-muted-foreground">
                Operations and administrative services
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Head of Department</p>
              <p className="text-sm text-muted-foreground">Departmental research coordination</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
