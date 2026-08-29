import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, FolderOpen, MessageSquare, Newspaper, UserPlus } from 'lucide-react';

interface Activity {
  id: string;
  type: 'project' | 'publication' | 'news' | 'event' | 'staff' | 'message';
  description: string;
  user: string;
  timestamp: string;
}

const activityIcons: Record<Activity['type'], React.ComponentType<{ className?: string }>> = {
  project: FolderOpen,
  publication: BookOpen,
  news: Newspaper,
  event: Calendar,
  staff: UserPlus,
  message: MessageSquare,
};

const activityColors: Record<Activity['type'], string> = {
  project: 'bg-primary/10 text-primary',
  publication: 'bg-info/10 text-info',
  news: 'bg-warning/10 text-warning',
  event: 'bg-success/10 text-success',
  staff: 'bg-accent/10 text-accent-foreground',
  message: 'bg-muted text-muted-foreground',
};

interface RecentActivityListProps {
  activities: Activity[];
  title?: string;
}

export function RecentActivityList({
  activities,
  title = 'Recent Activity',
}: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">No recent activity</p>
          )}
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`rounded-lg p-1.5 ${activityColors[activity.type]}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{activity.description}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    by {activity.user} · {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
