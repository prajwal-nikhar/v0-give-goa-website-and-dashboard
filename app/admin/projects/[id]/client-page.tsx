'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

export function ProjectClientPage({ project }: { project: any }) {
  const [status, setStatus] = useState(project.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleApprove = async () => {
    setIsSubmitting(true);

    const { error } = await supabase
      .from('projects')
      .update({ status: 'approved' })
      .eq('id', project.id);

    if (error) {
      toast.error('Failed to approve project');
      setIsSubmitting(false);
      return;
    }

    setStatus('approved');
    toast.success('Project approved');

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: { ...project, status: 'approved' } }),
      });
    } catch (e) {
      console.error('Email error:', e);
    }

    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('projects')
      .update({ status: 'rejected', rejection_reason: rejectionReason })
      .eq('id', project.id);

    if (error) {
      toast.error('Failed to reject project');
      setIsSubmitting(false);
      return;
    }

    setStatus('rejected');
    toast.success('Project rejected');

    try {
      await fetch('/api/send-rejection-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: project.submitter_email,
          projectTitle: project.title,
          reason: rejectionReason,
        }),
      });
    } catch (e) {
      console.error('Email error:', e);
    }

    setRejectDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (error) {
      toast.error('Failed to delete project');
      setIsSubmitting(false);
      return;
    }

    toast.success('Project deleted');
    router.push('/admin/projects');
  };

  const isPending = status === 'pending';

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-medium">Status:</span>
              <Badge
                variant={
                  status === 'approved' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'
                }
              >
                {status}
              </Badge>
            </div>

            {isPending ? (
              <div className="flex gap-3">
                <Button onClick={handleApprove} disabled={isSubmitting}>
                  Approve
                </Button>
                <Button variant="destructive" onClick={() => setRejectDialogOpen(true)} disabled={isSubmitting}>
                  Reject
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Project
                  </Link>
                </Button>
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Project</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be sent to the student.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
              {isSubmitting ? 'Rejecting...' : 'Reject Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
