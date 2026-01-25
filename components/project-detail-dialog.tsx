'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner';
import { getSupabaseClient } from '@/lib/supabase'

export default function ProjectDetailsDialog({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = getSupabaseClient()

  const sendEmailNotification = async (updatedProject: any) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: updatedProject }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send notification email.');
      }
      
      toast.success('Notification email sent.');

    } catch (emailError: any) {
      console.error(emailError);
      toast.error(emailError.message || 'Failed to send notification email.');
    }
  }

  const handleApprove = async () => {
    if (!supabase) {
      toast.error('Service not available');
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('projects')
      .update({ status: 'approved' })
      .eq('id', project.id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to approve project.');
      console.error(error);
    } else {
      toast.success('Project approved');
      await sendEmailNotification(data);
      setIsOpen(false);
    }
    setIsSubmitting(false);
  }

  const handleDecline = async () => {
    if (!supabase) {
      toast.error('Service not available');
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('projects')
      .update({ status: 'rejected', rejection_reason: rejectionReason })
      .eq('id', project.id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to reject project.');
      console.error(error);
    } else {
      toast.success('Project rejected');
      await sendEmailNotification(data);
      setIsDeclineDialogOpen(false);
      setIsOpen(false);
    }
    setIsSubmitting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>
        <div>
          <p><strong>Submitter:</strong> {project.submitter_email}</p>
          <p><strong>Description:</strong> {project.description}</p>
          {project.file_url && <a href={project.file_url} download>Download Project File</a>}
          <div className="mt-4">
            <Button onClick={handleApprove} className="mr-2" disabled={isSubmitting || project.status === 'approved'}>Approve</Button>
            <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={isSubmitting || project.status === 'rejected'}>Decline</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Decline Project</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="Provide a reason for declining the project..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <Button onClick={handleDecline} disabled={isSubmitting}>Confirm Decline</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
