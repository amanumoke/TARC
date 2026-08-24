/**
 * @file apps/dashboard/src/features/vehicles/AdminVehiclesPage.tsx
 * @description Admin vehicles management page with CRUD table and status badges.
 * Allows administrators to manage fleet vehicles and assignments.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';

interface Vehicle {
  id: string;
  registrationPlate: string;
  make: string;
  model: string;
  year: number;
  status: string;
  vehicleType: string;
}

async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await fetch('/api/v1/admin/operations/admin/vehicles', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await response.json();
  return data.data;
}

async function deleteVehicle(id: string): Promise<void> {
  await fetch(`/api/v1/admin/operations/admin/vehicles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
}

function VehicleRowSkeleton() {
  return (
    <tr>
      <td className="p-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-20" />
      </td>
    </tr>
  );
}

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  IN_USE: 'bg-blue-100 text-blue-700',
  UNDER_MAINTENANCE: 'bg-yellow-100 text-yellow-700',
  DECOMMISSIONED: 'bg-gray-100 text-gray-700',
};

export function AdminVehiclesPage() {
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: fetchVehicles,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Vehicles</h1>
          <p className="text-muted-foreground">Manage institutional vehicles and assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-medium">Plate</th>
                <th className="p-3 text-left font-medium">Vehicle</th>
                <th className="p-3 text-left font-medium">Type</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map(() => (
                    <VehicleRowSkeleton key={crypto.randomUUID()} />
                  ))
                : vehicles?.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono">{vehicle.registrationPlate}</td>
                      <td className="p-3">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </td>
                      <td className="p-3">{vehicle.vehicleType}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[vehicle.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {vehicle.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
