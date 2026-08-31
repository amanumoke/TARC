import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toast } from '@/components/ui/toast';
import { PageHeader } from '@/features/shared/PageHeader';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useState } from 'react';

interface Settings {
  institutionName: string;
  tagline: string;
  aboutText?: string;
  missionText?: string;
  visionText?: string;
  officialEmail: string;
  officialPhone: string;
  physicalAddress: string;
}

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('institution');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: settings, isLoading } = useApiQuery<Settings>({
    queryKey: ['system-settings'],
    endpoint: '/api/v1/admin/settings',
  });

  const updateSettings = useApiMutation<Settings, Partial<Settings>>({
    endpoint: '/api/v1/admin/settings',
    method: 'PATCH',
    queryKeyToInvalidate: ['system-settings'],
    onSuccess: () => {
      setToast({ message: 'Settings saved successfully', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    },
    onError: () => {
      setToast({ message: 'Failed to save settings', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    },
  });

  const showToast = () =>
    toast && (
      <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
        <div
          className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-success text-success-foreground'
              : 'bg-destructive text-destructive-foreground'
          }`}
        >
          {toast.message}
        </div>
      </div>
    );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Manage system and institution settings." />
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={`skeleton-${i}`} className="h-10 rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showToast()}
      <PageHeader title="Settings" description="Manage system and institution settings." />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="institution">Institution</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="content">Public Content</TabsTrigger>
        </TabsList>

        <TabsContent value="institution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Institution Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input id="institutionName" defaultValue={settings?.institutionName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" defaultValue={settings?.tagline} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea id="about" defaultValue={settings?.aboutText} rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission">Mission</Label>
                <Textarea id="mission" defaultValue={settings?.missionText} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision">Vision</Label>
                <Textarea id="vision" defaultValue={settings?.visionText} rows={3} />
              </div>
              <Button
                onClick={() => {
                  const form = document.getElementById('institution-form') as HTMLFormElement;
                  if (form) {
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    updateSettings.mutate(data);
                  }
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <Input id="email" type="email" defaultValue={settings?.officialEmail} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={settings?.officialPhone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Textarea id="address" defaultValue={settings?.physicalAddress} rows={2} />
              </div>
              <Button
                onClick={() => {
                  const form = document.getElementById('contact-form') as HTMLFormElement;
                  if (form) {
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    updateSettings.mutate(data);
                  }
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Public Content Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Configure which content appears on the public portal.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
