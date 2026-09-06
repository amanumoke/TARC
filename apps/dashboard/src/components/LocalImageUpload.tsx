import { useState } from 'react';

interface LocalImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export function LocalImageUpload({ value, onChange, label = 'Photo' }: LocalImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleChange(file?: File) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const token = localStorage.getItem('tarcms_token');
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/v1/uploads/images', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body,
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || 'Upload failed');
      onChange(result.data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label} (local upload)</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => handleChange(event.target.files?.[0])}
        className="block w-full rounded-md border px-3 py-2 text-sm"
      />
      {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {value && <img src={value} alt="Uploaded preview" className="h-24 w-24 rounded-md object-cover" />}
    </div>
  );
}
