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
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DepartmentForm, DepartmentFormData } from './DepartmentForm';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  establishedYear: number | null;
}

interface DepartmentResponse {
  data: Department[];
  meta?: { total: number; totalPages: number };
}

export function AdminDepartmentsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: deptData, isLoading } = useApiQuery<DepartmentResponse>({
    queryKey: ['admin-departments', page, search],
    endpoint: `/api/v1/admin/departments?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/admin/departments/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-departments'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<Department, Partial<Department>>({
    endpoint: '/api/v1/admin/departments',
    method: 'POST',
    queryKeyToInvalidate: ['admin-departments'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<Department, Partial<Department> & { id: string }>({
    endpoint: `/api/v1/admin/departments/${editingDept?.id}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-departments'],
    onSuccess: () => {
      setShowForm(false);
      setEditingDept(null);
    },
  });

  const departments = deptData?.data || [];
  const meta = deptData?.meta;

  const columns: Column<Department>[] = [
    { key: 'name', header: 'Name', render: (item) => <p className="font-medium">{item.name}</p> },
    { key: 'code', header: 'Code' },
    {
      key: 'description',
      header: 'Description',
      render: (item) => (
        <p className="max-w-xs truncate text-muted-foreground text-xs">{item.description || '-'}</p>
      ),
    },
    {
      key: 'establishedYear',
      header: 'Established',
      render: (item) => item.establishedYear || '-',
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
                setEditingDept(item);
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

  const handleSubmit = (data: DepartmentFormData) => {
    const submitData: Partial<Department> = {
      ...data,
      establishedYear: data.establishedYear ? Number.parseInt(data.establishedYear, 10) : undefined,
    };
    if (editingDept) {
      updateMutation.mutate({ ...submitData, id: editingDept.id });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage research departments."
        action={{ label: 'Add Department', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
        />

        <DataTable
          columns={columns}
          data={departments}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No departments found"
          emptyDescription="Create your first department to get started."
        />
      </div>

      <DepartmentForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingDept(null);
        }}
        initialData={
          editingDept
            ? {
                name: editingDept.name,
                code: editingDept.code,
                description: editingDept.description || undefined,
                establishedYear: editingDept.establishedYear?.toString(),
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete department?"
        description="This action cannot be undone. The department will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
