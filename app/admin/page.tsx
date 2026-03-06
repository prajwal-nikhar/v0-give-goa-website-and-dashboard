import Link from "next/link"
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Upload, Clock, CheckCircle } from "lucide-react"
import { DeleteAllProjectsButton } from "@/components/delete-all-projects-button"

export default async function AdminDashboardPage() {
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

  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: pendingProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: approvedProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');
    
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Manage SLRI projects and content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 items-stretch">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl md:text-3xl font-bold">{totalProjects ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">{pendingProjects ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Projects</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{approvedProjects ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Live on platform</p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-red-700">Danger Zone</CardTitle>
              <CardDescription>Delete all projects from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAllProjectsButton />
            </CardContent>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/projects">
              <CardHeader>
                <FolderKanban className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Project Management</CardTitle>
                <CardDescription>View and manage all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Projects
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/projects/pending">
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Pending Projects</CardTitle>
                <CardDescription>Approve or reject submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Review Submissions
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/bulk-upload">
              <CardHeader>
                <Upload className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Bulk Upload</CardTitle>
                <CardDescription>Import projects via CSV</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Upload Data
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
          {recentProjects && recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/admin/projects/${project.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="truncate">{project.title}</CardTitle>
                      <CardDescription>
                        {project.submitter_email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                        <Badge 
                          variant={project.status === 'approved' ? 'default' : project.status === 'rejected' ? 'destructive' : 'secondary'}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No project submissions yet.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
