/**
 * @file apps/dashboard/src/features/messages/AdminMessagesPage.tsx
 * @description Admin messages management page with status filtering.
 * Allows administrators to manage contact inquiries and reply notes.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  status: string;
  createdAt: string;
}

async function fetchMessages(): Promise<Message[]> {
  const response = await fetch('/api/v1/admin/operations/admin/messages', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await response.json();
  return data.data;
}

async function deleteMessage(id: string): Promise<void> {
  await fetch(`/api/v1/admin/operations/admin/messages/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
}

function MessageRowSkeleton() {
  return (
    <tr>
      <td className="p-3">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-48" />
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

const statusColors: Record<string, string> = {
  UNREAD: 'bg-red-100 text-red-700',
  READ: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  REPLIED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-gray-100 text-gray-700',
};

export function AdminMessagesPage() {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: fetchMessages,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Manage contact inquiries and submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-medium">From</th>
                <th className="p-3 text-left font-medium">Subject</th>
                <th className="p-3 text-left font-medium">Date</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map(() => (
                    <MessageRowSkeleton key={crypto.randomUUID()} />
                  ))
                : messages?.map((message) => (
                    <tr key={message.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{message.senderName}</td>
                      <td className="p-3">{message.subject}</td>
                      <td className="p-3">{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[message.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {message.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(message.id)}
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
