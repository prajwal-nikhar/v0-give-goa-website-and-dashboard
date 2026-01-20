'use client'

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Building2, Users } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useEffect, useState } from "react"

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [prevProjectId, setPrevProjectId] = useState<string | null>(null);
  const [nextProjectId, setNextProjectId] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        notFound();
      }

      setProject(data);

      const { data: allProjects, error: allProjectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('status', 'approved')
        .order('id', { ascending: true });

      if (allProjectsError) {
        console.error('Error fetching all projects:', allProjectsError);
        return;
      }

      const projectIds = allProjects.map(p => p.id.toString());
      const currentIndex = projectIds.indexOf(id);

      if (currentIndex > 0) {
        setPrevProjectId(projectIds[currentIndex - 1]);
      }

      if (currentIndex < projectIds.length - 1) {
        setNextProjectId(projectIds[currentIndex + 1]);
      }
    };

    fetchProject();
  }, [id, supabase]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <Button variant="ghost" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.keywords?.map((keyword: string) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-balance">{project.title}</h1>
          <p className="text-xl text-muted-foreground text-pretty">{project.description}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6 flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                    <div className="text-sm text-muted-foreground">Organization</div>
                    <div className="font-semibold">{project.organization_name}</div>
                </div>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            {(project.full_description || '').split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Student Team</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {project.student_names?.map((student: string) => (
                  <div key={student} className="px-4 py-2 bg-muted rounded-lg text-sm">
                    {student}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Faculty Coordinator</h3>
                <p className="text-muted-foreground">{project.faculty}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Project Mentor</h3>
                <p className="text-muted-foreground">{project.mentor}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-muted">
              <iframe src={project.file_url} className="w-full h-full" title="Project Report" loading="lazy" />
            </div>
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href={project.file_url} download>
                  Download Full Report
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-8 border-t">
          {prevProjectId ? (
            <Button asChild variant="outline">
              <Link href={`/projects/${prevProjectId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Project
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nextProjectId ? (
            <Button asChild variant="outline">
              <Link href={`/projects/${nextProjectId}`}>
                Next Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
