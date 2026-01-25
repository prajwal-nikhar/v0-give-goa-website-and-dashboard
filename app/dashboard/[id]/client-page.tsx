'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';

export function ProjectClientPage({ project }: { project: any }) {
  const [status, setStatus] = useState<'approved' | 'declined' | null>(null);
  const [justification, setJustification] = useState('');
  const supabase = getSupabaseClient();
  const router = useRouter();

  const handleStatusUpdate = async () => {
    if (!status) return;

    if (status === 'declined' && !justification) {
      toast.error('Please provide a justification for declining the project.');
      return;
    }

    if (!supabase) {
      toast.error('Service not available');
      return;
    }

    const { error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', project.id);

    if (error) {
      toast.error(`Failed to update project status: ${error.message}`);
      return;
    }

    if (status === 'declined') {
      try {
        const response = await fetch('/api/send-rejection-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: project.submitter_email,
            projectTitle: project.title,
            reason: justification,
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to send rejection email');
        }
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
      }
    }
    
    toast.success(`Project ${status}!`);
    router.push('/admin');
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex space-x-4">
        <Button onClick={() => setStatus('approved')}>Approve</Button>
        <Button variant="destructive" onClick={() => setStatus('declined')}>
          Decline
        </Button>
      </div>
      {status === 'declined' && (
        <div className="space-y-2">
          <Textarea
            placeholder="Justification for declining the project"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          />
        </div>
      )}
      {status && (
        <Button onClick={handleStatusUpdate}>Submit</Button>
      )}
    </div>
  );
}
