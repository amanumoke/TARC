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

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  content: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  coverImageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  publishedAt: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type NewsFormData = z.infer<typeof newsSchema>;

const categoryOptions = [
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'RESEARCH_HIGHLIGHT', label: 'Research Highlight' },
  { value: 'EVENT', label: 'Event' },
  { value: 'ACHIEVEMENT', label: 'Achievement' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'OTHER', label: 'Other' },
];

interface NewsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<NewsFormData>;
  onSubmit: (data: NewsFormData) => void;
  loading?: boolean;
}

export function NewsForm({ open, onOpenChange, initialData, onSubmit, loading }: NewsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
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
          <DialogTitle>{initialData ? 'Edit News' : 'Add News'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select {...register('category')}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              {...register('summary')}
              rows={2}
              placeholder="Brief summary for listings"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register('content')}
              rows={6}
              placeholder="Full article content"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input
              id="coverImageUrl"
              type="url"
              {...register('coverImageUrl')}
              placeholder="https://example.com/image.jpg"
            />
            {errors.coverImageUrl && (
              <p className="text-xs text-destructive">{errors.coverImageUrl.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input id="publishedAt" type="date" {...register('publishedAt')} />
            </div>
            <div className="space-y-2 flex items-end">
              <div className="flex items-center gap-2 w-full">
                <input
                  type="checkbox"
                  id="isPublished"
                  {...register('isPublished')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isPublished" className="cursor-pointer mb-0">
                  Published
                </Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save News'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
