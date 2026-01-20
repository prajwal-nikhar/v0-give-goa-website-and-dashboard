'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createBrowserClient } from '@supabase/ssr';

interface Project {
  id: string;
  title: string;
  student_names: string[];
  created_at: string;
  status: string;
  file_url: string;
}

export default function PendingProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error(`Error updating project status to ${status}:`, error);
    } else {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleApprove = (id: string) => {
    handleUpdateStatus(id, 'approved');
  };

  const handleReject = (id: string) => {
    handleUpdateStatus(id, 'rejected');
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
                    <Button onClick={() => handleReject(project.id)} size='sm' variant='destructive'>
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
