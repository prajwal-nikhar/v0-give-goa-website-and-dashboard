'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function ProjectClientPage({ project }: { project: any }) {
  const [status, setStatus] = useState(project.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdateStatus = async (newStatus: 'approved' | 'rejected') => {
    setIsSubmitting(true);

    const { error } = await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', project.id);

    if (error) {
      console.error(error);
      toast.error('Failed to update project status.');
      setIsSubmitting(false);
      return;
    } 
    
    setStatus(newStatus);
    toast.success(`Project ${newStatus}`);

    // Send email notification via the new API route
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: { ...project, status: newStatus } }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      toast.success('Notification email sent.');

    } catch (emailError: any) {
      console.error('Email send failed:', emailError);
      toast.error(emailError.message || 'Failed to send notification email.');
    }

    router.refresh();
    setIsSubmitting(false);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="font-semibold">Current Status:</p>
          <Badge
            variant={
              status === 'approved'
                ? 'default'
                : status === 'rejected'
                ? 'destructive'
                : 'secondary'
            }
          >
            {status}
          </Badge>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => handleUpdateStatus('approved')}
            disabled={isSubmitting || status === 'approved'}
          >
            Approve
          </Button>
          <Button
            onClick={() => handleUpdateStatus('rejected')}
            disabled={isSubmitting || status === 'rejected'}
            variant="destructive"
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
