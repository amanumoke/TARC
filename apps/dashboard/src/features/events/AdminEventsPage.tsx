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
import { EventForm } from './EventForm';

interface EventItem {
  id: string;
  title: string;
  eventType: string;
  location: string;
  startTime: string;
  isPublished: boolean;
}

interface EventResponse {
  data: EventItem[];
  meta?: { total: number; totalPages: number };
}

export function AdminEventsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: eventData, isLoading } = useApiQuery<EventResponse>({
    queryKey: ['admin-events', page, search],
    endpoint: `/api/v1/communication/admin/events?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  });

  const deleteMutation = useApiMutation<unknown, string>({
    endpoint: `/api/v1/communication/admin/events/${deletingId}`,
    method: 'DELETE',
    queryKeyToInvalidate: ['admin-events'],
    onSuccess: () => setDeletingId(null),
  });

  const createMutation = useApiMutation<EventItem, Partial<EventItem>>({
    endpoint: '/api/v1/communication/admin/events',
    method: 'POST',
    queryKeyToInvalidate: ['admin-events'],
    onSuccess: () => setShowForm(false),
  });

  const updateMutation = useApiMutation<EventItem, Partial<EventItem> & { id: string }>({
    endpoint: `/api/v1/communication/admin/events/${editingEvent?.id}`,
    method: 'PATCH',
    queryKeyToInvalidate: ['admin-events'],
    onSuccess: () => {
      setShowForm(false);
      setEditingEvent(null);
    },
  });

  const events = eventData?.data || [];
  const meta = eventData?.meta;

  const columns: Column<EventItem>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (item) => <p className="font-medium">{item.title}</p>,
    },
    {
      key: 'eventType',
      header: 'Type',
      render: (item) => <span className="text-xs">{item.eventType.replace(/_/g, ' ')}</span>,
    },
    { key: 'location', header: 'Location' },
    {
      key: 'startTime',
      header: 'Date',
      render: (item) =>
        new Date(item.startTime).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
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
                setEditingEvent(item);
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

  const handleSubmit = (data: Partial<EventItem>) => {
    if (editingEvent) {
      updateMutation.mutate({ ...data, id: editingEvent.id });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage events, workshops, and field days."
        action={{ label: 'Add Event', onClick: () => setShowForm(true) }}
      />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-sm rounded-md border bg-transparent px-3 text-sm"
        />

        <DataTable
          columns={columns}
          data={events}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          page={page}
          totalPages={meta?.totalPages || 1}
          total={meta?.total}
          onPageChange={setPage}
          emptyTitle="No events found"
          emptyDescription="Create your first event to get started."
        />
      </div>

      <EventForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingEvent(null);
        }}
        initialData={
          editingEvent
            ? {
                title: editingEvent.title,
                eventType: editingEvent.eventType,
                location: editingEvent.location,
                startTime: editingEvent.startTime,
                isPublished: editingEvent.isPublished,
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
        title="Delete event?"
        description="This action cannot be undone. The event will be permanently removed."
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
