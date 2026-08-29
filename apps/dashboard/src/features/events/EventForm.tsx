import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  eventType: z.string().min(1, 'Event Type is required'),
  location: z.string().optional(),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().optional(),
  isAllDay: z.boolean().default(false),
  bannerImageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventSchema>;

const typeOptions = [
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'FIELD_DAY', label: 'Field Day' },
  { value: 'SEMINAR', label: 'Seminar' },
  { value: 'TRAINING', label: 'Training' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'OTHER', label: 'Other' },
];

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  loading?: boolean;
}

export function EventForm({ open, onOpenChange, initialData, onSubmit, loading }: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData,
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type *</Label>
            <Select {...register('eventType')}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventType && (
              <p className="text-xs text-destructive">{errors.eventType.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="e.g. TARC Main Auditorium, Addis Ababa"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input id="startTime" type="datetime-local" {...register('startTime')} />
              {errors.startTime && (
                <p className="text-xs text-destructive">{errors.startTime.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="datetime-local" {...register('endTime')} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAllDay"
              {...register('isAllDay')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isAllDay" className="cursor-pointer">
              All Day Event
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerImageUrl">Banner Image URL</Label>
            <Input
              id="bannerImageUrl"
              type="url"
              {...register('bannerImageUrl')}
              placeholder="https://example.com/banner.jpg"
            />
            {errors.bannerImageUrl && (
              <p className="text-xs text-destructive">{errors.bannerImageUrl.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              {...register('isPublished')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Published
            </Label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
