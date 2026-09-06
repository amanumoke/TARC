import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const vacancySchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  employmentType: z.enum(['FULL_TIME', 'CONTRACT', 'INTERNSHIP', 'CONSULTANCY']),
  location: z.string().min(1, 'Location is required'),
  closingDate: z.string().min(1, 'Closing date is required'),
  description: z.string().min(1, 'Description is required'),
  qualifications: z.string().min(1, 'Qualifications are required'),
  applicationInstructions: z.string().min(1, 'Application instructions are required'),
  isPublished: z.boolean().default(false),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

interface VacancyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<VacancyFormData>;
  onSubmit: (data: VacancyFormData) => void;
  loading?: boolean;
}

export function VacancyForm({ open, onOpenChange, initialData, onSubmit, loading }: VacancyFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: { employmentType: 'FULL_TIME', isPublished: false, ...initialData },
  });

  useEffect(() => {
    reset({ employmentType: 'FULL_TIME', isPublished: false, ...initialData });
  }, [initialData, reset]);

  const close = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader><DialogTitle>{initialData ? 'Edit Vacancy' : 'Post Vacancy'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="title">Job title *</Label><Input id="title" {...register('title')} />{errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="employmentType">Employment type *</Label><select id="employmentType" {...register('employmentType')} className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"><option value="FULL_TIME">Full time</option><option value="CONTRACT">Contract</option><option value="INTERNSHIP">Internship</option><option value="CONSULTANCY">Consultancy</option></select></div>
            <div className="space-y-2"><Label htmlFor="location">Location *</Label><Input id="location" {...register('location')} />{errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="closingDate">Closing date *</Label><Input id="closingDate" type="date" {...register('closingDate')} />{errors.closingDate && <p className="text-xs text-destructive">{errors.closingDate.message}</p>}</div>
          </div>
          <div className="space-y-2"><Label htmlFor="description">Job description *</Label><Textarea id="description" rows={4} {...register('description')} />{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="qualifications">Required qualifications *</Label><Textarea id="qualifications" rows={4} placeholder="List each requirement on a new line" {...register('qualifications')} />{errors.qualifications && <p className="text-xs text-destructive">{errors.qualifications.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="applicationInstructions">Application instructions *</Label><Textarea id="applicationInstructions" rows={3} {...register('applicationInstructions')} />{errors.applicationInstructions && <p className="text-xs text-destructive">{errors.applicationInstructions.message}</p>}</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('isPublished')} className="h-4 w-4" /> Publish on the public website</label>
          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={close}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save vacancy'}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
