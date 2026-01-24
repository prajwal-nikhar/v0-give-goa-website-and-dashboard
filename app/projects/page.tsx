'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title');
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching projects:', error.message);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [supabase]);

  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.keywords && project.keywords.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .sort((a, b) => {
        if (sortOption === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [projects, searchTerm, sortOption]);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <p className='text-muted-foreground'>Loading projects...</p>
      </div>
    );
  }

  if (filteredAndSortedProjects.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <h2 className='text-2xl font-bold mb-4'>No projects available</h2>
        <p className='text-muted-foreground'>Please check back later or try a different search term.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold mb-4 md:mb-0'>Projects</h1>
        <div className='flex items-center gap-4'>
          <Input
            placeholder='Search projects...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='max-w-xs'
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>Sort by</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                <DropdownMenuRadioItem value='title'>Title</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {filteredAndSortedProjects.map(project => (
          <Card key={project.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
            <Link href={`/projects/${project.id}`}>
              <img src={project.image_url || 'https://source.unsplash.com/random/800x600?placeholder'} alt={project.title} className='w-full h-48 object-cover' />
              <CardContent className='p-6'>
                <h2 className='text-xl font-bold mb-2'>{project.title}</h2>
                <p className='text-muted-foreground mb-4'>{project.description}</p>
                {project.keywords && <div className='flex flex-wrap gap-2'>
                  {project.keywords.map((keyword: string) => (
                    <Badge key={keyword} variant='secondary'>
                      {keyword}
                    </Badge>
                  ))}
                </div>}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
