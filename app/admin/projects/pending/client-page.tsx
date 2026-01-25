'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  student_names: string[];
  created_at: string;
  status: string;
  file_url: string;
  submitter_email: string;
  program?: string;
  year?: string;
}

export default function PendingProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects.filter(p => p.status === 'pending'));
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleApprove = async (project: Project) => {
    setActionInProgress(project.id);
    
    const { error } = await supabase
      .from('projects')
      .update({ status: 'approved' })
      .eq('id', project.id);

    if (error) {
      console.error('Error approving project:', error);
      toast.error('Failed to approve project');
      setActionInProgress(null);
      return;
    }

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: { ...project, status: 'approved' } }),
      });
    } catch (e) {
      console.error('Email error:', e);
    }

    setProjects(projects.filter(p => p.id !== project.id));
    toast.success(`"${project.title}" has been approved`);
    setActionInProgress(null);
  };

  const openRejectDialog = (project: Project) => {
    setSelectedProject(project);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedProject || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
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
      toast.error('Failed to reject project');
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

    const projectTitle = selectedProject.title;
    setProjects(projects.filter(p => p.id !== selectedProject.id));
    setRejectDialogOpen(false);
    setSelectedProject(null);
    setRejectionReason('');
    setIsSubmitting(false);
    toast.success(`"${projectTitle}" has been rejected`);
  };

  return (
    <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10'>
      <Card>
        <CardHeader>
          <CardTitle>Pending Project Submissions</CardTitle>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? 's' : ''} awaiting review
          </p>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No pending projects to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <Card key={project.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted by: {project.submitter_email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.program && <Badge variant="outline">{project.program}</Badge>}
                        {project.year && <Badge variant="outline">{project.year}</Badge>}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.file_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.file_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View File
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => handleApprove(project)}
                        disabled={actionInProgress === project.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {actionInProgress === project.id ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => openRejectDialog(project)}
                        disabled={actionInProgress === project.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Project</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedProject?.title}". This feedback will be sent to the student via email.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={isSubmitting || !rejectionReason.trim()}>
              {isSubmitting ? 'Rejecting...' : 'Reject Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
