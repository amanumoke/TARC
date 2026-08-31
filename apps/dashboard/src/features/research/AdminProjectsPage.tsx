import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/features/shared/ConfirmDialog';
import { Column, DataTable } from '@/features/shared/DataTable';
import { PageHeader } from '@/features/shared/PageHeader';
import { StatusBadge } from '@/features/shared/StatusBadge';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ProjectForm, ProjectFormData } from './ProjectForm';

interface Project {
  id: string;
  title: string;
  code?: string;
  programTitle?: string;
  researchProgramId?: string;
  departmentId?: string;
  departmentName?: string;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  summary?: string;
  fundingSource?: string;
  budget?: number;
}

interface ProjectResponse {
  data: Project[];
  meta?: { total: number; totalPages: number };
}

export function AdminProjectsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: projectData, isLoading } = useApiQuery<ProjectResponse>({
    queryKey: ['admin-projects', page, search],
    endpoint: `/api/v1/research/admin/projects?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const { data: programData } = useApiQuery<{ data: { id: string; title: string }[] }>({
    queryKey: ['research-programs-list'],
    endpoint: '/api/v1/research/admin/programs?limit=100',
  });

  const { data: deptData } = useApiQuery<{ data: { id: string; name: string }[] }>({
    queryKey: ['departments-list'],
    endpoint: '/api/v1/departments/admin?limit=100',
  });

  const programs = programData?.data || [];
  const departments = deptData?.data || [];

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/research/admin/projects/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-projects'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<Project, Partial<Project>>({
    endpoint: '/api/v1/research/admin/projects',
    method: 'POST',
    queryKeyToInvalidate: ['admin-projects'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<Project, Partial<Project> & { id: string }>({
    endpoint: `/api/v1/research/admin/projects/${editingProject?.id}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-projects'],
    onSuccess: () => {
      setShowForm(false);
      setEditingProject(null);
    },
  });

  const projects = projectData?.data || [];
  const meta = projectData?.meta;

  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'Project',
      render: (item) => (
        <div>
          <p className="font-medium">{item.title}</p>
          {item.code && <p className="text-xs text-muted-foreground">{item.code}</p>}
        </div>
      ),
    },
    {
      key: 'programTitle',
      header: 'Program',
      render: (item) => item.programTitle || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (item) =>
        item.startDate
          ? new Date(item.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '-',
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (item) =>
        item.endDate
          ? new Date(item.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '-',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-[50px]',
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingProject(item);
                setShowForm(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeletingId(item.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleSubmit = (data: ProjectFormData) => {
    const submitData: Partial<Project> = {
      ...data,
      budget: data.budget ? Number.parseFloat(data.budget) : undefined,
    };
    if (editingProject) {
      updateMutation.mutate({ ...submitData, id: editingProject.id });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage research projects and their details."
        action={{ label: 'Add Project', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
        />

        <DataTable
          columns={columns}
          data={projects}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No projects found"
          emptyDescription="Create your first research project to get started."
        />
      </div>

      <ProjectForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingProject(null);
        }}
        initialData={
          editingProject
            ? {
                title: editingProject.title,
                code: editingProject.code,
                summary: editingProject.summary,
                researchProgramId: editingProject.researchProgramId,
                departmentId: editingProject.departmentId,
                startDate: editingProject.startDate ? editingProject.startDate.split('T')[0] : '',
                endDate: editingProject.endDate ? editingProject.endDate.split('T')[0] : '',
                status: editingProject.status,
                fundingSource: editingProject.fundingSource,
                budget: editingProject.budget?.toString(),
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        programs={programs}
        departments={departments}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete project?"
        description="This action cannot be undone. The project will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
