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
import { PublicationForm, PublicationFormData } from './PublicationForm';

interface Publication {
  id: string;
  title: string;
  publicationType: string;
  publicationYear: number;
  publisherOrJournal?: string;
  isFeatured: boolean;
}

interface PublicationResponse {
  data: Publication[];
  meta?: { total: number; totalPages: number };
}

export function AdminPublicationsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: pubData, isLoading } = useApiQuery<PublicationResponse>({
    queryKey: ['admin-publications', page, search],
    endpoint: `/api/v1/publications/admin?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const { data: projectData } = useApiQuery<{ data: { id: string; title: string }[] }>({
    queryKey: ['projects-list'],
    endpoint: '/api/v1/research/admin/projects?limit=100',
  });

  const projects = projectData?.data || [];

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/publications/admin/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-publications'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<Publication, Partial<Publication>>({
    endpoint: '/api/v1/publications/admin',
    method: 'POST',
    queryKeyToInvalidate: ['admin-publications'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<Publication, Partial<Publication> & { id: string }>({
    endpoint: `/api/v1/publications/admin/${editingPub?.id}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-publications'],
    onSuccess: () => {
      setShowForm(false);
      setEditingPub(null);
    },
  });

  const publications = pubData?.data || [];
  const meta = pubData?.meta;

  const columns: Column<Publication>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (item) => <p className="font-medium">{item.title}</p>,
    },
    {
      key: 'publicationType',
      header: 'Type',
      render: (item) => <span className="text-xs">{item.publicationType.replace(/_/g, ' ')}</span>,
    },
    { key: 'publicationYear', header: 'Year' },
    {
      key: 'publisherOrJournal',
      header: 'Publisher',
      render: (item) => item.publisherOrJournal || '-',
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
                setEditingPub(item);
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

  const handleSubmit = (data: PublicationFormData) => {
    const submitData: Partial<Publication> = {
      ...data,
      publicationYear: data.publicationYear ? Number.parseInt(data.publicationYear, 10) : undefined,
    };
    if (editingPub) {
      updateMutation.mutate({ ...submitData, id: editingPub.id });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publications"
        description="Manage research publications and papers."
        action={{ label: 'Add Publication', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search publications..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
        />

        <DataTable
          columns={columns}
          data={publications}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No publications found"
          emptyDescription="Add your first publication to get started."
        />
      </div>

      <PublicationForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingPub(null);
        }}
        initialData={
          editingPub
            ? {
                title: editingPub.title,
                publicationType: editingPub.publicationType,
                publicationYear: editingPub.publicationYear.toString(),
                publisherOrJournal: editingPub.publisherOrJournal,
                isPeerReviewed: editingPub.isFeatured,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        projects={projects}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete publication?"
        description="This action cannot be undone. The publication will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
