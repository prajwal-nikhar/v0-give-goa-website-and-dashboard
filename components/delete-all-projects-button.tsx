'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DeleteAllProjectsButton() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAll = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      'This will permanently delete ALL projects. This action cannot be undone.\n\nAre you sure you want to continue?'
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch('/api/admin/delete-all-projects', {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Failed to delete all projects');
        alert('Failed to delete all projects. Please try again.');
        setIsDeleting(false);
        return;
      }

      alert('All projects have been deleted.');
      router.refresh();
    } catch (error) {
      console.error('Error deleting all projects', error);
      alert('An unexpected error occurred while deleting projects.');
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="w-full bg-red-600 hover:bg-red-700"
      onClick={handleDeleteAll}
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting all projects...' : 'Delete All Projects'}
    </Button>
  );
}

