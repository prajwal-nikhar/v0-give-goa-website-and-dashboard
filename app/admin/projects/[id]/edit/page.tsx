'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const SDG_OPTIONS = [
  'SDG 1 - No Poverty',
  'SDG 2 - Zero Hunger',
  'SDG 3 - Good Health and Well-being',
  'SDG 4 - Quality Education',
  'SDG 5 - Gender Equality',
  'SDG 6 - Clean Water and Sanitation',
  'SDG 7 - Affordable and Clean Energy',
  'SDG 8 - Decent Work and Economic Growth',
  'SDG 9 - Industry, Innovation and Infrastructure',
  'SDG 10 - Reduced Inequalities',
  'SDG 11 - Sustainable Cities and Communities',
  'SDG 12 - Responsible Consumption and Production',
  'SDG 13 - Climate Action',
  'SDG 14 - Life Below Water',
  'SDG 15 - Life on Land',
  'SDG 16 - Peace, Justice and Strong Institutions',
  'SDG 17 - Partnerships for the Goals',
];

const SECTOR_OPTIONS = [
  'Education', 'Healthcare', 'Environment', 'Agriculture', 'Technology',
  'Social Welfare', 'Women Empowerment', 'Rural Development', 'Urban Development', 'Other',
];

const PROGRAM_OPTIONS = ['PGDM BDA', 'PGDM CORE', 'PGDM BIFS', 'PGDM HCM'];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    sector: '',
    sdg: '',
    program: '',
    geographical_scope: '',
    organization_name: '',
    year: '',
    group_no: '',
    group_id: '',
    concentration: '',
    objectives: '',
    student_names: '',
    faculty: '',
    mentor: '',
    project_link: '',
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error || !data) {
        toast.error('Project not found');
        router.push('/admin/projects');
        return;
      }

      setFormData({
        title: data.title || '',
        sector: data.sector || '',
        sdg: data.sdg || '',
        program: data.program || '',
        geographical_scope: data.geographical_scope || '',
        organization_name: data.organization_name || '',
        year: data.year || '',
        group_no: data.group_no || '',
        group_id: data.group_id || '',
        concentration: data.concentration || '',
        objectives: data.objectives || '',
        student_names: Array.isArray(data.student_names) ? data.student_names.join(', ') : '',
        faculty: data.faculty || '',
        mentor: data.mentor || '',
        project_link: data.project_link || '',
      });
      setLoading(false);
    };

    fetchProject();
  }, [projectId, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('projects')
      .update({
        title: formData.title,
        sector: formData.sector,
        sdg: formData.sdg,
        program: formData.program,
        geographical_scope: formData.geographical_scope,
        organization_name: formData.organization_name,
        year: formData.year,
        group_no: formData.group_no,
        group_id: formData.group_id,
        concentration: formData.concentration,
        objectives: formData.objectives,
        description: formData.objectives,
        student_names: formData.student_names.split(',').map(s => s.trim()).filter(Boolean),
        faculty: formData.faculty,
        mentor: formData.mentor,
        project_link: formData.project_link,
      })
      .eq('id', projectId);

    if (error) {
      toast.error('Failed to update project');
      console.error(error);
    } else {
      toast.success('Project updated');
      router.push('/admin/projects');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 max-w-3xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/admin/projects">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sector</label>
                <Select value={formData.sector} onValueChange={v => setFormData({ ...formData, sector: v })}>
                  <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                  <SelectContent>
                    {SECTOR_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SDG Goal</label>
                <Select value={formData.sdg} onValueChange={v => setFormData({ ...formData, sdg: v })}>
                  <SelectTrigger><SelectValue placeholder="Select SDG" /></SelectTrigger>
                  <SelectContent>
                    {SDG_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Program</label>
                <Select value={formData.program} onValueChange={v => setFormData({ ...formData, program: v })}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {PROGRAM_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Geographical Scope</label>
                <Input
                  value={formData.geographical_scope}
                  onChange={e => setFormData({ ...formData, geographical_scope: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Partner Organization</label>
                <Input
                  value={formData.organization_name}
                  onChange={e => setFormData({ ...formData, organization_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <Input
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Group Number</label>
                <Input
                  value={formData.group_no}
                  onChange={e => setFormData({ ...formData, group_no: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Group ID</label>
                <Input
                  value={formData.group_id}
                  onChange={e => setFormData({ ...formData, group_id: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Concentration</label>
                <Input
                  value={formData.concentration}
                  onChange={e => setFormData({ ...formData, concentration: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Project Link</label>
                <Input
                  value={formData.project_link}
                  onChange={e => setFormData({ ...formData, project_link: e.target.value })}
                  type="url"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Objectives</label>
              <Textarea
                value={formData.objectives}
                onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Names (comma-separated)</label>
                <Input
                  value={formData.student_names}
                  onChange={e => setFormData({ ...formData, student_names: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Faculty</label>
                <Input
                  value={formData.faculty}
                  onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mentor</label>
                <Input
                  value={formData.mentor}
                  onChange={e => setFormData({ ...formData, mentor: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/admin/projects')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
