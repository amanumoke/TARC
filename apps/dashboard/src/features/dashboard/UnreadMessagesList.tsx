import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  senderName: string;
  subject: string;
  message: string;
  createdAt: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface UnreadMessagesListProps {
  messages: Message[];
}

export function UnreadMessagesList({ messages }: UnreadMessagesListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
        <Link to="/dashboard/messages" className="text-primary text-xs font-medium hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">No unread messages</p>
          )}
          {messages.map((msg) => (
            <Link
              key={msg.id}
              to={`/dashboard/messages?id=${msg.id}`}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(msg.senderName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{msg.senderName}</p>
                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-medium text-foreground">{msg.subject}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{msg.message}</p>
              </div>
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
