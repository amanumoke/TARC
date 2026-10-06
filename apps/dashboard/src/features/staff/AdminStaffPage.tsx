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
import { MoreHorizontal, Pencil, PowerOff, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { StaffForm } from './StaffForm';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  areasOfExpertise?: string[];
  bio?: string;
  isActive: boolean;
  isPublic: boolean;
  photoUrl?: string;
}

interface StaffResponse {
  data: StaffMember[];
  meta?: { total: number; totalPages: number };
}

export function AdminStaffPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: staffData, isLoading } = useApiQuery<StaffResponse>({
    queryKey: ['admin-staff', page, search, statusFilter],
    endpoint: `/api/v1/staff/admin?page=${page}&limit=10&search=${encodeURIComponent(search)}${statusFilter !== 'all' ? `&isActive=${statusFilter === 'active'}` : ''}`,
  });

  const { data: departmentData } = useApiQuery<{ data: { id: string; name: string }[] }>({
    queryKey: ['staff-departments-list'],
    endpoint: '/api/v1/departments/admin?limit=100',
  });

  const createMutation = useApiMutation<StaffMember, Record<string, unknown>>({
    endpoint: '/api/v1/staff/admin',
    method: 'POST',
    queryKeyToInvalidate: ['admin-staff'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<StaffMember, Record<string, unknown> & { id: string }>({
    endpoint: `/api/v1/staff/admin/${editingStaff?.id}`,
    method: 'PUT',
    queryKeyToInvalidate: ['admin-staff'],
    onSuccess: () => {
      setShowForm(false);
      setEditingStaff(null);
    },
  });

  // Toggle active/inactive status inline without opening the form
  const toggleActiveMutation = useApiMutation<StaffMember, { id: string; isActive: boolean }>({
    endpoint: `/api/v1/staff/admin/${togglingId}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-staff'],
    onSuccess: () => setTogglingId(null),
    onError: () => setTogglingId(null),
  });

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/staff/admin/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-staff'],
    onSuccess: () => setDeletingId(null),
  });

  const staff = staffData?.data || [];
  const meta = staffData?.meta;

  const columns: Column<StaffMember>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => (
        <div>
          <p className="font-medium">
            {item.firstName} {item.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    { key: 'position', header: 'Position' },
    {
      key: 'departmentName',
      header: 'Department',
      render: (item) => item.departmentName || '-',
    },
    {
      key: 'areasOfExpertise',
      header: 'Expertise',
      render: (item) => item.areasOfExpertise?.slice(0, 2).join(', ') || '-',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => <StatusBadge status={item.isActive ? 'ACTIVE' : 'INACTIVE'} />,
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
                setEditingStaff(item);
                setShowForm(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {/* Toggle active / inactive */}
            <DropdownMenuItem
              onClick={() => {
                setTogglingId(item.id);
                toggleActiveMutation.mutate({ id: item.id, isActive: !item.isActive });
              }}
              className={item.isActive ? 'text-amber-600' : 'text-emerald-600'}
            >
              {item.isActive ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" /> Set Inactive
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" /> Set Active
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeletingId(item.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Manage approved staff information."
        action={{ label: 'Add Staff', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
          />
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 rounded-md border p-0.5 bg-muted/30">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => { setStatusFilter(f); setPage(1); }}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                  statusFilter === f
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Live count badges */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {statusFilter !== 'all' && meta?.total !== undefined && (
              <span className={`px-2 py-0.5 rounded-full font-semibold ${
                statusFilter === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {meta.total} {statusFilter}
              </span>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={staff}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No staff members found"
          emptyDescription="Try changing your filters or add a new staff member."
        />
      </div>

      <StaffForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingStaff(null);
        }}
        initialData={
          editingStaff
            ? {
                firstName: editingStaff.firstName,
                lastName: editingStaff.lastName,
                position: editingStaff.position,
                email: editingStaff.email,
                departmentId: editingStaff.departmentId,
                bio: editingStaff.bio || undefined,
                areasOfExpertise: editingStaff.areasOfExpertise?.join(', '),
                photoUrl: editingStaff.photoUrl,
                isPublic: editingStaff.isPublic,
                isActive: editingStaff.isActive,
              }
            : undefined
        }
        onSubmit={(data) => {
          const submitData = {
            ...data,
            areasOfExpertise: data.areasOfExpertise
              ? data.areasOfExpertise.split(',').map((area) => area.trim()).filter(Boolean)
              : [],
          };
          if (editingStaff) {
            updateMutation.mutate({ ...submitData, id: editingStaff.id });
          } else {
            createMutation.mutate(submitData);
          }
        }}
        loading={createMutation.isPending || updateMutation.isPending}
        departments={departmentData?.data || []}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete staff member?"
        description="This action cannot be undone. The staff member will be permanently removed."
        confirmLabel="Delete Staff"
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
