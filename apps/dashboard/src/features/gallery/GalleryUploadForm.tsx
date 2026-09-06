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
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const gallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  caption: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional().or(z.literal('')),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

const categoryOptions = [
  { value: 'FIELD_TRIALS', label: 'Field Trials' },
  { value: 'LABORATORY', label: 'Laboratory' },
  { value: 'SPICE_VARIETIES', label: 'Spice Varieties' },
  { value: 'COFFEE_RESEARCH', label: 'Coffee Research' },
  { value: 'COMMUNITY_OUTREACH', label: 'Community Outreach' },
  { value: 'FACILITIES', label: 'Facilities' },
];

interface GalleryUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<GalleryFormData>;
  onSubmit: (data: GalleryFormData) => void;
  loading?: boolean;
}

export function GalleryUploadForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  loading,
}: GalleryUploadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: initialData,
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Image' : 'Upload Image'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
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
            <Label htmlFor="caption">Caption</Label>
            <Textarea id="caption" {...register('caption')} rows={2} />
          </div>
          <LocalImageUpload value={watch('imageUrl')} onChange={(value) => setValue('imageUrl', value)} label="Gallery image" />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Image'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
