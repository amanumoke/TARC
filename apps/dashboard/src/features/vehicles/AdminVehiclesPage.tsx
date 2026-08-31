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
import { Car, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { VehicleForm, VehicleFormData } from './VehicleForm';

interface Vehicle {
  id: string;
  registrationPlate: string;
  make: string;
  model: string;
  vehicleType: string;
  departmentName?: string;
  departmentId?: string;
  driverId?: string;
  driverName?: string;
  fuelType?: string;
  year?: number;
  status: string;
}

interface VehicleResponse {
  data: Vehicle[];
  meta?: { total: number; totalPages: number };
}

export function AdminVehiclesPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: vehicleData, isLoading } = useApiQuery<VehicleResponse>({
    queryKey: ['admin-vehicles', page, search],
    endpoint: `/api/v1/operations/admin/vehicles?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const { data: deptData } = useApiQuery<{ data: { id: string; name: string }[] }>({
    queryKey: ['departments-list'],
    endpoint: '/api/v1/departments/admin?limit=100',
  });

  const { data: staffData } = useApiQuery<{
    data: { id: string; firstName: string; lastName: string }[];
  }>({
    queryKey: ['staff-list'],
    endpoint: '/api/v1/staff/admin?limit=100',
  });

  const departments = deptData?.data || [];
  const drivers =
    staffData?.data?.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
    })) || [];

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/operations/admin/vehicles/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-vehicles'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<Vehicle, Partial<Vehicle>>({
    endpoint: '/api/v1/operations/admin/vehicles',
    method: 'POST',
    queryKeyToInvalidate: ['admin-vehicles'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<Vehicle, Partial<Vehicle> & { id: string }>({
    endpoint: `/api/v1/operations/admin/vehicles/${editingVehicle?.id}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-vehicles'],
    onSuccess: () => {
      setShowForm(false);
      setEditingVehicle(null);
    },
  });

  const vehicles = vehicleData?.data || [];
  const meta = vehicleData?.meta;

  const columns: Column<Vehicle>[] = [
    {
      key: 'registrationPlate',
      header: 'Registration',
      render: (item) => <p className="font-medium font-mono text-xs">{item.registrationPlate}</p>,
    },
    {
      key: 'make',
      header: 'Vehicle',
      render: (item) => (
        <span>
          {item.make} {item.model}
          {item.year && <span className="text-muted-foreground ml-1">({item.year})</span>}
        </span>
      ),
    },
    {
      key: 'vehicleType',
      header: 'Type',
      render: (item) => <span className="text-xs">{item.vehicleType.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'departmentName',
      header: 'Department',
      render: (item) => item.departmentName || '-',
    },
    {
      key: 'driverName',
      header: 'Driver',
      render: (item) => item.driverName || '-',
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
                setEditingVehicle(item);
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

  const handleSubmit = (data: VehicleFormData) => {
    const submitData: Partial<Vehicle> = {
      ...data,
      year: data.year ? Number.parseInt(data.year, 10) : undefined,
    };
    if (editingVehicle) {
      updateMutation.mutate({ ...submitData, id: editingVehicle.id });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Manage vehicle fleet and assignments."
        action={{ label: 'Add Vehicle', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
        />

        <DataTable
          columns={columns}
          data={vehicles}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No vehicles found"
          emptyDescription="Add your first vehicle to get started."
        />
      </div>

      <VehicleForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingVehicle(null);
        }}
        initialData={
          editingVehicle
            ? {
                registrationPlate: editingVehicle.registrationPlate,
                make: editingVehicle.make,
                model: editingVehicle.model,
                year: editingVehicle.year?.toString(),
                vehicleType: editingVehicle.vehicleType,
                departmentId: editingVehicle.departmentId,
                driverId: editingVehicle.driverId,
                fuelType: editingVehicle.fuelType,
                status: editingVehicle.status,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        departments={departments}
        drivers={drivers}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete vehicle?"
        description="This action cannot be undone. The vehicle will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
