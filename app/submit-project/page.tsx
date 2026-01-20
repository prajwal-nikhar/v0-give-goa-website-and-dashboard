'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createBrowserClient } from '@supabase/ssr';

export default function SubmitProject() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not logged in');
      router.push('/student-login');
      return;
    }

    if (!file) {
      console.error('File not selected');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const organizationName = formData.get('organizationName') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const studentNames = formData.get('studentNames') as string;
    const faculty = formData.get('faculty') as string;
    const mentor = formData.get('mentor') as string;
    const keywords = formData.get('keywords') as string;

    const filePath = `${user.id}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('project-submissions')
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-submissions')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('projects').insert([
      {
        user_id: user.id,
        title,
        organization_name: organizationName,
        description,
        full_description: fullDescription,
        student_names: studentNames.split(',').map((s) => s.trim()),
        faculty,
        mentor,
        keywords: keywords.split(',').map((s) => s.trim()),
        file_url: publicUrl,
        submitter_email: user.email,
        status: 'pending',
      },
    ]);

    if (insertError) {
      console.error('Error inserting project:', insertError);
      // Revert the file upload if the insert fails
      await supabase.storage.from('project-submissions').remove([filePath]);
      return;
    }

    setIsSubmitted(true);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle>Submit Your Project</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-4'>Thank you for your submission!</h2>
              <p>Your project has been submitted for approval. An administrator will review the information, and upon approval, it will be listed in the projects section.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                  Project Title
                </label>
                <Input id='title' name='title' type='text' required />
              </div>
              <div>
                <label htmlFor='organizationName' className='block text-sm font-medium text-gray-700'>
                  Organization Name
                </label>
                <Input id='organizationName' name='organizationName' type='text' required />
              </div>
              <div>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                  Short Description
                </label>
                <Textarea id='description' name='description' required />
              </div>
              <div>
                <label htmlFor='fullDescription' className='block text-sm font-medium text-gray-700'>
                  Full Description
                </label>
                <Textarea id='fullDescription' name='fullDescription' rows={6} required />
              </div>
              <div>
                <label htmlFor='studentNames' className='block text-sm font-medium text-gray-700'>
                  Student Names (comma-separated)
                </label>
                <Input id='studentNames' name='studentNames' type='text' required />
              </div>
              <div>
                <label htmlFor='faculty' className='block text-sm font-medium text-gray-700'>
                  Faculty
                </label>
                <Input id='faculty' name='faculty' type='text' required />
              </div>
              <div>
                <label htmlFor='mentor' className='block text-sm font-medium text-gray-700'>
                  Mentor
                </label>
                <Input id='mentor' name='mentor' type='text' required />
              </div>
              <div>
                <label htmlFor='keywords' className='block text-sm font-medium text-gray-700'>
                  Keywords (comma-separated)
                </label>
                <Input id='keywords' name='keywords' type='text' required />
              </div>
              <div>
                <label htmlFor='projectFiles' className='block text-sm font-medium text-gray-700'>
                  Upload Project File
                </label>
                <Input id='projectFiles' name='projectFiles' type='file' required onChange={handleFileChange} />
                <p className="mt-1 text-sm text-gray-500">Upload any relevant document for your project (e.g., a proposal, report, or presentation).</p>
              </div>
              <Button type='submit'>Submit for Approval</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
