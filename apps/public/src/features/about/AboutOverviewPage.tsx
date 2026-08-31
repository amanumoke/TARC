import { useSettings } from '@/api/hooks/useSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, ChevronRight, Eye, Shield, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutOverviewPage() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">About Us</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold">About TARC</h1>
        <p className="text-muted-foreground mt-2">
          {settings?.aboutText ||
            'Learn about our mission, vision, and agricultural research mandate.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Eye className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {settings?.visionText ||
                'To be a center of excellence in agricultural research, contributing to the transformation of Ethiopian agriculture through innovative technologies, skilled human resources, and strategic partnerships.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Target className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {settings?.missionText ||
                'To conduct innovative agricultural research and development in spices, coffee, and horticulture, providing improved technologies and knowledge for food security and economic growth in Southwest Ethiopia.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Mandate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {settings?.aboutText ||
                'TARC is mandated to conduct research in spice crops, coffee, horticultural crops, plant genetic resource conservation, and farmer extension and technology dissemination.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/about/director"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Director's Message</p>
                <p className="text-sm text-muted-foreground">Welcome from our leadership</p>
              </div>
            </Link>
            <Link
              to="/about/departments"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Our Departments</p>
                <p className="text-sm text-muted-foreground">Research divisions and teams</p>
              </div>
            </Link>
            <Link
              to="/about/people"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Meet Our Team</p>
                <p className="text-sm text-muted-foreground">Researchers and staff</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
