
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, UserCircle } from 'lucide-react';
import { ProjectClientPage } from '@/app/dashboard/[id]/client-page';

// The params object is a Promise, so we need to await it.
export default async function ProjectDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Corrected to use `project.student_names` and handle it as an array of strings.
  const studentNames = project.student_names || [];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{project.title}</CardTitle>
          <CardDescription>
            Submitted by: {project.submitter_email} on {new Date(project.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Project Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Submitted File</h3>
            {project.file_url ? (
              <a 
                href={project.file_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-primary hover:underline"
              >
                View Submitted File <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            ) : (
              <p className="text-muted-foreground">No file was submitted.</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Names</h3>
            {studentNames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentNames.map((name: string, index: number) => (
                  <Card key={index} className="p-3 flex items-center">
                    <UserCircle className="h-6 w-6 mr-3 text-muted-foreground" />
                    <p className="font-semibold">{name}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No student names listed.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <ProjectClientPage project={project} />
    </div>
  );
}
