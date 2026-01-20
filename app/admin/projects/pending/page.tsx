import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import PendingProjectsClient from './client-page';

export default async function PendingProjectsPage() {
  const cookieStore = await cookies(); // ✅ FIX HERE

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

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching pending projects:', error);
  }

  return <PendingProjectsClient initialProjects={projects || []} />;
}
