/**
 * @file apps/dashboard/src/features/gallery/AdminGalleryPage.tsx
 * @description Admin gallery management page with CRUD table.
 * Allows administrators to manage categorized photo gallery.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';

interface GalleryMedia {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

async function fetchGallery(): Promise<GalleryMedia[]> {
  const response = await fetch('/api/v1/admin/communication/admin/gallery', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await response.json();
  return data.data;
}

async function deleteGalleryMedia(id: string): Promise<void> {
  await fetch(`/api/v1/admin/communication/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
}

function GalleryRowSkeleton() {
  return (
    <tr>
      <td className="p-3">
        <Skeleton className="h-4 w-64" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-32" />
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

export function AdminGalleryPage() {
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: fetchGallery,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage photo gallery and media assets</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Media</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-medium">Title</th>
                <th className="p-3 text-left font-medium">Category</th>
                <th className="p-3 text-left font-medium">Created</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map(() => (
                    <GalleryRowSkeleton key={crypto.randomUUID()} />
                  ))
                : media?.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{item.title}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
