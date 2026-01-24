'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBrowserClient } from '@supabase/ssr';

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
  'Education',
  'Healthcare',
  'Environment',
  'Agriculture',
  'Technology',
  'Social Welfare',
  'Women Empowerment',
  'Rural Development',
  'Urban Development',
  'Other',
];

export default function SubmitProject() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sector, setSector] = useState('');
  const [sdg, setSdg] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/student-login');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not logged in');
      router.push('/student-login');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const title = formData.get('title') as string;
    const organizationName = formData.get('organizationName') as string;
    const objectives = formData.get('objectives') as string;
    const geographicalScope = formData.get('geographicalScope') as string;
    const groupNo = formData.get('groupNo') as string;
    const year = formData.get('year') as string;
    const groupId = formData.get('groupId') as string;
    const concentration = formData.get('concentration') as string;
    const projectLink = formData.get('projectLink') as string;
    const studentNames = formData.get('studentNames') as string;
    const faculty = formData.get('faculty') as string;
    const mentor = formData.get('mentor') as string;

    let fileUrl = null;
    
    if (file) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('project-submissions')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setSubmitting(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-submissions')
        .getPublicUrl(filePath);
      
      fileUrl = publicUrl;
    }

    const { error: insertError } = await supabase.from('projects').insert([
      {
        user_id: user.id,
        title,
        organization_name: organizationName,
        description: objectives,
        objectives,
        sector,
        geographical_scope: geographicalScope,
        group_no: groupNo,
        year,
        group_id: groupId,
        concentration,
        sdg,
        project_link: projectLink,
        student_names: studentNames ? studentNames.split(',').map((s) => s.trim()) : [],
        faculty,
        mentor,
        file_url: fileUrl,
        submitter_email: user.email,
        status: 'pending',
      },
    ]);

    if (insertError) {
      console.error('Error inserting project:', insertError);
      setSubmitting(false);
      return;
    }

    setIsSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle>Submit Your Project</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className='text-center py-8'>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className='text-2xl font-bold mb-4'>Thank you for your submission!</h2>
              <p className="text-muted-foreground">Your project has been submitted for approval. An administrator will review the information, and upon approval, it will be listed in the projects section.</p>
              <Button className="mt-6" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor='title' className='block text-sm font-medium mb-1'>
                    Project Title *
                  </label>
                  <Input id='title' name='title' type='text' required placeholder="Enter project title" />
                </div>

                <div>
                  <label htmlFor='sector' className='block text-sm font-medium mb-1'>
                    Sector *
                  </label>
                  <Select value={sector} onValueChange={setSector} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTOR_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor='sdg' className='block text-sm font-medium mb-1'>
                    SDG Goal *
                  </label>
                  <Select value={sdg} onValueChange={setSdg} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SDG" />
                    </SelectTrigger>
                    <SelectContent>
                      {SDG_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor='geographicalScope' className='block text-sm font-medium mb-1'>
                    Geographical Scope *
                  </label>
                  <Input id='geographicalScope' name='geographicalScope' type='text' required placeholder="e.g., Goa, Panaji, Rural Areas" />
                </div>

                <div>
                  <label htmlFor='organizationName' className='block text-sm font-medium mb-1'>
                    Partner Organization
                  </label>
                  <Input id='organizationName' name='organizationName' type='text' placeholder="Organization name (if any)" />
                </div>

                <div>
                  <label htmlFor='year' className='block text-sm font-medium mb-1'>
                    Year *
                  </label>
                  <Input id='year' name='year' type='text' required placeholder="e.g., 2024" />
                </div>

                <div>
                  <label htmlFor='groupNo' className='block text-sm font-medium mb-1'>
                    Group Number
                  </label>
                  <Input id='groupNo' name='groupNo' type='text' placeholder="e.g., 1, 2, 3" />
                </div>

                <div>
                  <label htmlFor='groupId' className='block text-sm font-medium mb-1'>
                    Group ID
                  </label>
                  <Input id='groupId' name='groupId' type='text' placeholder="e.g., GRP001" />
                </div>

                <div>
                  <label htmlFor='concentration' className='block text-sm font-medium mb-1'>
                    Concentration
                  </label>
                  <Input id='concentration' name='concentration' type='text' placeholder="e.g., Marketing, Finance" />
                </div>
              </div>

              <div>
                <label htmlFor='objectives' className='block text-sm font-medium mb-1'>
                  Project Objectives *
                </label>
                <Textarea id='objectives' name='objectives' rows={4} required placeholder="Describe the main objectives of your project" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor='studentNames' className='block text-sm font-medium mb-1'>
                    Student Names
                  </label>
                  <Input id='studentNames' name='studentNames' type='text' placeholder="Comma-separated names" />
                </div>

                <div>
                  <label htmlFor='faculty' className='block text-sm font-medium mb-1'>
                    Faculty Advisor
                  </label>
                  <Input id='faculty' name='faculty' type='text' placeholder="Faculty name" />
                </div>

                <div>
                  <label htmlFor='mentor' className='block text-sm font-medium mb-1'>
                    Mentor
                  </label>
                  <Input id='mentor' name='mentor' type='text' placeholder="Mentor name" />
                </div>

                <div>
                  <label htmlFor='projectLink' className='block text-sm font-medium mb-1'>
                    Project Link
                  </label>
                  <Input id='projectLink' name='projectLink' type='url' placeholder="https://..." />
                </div>
              </div>

              <div>
                <label htmlFor='projectFiles' className='block text-sm font-medium mb-1'>
                  Upload Project File (Optional)
                </label>
                <Input id='projectFiles' name='projectFiles' type='file' onChange={handleFileChange} />
                <p className="mt-1 text-sm text-muted-foreground">Upload any relevant document (proposal, report, or presentation)</p>
              </div>

              <Button type='submit' className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
