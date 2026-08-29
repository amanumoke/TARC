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

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  abstract: z.string().optional(),
  publicationType: z.string().min(1, 'Publication Type is required'),
  publisherOrJournal: z.string().optional(),
  publicationYear: z.string().min(1, 'Year is required'),
  doiUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  projectId: z.string().optional(),
  isPeerReviewed: z.boolean().default(false),
  authors: z.string().optional(),
});

export type PublicationFormData = z.infer<typeof publicationSchema>;

const typeOptions = [
  { value: 'JOURNAL_ARTICLE', label: 'Journal Article' },
  { value: 'CONFERENCE_PAPER', label: 'Conference Paper' },
  { value: 'BOOK', label: 'Book' },
  { value: 'BOOK_CHAPTER', label: 'Book Chapter' },
  { value: 'TECHNICAL_REPORT', label: 'Technical Report' },
  { value: 'THESIS', label: 'Thesis' },
  { value: 'OTHER', label: 'Other' },
];

interface PublicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<PublicationFormData>;
  onSubmit: (data: PublicationFormData) => void;
  loading?: boolean;
  projects?: { id: string; title: string }[];
}

export function PublicationForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  loading,
  projects = [],
}: PublicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
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
          <DialogTitle>{initialData ? 'Edit Publication' : 'Add Publication'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea id="abstract" {...register('abstract')} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicationType">Type *</Label>
              <Select {...register('publicationType')}>
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
              {errors.publicationType && (
                <p className="text-xs text-destructive">{errors.publicationType.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicationYear">Year *</Label>
              <Input
                id="publicationYear"
                type="number"
                {...register('publicationYear')}
                placeholder="2024"
              />
              {errors.publicationYear && (
                <p className="text-xs text-destructive">{errors.publicationYear.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="publisherOrJournal">Publisher / Journal</Label>
            <Input id="publisherOrJournal" {...register('publisherOrJournal')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doiUrl">DOI URL</Label>
            <Input
              id="doiUrl"
              type="url"
              {...register('doiUrl')}
              placeholder="https://doi.org/..."
            />
            {errors.doiUrl && <p className="text-xs text-destructive">{errors.doiUrl.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectId">Related Project</Label>
            <Select {...register('projectId')}>
              <SelectTrigger>
                <SelectValue placeholder="Select project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="authors">Authors (comma-separated)</Label>
            <Input id="authors" {...register('authors')} placeholder="Smith J, Doe A, Brown K" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPeerReviewed"
              {...register('isPeerReviewed')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isPeerReviewed" className="cursor-pointer">
              Peer Reviewed
            </Label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Publication'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
