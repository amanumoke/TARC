import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/features/shared/EmptyState';
import { PageHeader } from '@/features/shared/PageHeader';
import { StatusBadge } from '@/features/shared/StatusBadge';
import { useApiQuery } from '@/hooks/useApiQuery';
import { cn } from '@/lib/utils';
import { Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface MessageResponse {
  data: Message[];
  meta?: { total: number; totalPages: number };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AdminMessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: messageData, isLoading } = useApiQuery<MessageResponse>({
    queryKey: ['admin-messages'],
    endpoint: '/api/v1/admin/operations/messages',
  });

  const messages = messageData?.data || [];
  const selectedMessage = messages.find((m) => m.id === selectedId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Review and manage contact messages from the public."
      />

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 3 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Fixed-count skeleton placeholders
            <Card key={`skeleton-${i}`} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages"
          description="Contact messages from the public will appear here."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            {messages.map((msg) => (
              <button
                type="button"
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50',
                  selectedId === msg.id && 'border-primary bg-primary/5'
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(msg.senderName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{msg.senderName}</p>
                    <StatusBadge status={msg.status} />
                  </div>
                  <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                    {msg.subject}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{msg.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <Card className="sticky top-4 hidden lg:block">
            {selectedMessage ? (
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                    <p className="text-muted-foreground text-sm">
                      From: {selectedMessage.senderName} ({selectedMessage.senderEmail})
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div className="flex gap-2 border-t pt-4">
                    <Button variant="outline" size="sm">
                      Mark as Read
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="flex items-center justify-center p-12">
                <p className="text-muted-foreground text-sm">Select a message to view details</p>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
