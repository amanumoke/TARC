import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/features/shared/ConfirmDialog';
import { EmptyState } from '@/features/shared/EmptyState';
import { TableSkeleton } from '@/features/shared/LoadingSkeleton';
import { PageHeader } from '@/features/shared/PageHeader';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { ImageIcon, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { GalleryUploadForm } from './GalleryUploadForm';

interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

interface GalleryResponse {
  data: GalleryItem[];
  meta?: { total: number; totalPages: number };
}

export function AdminGalleryPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: galleryData, isLoading } = useApiQuery<GalleryResponse>({
    queryKey: ['admin-gallery', search],
    endpoint: `/api/v1/admin/communication/gallery?search=${encodeURIComponent(search)}`,
  });

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/admin/communication/gallery/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-gallery'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<GalleryItem, Partial<GalleryItem>>({
    endpoint: '/api/v1/admin/communication/gallery',
    method: 'POST',
    queryKeyToInvalidate: ['admin-gallery'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<GalleryItem, Partial<GalleryItem> & { id: string }>({
    endpoint: `/api/v1/admin/communication/gallery/${editingItem?.id}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-gallery'],
    onSuccess: () => {
      setShowForm(false);
      setEditingItem(null);
    },
  });

  const items = galleryData?.data || [];

  const handleSubmit = (data: Partial<GalleryItem>) => {
    if (editingItem) {
      updateMutation.mutate({ ...data, id: editingItem.id });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Manage approved photographs and media."
        action={{ label: 'Upload Image', onClick: () => setShowForm(true) }}
      />

      <input
        type="text"
        placeholder="Search gallery..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
      />

      {isLoading ? (
        <TableSkeleton rows={3} columns={4} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images found"
          description="Upload your first image to get started."
          action={{ label: 'Upload Image', onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="group overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40">
                  <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
                      >
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingId(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.category.replace(/_/g, ' ')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GalleryUploadForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingItem(null);
        }}
        initialData={
          editingItem
            ? {
                title: editingItem.title,
                caption: editingItem.caption,
                category: editingItem.category,
                imageUrl: editingItem.imageUrl,
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
        title="Delete image?"
        description="This action cannot be undone. The image will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
