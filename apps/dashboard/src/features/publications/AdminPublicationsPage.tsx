/**
 * @file apps/dashboard/src/features/publications/AdminPublicationsPage.tsx
 * @description Admin publications management page with CRUD table.
 * Allows administrators to manage scientific publications.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  publicationType: string;
  publicationYear: number;
  isFeatured: boolean;
}

async function fetchPublications(): Promise<Publication[]> {
  const response = await fetch('/api/v1/admin/publications', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await response.json();
  return data.data;
}

async function deletePublication(id: string): Promise<void> {
  await fetch(`/api/v1/admin/publications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
}

function PublicationRowSkeleton() {
  return (
    <tr>
      <td className="p-3">
        <Skeleton className="h-4 w-64" />
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
    </tr>
  );
}

export function AdminPublicationsPage() {
  const queryClient = useQueryClient();

  const { data: publications, isLoading } = useQuery({
    queryKey: ['admin-publications'],
    queryFn: fetchPublications,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publications</h1>
          <p className="text-muted-foreground">
            Manage scientific publications and research papers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Publication
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-medium">Title</th>
                <th className="p-3 text-left font-medium">Type</th>
                <th className="p-3 text-left font-medium">Year</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map(() => (
                    <PublicationRowSkeleton key={crypto.randomUUID()} />
                  ))
                : publications?.map((pub) => (
                    <tr key={pub.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{pub.title}</td>
                      <td className="p-3">{pub.publicationType}</td>
                      <td className="p-3">{pub.publicationYear}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(pub.id)}>
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
