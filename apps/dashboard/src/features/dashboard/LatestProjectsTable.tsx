import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  programTitle?: string;
  status: string;
  startDate?: string | null;
}

const statusStyles: Record<string, string> = {
  ONGOING: 'border-success/20 bg-success/10 text-success',
  COMPLETED: 'border-border bg-muted text-muted-foreground',
  PROPOSED: 'border-info/20 bg-info/10 text-info',
  ON_HOLD: 'border-warning/20 bg-warning/10 text-warning',
};

interface LatestProjectsTableProps {
  projects: Project[];
}

export function LatestProjectsTable({ projects }: LatestProjectsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Latest Projects</CardTitle>
        <Link to="/dashboard/projects" className="text-primary text-xs font-medium hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">No projects yet</p>
          )}
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{project.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{project.programTitle ?? ''}</p>
              </div>
              <div className="ml-4 flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn('text-[10px] font-medium', statusStyles[project.status] || '')}
                >
                  {project.status.replace(/_/g, ' ')}
                </Badge>
                {project.startDate && (
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
