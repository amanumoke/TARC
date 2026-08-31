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
import { ResearchProgramForm } from './ResearchProgramForm';

interface ResearchProgram {
  id: string;
  title: string;
  code: string;
  description: string;
  departmentName?: string;
  departmentId?: string;
  status: string;
  projectsCount?: number;
}

interface ProgramResponse {
  data: ResearchProgram[];
  meta?: { total: number; totalPages: number };
}

export function AdminResearchProgramsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ResearchProgram | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: programData, isLoading } = useApiQuery<ProgramResponse>({
    queryKey: ['admin-research-programs', page, search],
    endpoint: `/api/v1/research/admin/programs?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const { data: deptData } = useApiQuery<{ data: { id: string; name: string }[] }>({
    queryKey: ['departments-list'],
    endpoint: '/api/v1/departments/admin?limit=100',
  });

  const departments = deptData?.data || [];

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/research/admin/programs/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-research-programs'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<ResearchProgram, Partial<ResearchProgram>>({
    endpoint: '/api/v1/research/admin/programs',
    method: 'POST',
    queryKeyToInvalidate: ['admin-research-programs'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<ResearchProgram, Partial<ResearchProgram> & { id: string }>(
    {
      endpoint: `/api/v1/research/admin/programs/${editingProgram?.id}`,
      method: 'PATCH',
      queryKeyToInvalidate: ['admin-research-programs'],
      onSuccess: () => {
        setShowForm(false);
        setEditingProgram(null);
      },
    }
  );

  const programs = programData?.data || [];
  const meta = programData?.meta;

  const columns: Column<ResearchProgram>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (item) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.code}</p>
        </div>
      ),
    },
    {
      key: 'departmentName',
      header: 'Department',
      render: (item) => item.departmentName || '-',
    },
    {
      key: 'projectsCount',
      header: 'Projects',
      render: (item) => item.projectsCount || 0,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
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
                setEditingProgram(item);
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

  const handleSubmit = (data: Partial<ResearchProgram>) => {
    if (editingProgram) {
      updateMutation.mutate({ ...data, id: editingProgram.id });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Programs"
        description="Manage research programs and their details."
        action={{ label: 'Add Program', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search programs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
        />

        <DataTable
          columns={columns}
          data={programs}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No research programs found"
          emptyDescription="Create your first research program to get started."
        />
      </div>

      <ResearchProgramForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingProgram(null);
        }}
        initialData={
          editingProgram
            ? {
                title: editingProgram.title,
                code: editingProgram.code,
                description: editingProgram.description,
                departmentId: editingProgram.departmentId,
                status: editingProgram.status,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        departments={departments}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete research program?"
        description="This action cannot be undone. The program will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
