import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/features/shared/PageHeader';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatRole(role: string): string {
  return role
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminProfilePage() {
  const savedUser = localStorage.getItem('tarcms_user');
  const user: User | null = savedUser ? JSON.parse(savedUser) : null;
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const updateProfile = useApiMutation<
    { name: string; email: string },
    { name: string; email: string }
  >({
    endpoint: '/api/v1/admin/profile',
    method: 'PATCH',
    queryKeyToInvalidate: ['user-profile'],
    onSuccess: (data) => {
      if (user) {
        const updatedUser = { ...user, ...data };
        localStorage.setItem('tarcms_user', JSON.stringify(updatedUser));
        setToast({ message: 'Profile updated successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
      }
    },
    onError: () => {
      setToast({ message: 'Failed to update profile', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    },
  });

  const changePassword = useApiMutation<unknown, { currentPassword: string; newPassword: string }>({
    endpoint: '/api/v1/admin/profile/password',
    method: 'POST',
    onSuccess: () => {
      setToast({ message: 'Password changed successfully', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    },
    onError: () => {
      setToast({ message: 'Failed to change password', type: 'error' });
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

  if (!user) return null;

  return (
    <div className="space-y-6">
      {showToast()}
      <PageHeader title="Profile" description="Manage your account settings." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <p className="text-muted-foreground mt-1 text-xs">{formatRole(user.role)}</p>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries()) as Record<string, string>;
                updateProfile.mutate({ name: data.name, email: data.email });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} required />
              </div>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries()) as Record<string, string>;
                if (data.newPassword !== data.confirmPassword) {
                  setToast({ message: 'Passwords do not match', type: 'error' });
                  setTimeout(() => setToast(null), 3000);
                  return;
                }
                changePassword.mutate({
                  currentPassword: data.currentPassword,
                  newPassword: data.newPassword,
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
