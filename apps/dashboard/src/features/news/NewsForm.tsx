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
import { LocalImageUpload } from '@/components/LocalImageUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  content: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  coverImageUrl: z.string().optional().or(z.literal('')),
  publishedAt: z.string().optional(),
  isPublished: z.boolean().default(true),
});

type NewsFormData = z.infer<typeof newsSchema>;

const categoryOptions = [
  { value: 'RESEARCH_NEWS', label: 'Research News' },
  { value: 'INSTITUTIONAL', label: 'Institutional / Announcement' },
  { value: 'FARMER_ADVISORY', label: 'Farmer Advisory' },
  { value: 'EVENTS', label: 'Events' },
];

function normalizeCategoryValue(rawCat?: string): string {
  if (!rawCat) return 'INSTITUTIONAL';
  const c = rawCat.toUpperCase();
  if (c === 'ANNOUNCEMENT' || c === 'ACHIEVEMENT' || c === 'PARTNERSHIP' || c === 'OTHER') {
    return 'INSTITUTIONAL';
  }
  if (c === 'RESEARCH_HIGHLIGHT') {
    return 'RESEARCH_NEWS';
  }
  if (c === 'EVENT') {
    return 'EVENTS';
  }
  return c;
}

interface NewsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<NewsFormData>;
  onSubmit: (data: NewsFormData) => void;
  loading?: boolean;
  error?: string | null;
}

export function NewsForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  loading,
  error,
}: NewsFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      category: 'INSTITUTIONAL',
      isPublished: true,
      publishedAt: today,
    },
  });

  // Re-populate form whenever initialData changes (e.g. switching between records to edit)
  useEffect(() => {
    if (initialData) {
      let formattedDate = today;
      if (initialData.publishedAt) {
        try {
          formattedDate = new Date(initialData.publishedAt).toISOString().split('T')[0];
        } catch {
          formattedDate = today;
        }
      }
      reset({
        ...initialData,
        category: normalizeCategoryValue(initialData.category),
        isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
        publishedAt: formattedDate,
      });
    } else {
      reset({
        title: '',
        summary: '',
        content: '',
        category: 'INSTITUTIONAL',
        coverImageUrl: '',
        isPublished: true,
        publishedAt: today,
      });
    }
  }, [initialData, reset, today]);

  const handleClose = () => {
    reset({});
    onOpenChange(false);
  };

  const isPublishedWatch = watch('isPublished');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit News' : 'Add News'}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="News headline" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value || 'INSTITUTIONAL'} onValueChange={field.onChange}>
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
              )}
            />
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
              placeholder="Brief summary for cards and listings"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register('content')}
              rows={6}
              placeholder="Full article content (Markdown or plain text)"
            />
          </div>

          <LocalImageUpload
            value={watch('coverImageUrl')}
            onChange={(value) => setValue('coverImageUrl', value)}
            label="Cover image"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input id="publishedAt" type="date" {...register('publishedAt')} />
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center gap-2 w-full pb-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  {...register('isPublished')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor="isPublished" className="cursor-pointer mb-0 font-medium">
                  Publish to Public Website
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? 'Saving...'
                : initialData
                ? 'Update News'
                : isPublishedWatch
                ? 'Save & Publish'
                : 'Save as Draft'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
