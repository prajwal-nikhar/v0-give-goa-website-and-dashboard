'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ProjectClientPage({ project }: { project: any }) {
  const [status, setStatus] = useState<'approved' | 'declined' | null>(null);
  const [justification, setJustification] = useState('');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const handleStatusUpdate = async () => {
    if (!status) return;

    if (status === 'declined' && !justification) {
      toast.error('Please provide a justification for declining the project.');
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
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { error: functionsError } = await supabase.functions.invoke('send-email', {
            body: {
            to: project.submitter_email,
            subject: `Project Declined: ${project.title}`,
            body: `Your project "${project.title}" has been declined for the following reason: ${justification}`,
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });

        if (functionsError) {
          toast.error(`Failed to send email: ${functionsError.message}`);
        }
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
