import { useDepartments } from '@/api/hooks/useDepartments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Building2, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const deptList = Array.isArray(departments) ? departments : [];

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
        <span className="text-foreground font-medium">Departments</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold">Our Departments</h1>
        <p className="text-muted-foreground mt-2">
          Explore the research divisions and teams driving innovation at TARC.
        </p>
      </div>

      {deptList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No departments available at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deptList.map((dept) => (
            <Card key={dept.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {dept.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {dept.description || 'No description available.'}
                </p>
                <div className="space-y-3">
                  {dept.establishedYear && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Est. {dept.establishedYear}
                    </div>
                  )}
                  <Link
                    to={`/research/${dept.code}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View Research <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
