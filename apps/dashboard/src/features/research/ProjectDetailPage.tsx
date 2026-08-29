import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/features/shared/ConfirmDialog';
import { PageHeader } from '@/features/shared/PageHeader';
import { StatusBadge } from '@/features/shared/StatusBadge';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { cn } from '@/lib/utils';
import { ArrowLeft, BookOpen, Calendar, FolderOpen, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ProjectDetail {
  id: string;
  title: string;
  code: string;
  summary?: string;
  researchProgramId: string;
  researchProgramTitle?: string;
  departmentId: string;
  departmentName?: string;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  fundingSource?: string;
  budget?: number;
  teamMembers?: { id: string; name: string; role: string }[];
  publications?: { id: string; title: string; publicationYear: number }[];
  createdAt: string;
  updatedAt: string;
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const projectId = id || '';

  const { data: project, isLoading } = useApiQuery<{ data: ProjectDetail }>({
    queryKey: ['project-detail', projectId],
    endpoint: `/api/v1/admin/research/projects/${projectId}`,
    enabled: !!id,
  });

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/admin/research/projects/${projectId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-projects'],
    onSuccess: () => navigate('/dashboard/projects'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading..." description="Please wait" />
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Fixed-count skeleton placeholders
            <div key={`skeleton-${i}`} className="h-10 rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!project?.data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Not Found" description="Project not found" />
        <Button variant="outline" onClick={() => navigate('/dashboard/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  const p = project.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{p.title}</h1>
          <p className="text-sm text-muted-foreground">Code: {p.code}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <StatusBadge status={p.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Research Program</p>
                  <p className="font-medium">{p.researchProgramTitle || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{p.departmentName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Funding Source</p>
                  <p className="font-medium">{p.fundingSource || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-medium">{p.budget ? `$${p.budget.toLocaleString()}` : '-'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-2">Summary</p>
                <p className="text-sm">{p.summary || 'No summary provided.'}</p>
              </div>
            </CardContent>
          </Card>

          {p.teamMembers && p.teamMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {p.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {p.publications && p.publications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Related Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {p.publications.map((pub) => (
                    <div
                      key={pub.id}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div>
                        <p className="font-medium">{pub.title}</p>
                        <p className="text-xs text-muted-foreground">Year: {pub.publicationYear}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                onClick={() => navigate(`/dashboard/projects/${id}/edit`)}
              >
                Edit Project
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setDeleting(true)}
              >
                Delete Project
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p>
                  {new Date(p.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated</p>
                <p>
                  {new Date(p.updatedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleting}
        onOpenChange={(open) => setDeleting(open)}
        title="Delete project?"
        description="This action cannot be undone. The project will be permanently removed."
        confirmLabel="Delete Project"
        onConfirm={() => {
          if (id) deleteMutation.mutate(id);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
