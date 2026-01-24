'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@supabase/ssr';

interface Project {
  id: string;
  title: string;
  student_names: string[];
  created_at: string;
  status: string;
  file_url: string;
  submitter_email: string;
}

export default function PendingProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.error('Error approving project:', error);
    } else {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const openRejectDialog = (project: Project) => {
    setSelectedProject(project);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedProject || !rejectionReason.trim()) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('projects')
      .update({ 
        status: 'rejected',
        rejection_reason: rejectionReason 
      })
      .eq('id', selectedProject.id);

    if (error) {
      console.error('Error rejecting project:', error);
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch('/api/send-rejection-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedProject.submitter_email,
          projectTitle: selectedProject.title,
          reason: rejectionReason,
        }),
      });
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
    }

    setProjects(projects.filter(p => p.id !== selectedProject.id));
    setRejectDialogOpen(false);
    setSelectedProject(null);
    setRejectionReason('');
    setIsSubmitting(false);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card>
        <CardHeader>
          <CardTitle>Pending Project Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(project => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.student_names.join(', ')}</TableCell>
                  <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <a href={project.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">View File</Button>
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={{
                        pending: 'bg-yellow-500',
                        approved: 'bg-green-500',
                        rejected: 'bg-red-500',
                      }[project.status] || 'bg-gray-400'}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleApprove(project.id)} size='sm' className='mr-2'>
                      Approve
                    </Button>
                    <Button onClick={() => openRejectDialog(project)} size='sm' variant='destructive'>
                      Decline
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {projects.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No pending projects to review.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Project</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this project. This will be sent to the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Project: {selectedProject?.title}</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Declining</Label>
              <Textarea
                id="reason"
                placeholder="Please explain what changes are needed..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectSubmit}
              disabled={!rejectionReason.trim() || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Decline & Notify Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
