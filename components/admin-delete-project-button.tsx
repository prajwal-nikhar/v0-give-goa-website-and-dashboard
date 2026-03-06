'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase';

interface AdminDeleteProjectButtonProps {
  projectId: string;
}

export function AdminDeleteProjectButton({ projectId }: AdminDeleteProjectButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient();

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );

    if (!confirmed) return;

    if (!supabase) {
      alert('Service not available. Please try again later.');
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project. Please try again.');
        setIsDeleting(false);
        return;
      }

      alert('Project deleted successfully.');
      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      console.error('Unexpected error deleting project:', err);
      alert('An unexpected error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? 'Deleting...' : 'Delete Project'}
    </Button>
  );
}

