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

function readUser(): User | null {
  try {
    const saved = localStorage.getItem('tarcms_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AdminProfilePage() {
  // Use state so the displayed name/email updates immediately after a successful save
  const [user, setUser] = useState<User | null>(readUser);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToastMsg = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Use the correct endpoint: PUT /api/v1/admin/profile (matches profile.ts domain file)
  const updateProfile = useApiMutation<User, { name: string; email: string }>({
    endpoint: '/api/v1/admin/profile',
    method: 'PUT',
    queryKeyToInvalidate: ['user-profile'],
    onSuccess: (data) => {
      // Merge returned data back into the stored user object
      const current = readUser();
      const updated: User = { ...(current as User), ...data };
      localStorage.setItem('tarcms_user', JSON.stringify(updated));
      // Update component state so avatar + display name re-render immediately
      setUser(updated);
      showToastMsg('Profile updated successfully', 'success');
    },
    onError: () => showToastMsg('Failed to update profile. Please try again.', 'error'),
  });

  // Use the correct endpoint: PUT /api/v1/admin/profile/password
  const changePassword = useApiMutation<unknown, { current_password: string; new_password: string }>({
    endpoint: '/api/v1/admin/profile/password',
    method: 'PUT',
    onSuccess: () => showToastMsg('Password changed successfully', 'success'),
    onError: () => showToastMsg('Failed to change password. Check your current password.', 'error'),
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-4 py-3 shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-destructive text-destructive-foreground'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <PageHeader title="Profile" description="Manage your account information and password." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Live preview — updates immediately on save */}
            <div className="flex items-center gap-4 pb-2">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base font-semibold">{user.name}</p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{formatRole(user.role)}</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                updateProfile.mutate({
                  name: fd.get('name') as string,
                  email: fd.get('email') as string,
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {/* Use key={user.name} so input re-renders with new defaultValue after save */}
                <Input key={user.name} id="name" name="name" defaultValue={user.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  key={user.email}
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  required
                />
              </div>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const newPw = fd.get('newPassword') as string;
                const confirmPw = fd.get('confirmPassword') as string;
                if (newPw !== confirmPw) {
                  showToastMsg('Passwords do not match', 'error');
                  return;
                }
                changePassword.mutate({
                  current_password: fd.get('currentPassword') as string,
                  new_password: newPw,
                });
                // Clear form on success via key trick handled by re-render
                (e.target as HTMLFormElement).reset();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
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
