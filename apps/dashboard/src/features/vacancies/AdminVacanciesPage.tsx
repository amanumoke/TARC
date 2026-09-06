import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/features/shared/ConfirmDialog';
import { EmptyState } from '@/features/shared/EmptyState';
import { PageHeader } from '@/features/shared/PageHeader';
import { StatusBadge } from '@/features/shared/StatusBadge';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { BriefcaseBusiness, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { VacancyForm } from './VacancyForm';

type EmploymentType = 'FULL_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'CONSULTANCY';
interface VacancyItem { id: string; title: string; employmentType: EmploymentType; location: string; closingDate: string; description: string; qualifications: string; applicationInstructions: string; isPublished: boolean; }
interface VacancyResponse { data: VacancyItem[]; }

export function AdminVacanciesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<VacancyItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, isLoading } = useApiQuery<VacancyResponse>({ queryKey: ['admin-vacancies'], endpoint: '/api/v1/vacancies/admin' });
  const createMutation = useApiMutation<VacancyItem, Partial<VacancyItem>>({ endpoint: '/api/v1/vacancies/admin', method: 'POST', queryKeyToInvalidate: ['admin-vacancies'], onSuccess: () => setShowForm(false) });
  const updateMutation = useApiMutation<VacancyItem, Partial<VacancyItem> & { id: string }>({ endpoint: `/api/v1/vacancies/admin/${editing?.id}`, method: 'PATCH', queryKeyToInvalidate: ['admin-vacancies'], onSuccess: () => { setShowForm(false); setEditing(null); } });
  const deleteMutation = useApiMutation<unknown, string>({ endpoint: `/api/v1/vacancies/admin/${deletingId}`, method: 'DELETE', queryKeyToInvalidate: ['admin-vacancies'], onSuccess: () => setDeletingId(null) });
  const vacancies = data?.data || [];

  return <div className="space-y-6">
    <PageHeader title="Vacancies" description="Post and publish job opportunities on the public website." action={{ label: 'Post vacancy', onClick: () => setShowForm(true) }} />
    {isLoading ? <p className="text-sm text-muted-foreground">Loading vacancies...</p> : vacancies.length === 0 ? <EmptyState icon={BriefcaseBusiness} title="No vacancies" description="Post your first job opportunity." action={{ label: 'Post vacancy', onClick: () => setShowForm(true) }} /> : <div className="grid gap-4">{vacancies.map((item) => <Card key={item.id}><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-semibold">{item.title}</h2><StatusBadge status={item.isPublished ? 'PUBLISHED' : 'DRAFT'} /></div><p className="mt-2 text-sm text-muted-foreground">{item.employmentType.replace('_', ' ')} · {item.location} · Closes {new Date(item.closingDate).toLocaleDateString()}</p><p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{item.description}</p></div><div className="flex shrink-0 gap-2"><Button variant="outline" size="sm" onClick={() => { setEditing(item); setShowForm(true); }}><Pencil className="mr-2 h-4 w-4" />Edit</Button><Button variant="outline" size="sm" className="text-destructive" onClick={() => setDeletingId(item.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button></div></CardContent></Card>)}</div>}
    <VacancyForm open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditing(null); }} initialData={editing ? { title: editing.title, employmentType: editing.employmentType, location: editing.location, closingDate: editing.closingDate, description: editing.description, qualifications: editing.qualifications, applicationInstructions: editing.applicationInstructions, isPublished: editing.isPublished } : undefined} onSubmit={(formData) => editing ? updateMutation.mutate({ ...formData, id: editing.id }) : createMutation.mutate(formData)} loading={createMutation.isPending || updateMutation.isPending} />
    <ConfirmDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)} title="Delete vacancy?" description="This vacancy will be removed from the management and public portals." onConfirm={() => deletingId && deleteMutation.mutate(deletingId)} loading={deleteMutation.isPending} />
  </div>;
}
