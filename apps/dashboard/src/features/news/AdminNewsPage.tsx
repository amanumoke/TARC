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
import { NewsForm } from './NewsForm';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  isPublished: boolean;
  publishedAt?: string | null;
  authorName?: string;
}

interface NewsResponse {
  data: NewsItem[];
  meta?: { total: number; totalPages: number };
}

export function AdminNewsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: newsData, isLoading } = useApiQuery<NewsResponse>({
    queryKey: ['admin-news', page, search],
    endpoint: `/api/v1/admin/communication/news?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/admin/communication/news/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-news'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<NewsItem, Partial<NewsItem>>({
    endpoint: '/api/v1/admin/communication/news',
    method: 'POST',
    queryKeyToInvalidate: ['admin-news'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<NewsItem, Partial<NewsItem> & { id: string }>({
    endpoint: `/api/v1/admin/communication/news/${editingNews?.id}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-news'],
    onSuccess: () => {
      setShowForm(false);
      setEditingNews(null);
    },
  });

  const news = newsData?.data || [];
  const meta = newsData?.meta;

  const columns: Column<NewsItem>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (item) => <p className="font-medium">{item.title}</p>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => <span className="text-xs">{item.category.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'authorName',
      header: 'Author',
      render: (item) => item.authorName || '-',
    },
    {
      key: 'publishedAt',
      header: 'Published',
      render: (item) =>
        item.publishedAt
          ? new Date(item.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '-',
    },
    {
      key: 'isPublished',
      header: 'Status',
      render: (item) => <StatusBadge status={item.isPublished ? 'PUBLISHED' : 'DRAFT'} />,
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
                setEditingNews(item);
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

  const handleSubmit = (data: Partial<NewsItem>) => {
    if (editingNews) {
      updateMutation.mutate({ ...data, id: editingNews.id });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="News"
        description="Manage institutional news and announcements."
        action={{ label: 'Add News', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
        />

        <DataTable
          columns={columns}
          data={news}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No news articles found"
          emptyDescription="Create your first news article to get started."
        />
      </div>

      <NewsForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingNews(null);
        }}
        initialData={
          editingNews
            ? {
                title: editingNews.title,
                category: editingNews.category,
                isPublished: editingNews.isPublished,
                publishedAt: editingNews.publishedAt ? editingNews.publishedAt.split('T')[0] : '',
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
        title="Delete news article?"
        description="This action cannot be undone. The news article will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
