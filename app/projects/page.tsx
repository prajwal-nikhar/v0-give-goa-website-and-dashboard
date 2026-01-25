'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase';
import { X } from 'lucide-react';

const PROGRAM_START_YEARS: Record<string, number> = {
  'PGDM CORE': 2005,
  'PGDM BIFS': 2016,
  'PGDM BDA': 2020,
  'PGDM HCM': 2022,
};

const PROGRAM_OPTIONS = Object.keys(PROGRAM_START_YEARS);

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sdgFilter, setSdgFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  const currentYear = new Date().getFullYear();

  const availableYears = useMemo(() => {
    if (programFilter === 'all') {
      const minYear = Math.min(...Object.values(PROGRAM_START_YEARS));
      return Array.from({ length: currentYear - minYear + 1 }, (_, i) => currentYear - i);
    }
    const startYear = PROGRAM_START_YEARS[programFilter] || 2005;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
  }, [programFilter, currentYear]);

  useEffect(() => {
    if (yearFilter !== 'all' && !availableYears.includes(parseInt(yearFilter))) {
      setYearFilter('all');
    }
  }, [availableYears, yearFilter]);

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

  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        const matchesSearch = 
          project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.objectives?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.keywords && project.keywords.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase())));
        
        const matchesProgram = programFilter === 'all' || project.program === programFilter;
        const matchesYear = yearFilter === 'all' || project.year === yearFilter;
        const matchesSdg = sdgFilter === 'all' || project.sdg === sdgFilter;
        
        return matchesSearch && matchesProgram && matchesYear && matchesSdg;
      })
      .sort((a, b) => a.title?.localeCompare(b.title || '') || 0);
  }, [projects, searchTerm, programFilter, yearFilter, sdgFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setProgramFilter('all');
    setYearFilter('all');
    setSdgFilter('all');
  };

  const hasActiveFilters = searchTerm || programFilter !== 'all' || yearFilter !== 'all' || sdgFilter !== 'all';

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className='text-muted-foreground'>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-6'>Projects</h1>
        
        <div className='bg-muted/50 rounded-lg p-4 space-y-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <Input
                placeholder='Search projects by title, description, or keywords...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full'
              />
            </div>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label className='text-sm font-medium mb-1 block'>Program</label>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {PROGRAM_OPTIONS.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program} (from {PROGRAM_START_YEARS[program]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='text-sm font-medium mb-1 block'>Year</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='text-sm font-medium mb-1 block'>SDG Goal</label>
              <Select value={sdgFilter} onValueChange={setSdgFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All SDGs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SDG Goals</SelectItem>
                  {SDG_OPTIONS.map((sdg) => (
                    <SelectItem key={sdg} value={sdg}>
                      {sdg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-end'>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className='w-full'>
                  <X className='h-4 w-4 mr-2' />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className='flex flex-wrap gap-2 pt-2'>
              {programFilter !== 'all' && (
                <Badge variant="secondary" className='gap-1'>
                  Program: {programFilter}
                  <X className='h-3 w-3 cursor-pointer' onClick={() => setProgramFilter('all')} />
                </Badge>
              )}
              {yearFilter !== 'all' && (
                <Badge variant="secondary" className='gap-1'>
                  Year: {yearFilter}
                  <X className='h-3 w-3 cursor-pointer' onClick={() => setYearFilter('all')} />
                </Badge>
              )}
              {sdgFilter !== 'all' && (
                <Badge variant="secondary" className='gap-1'>
                  SDG: {sdgFilter.split(' - ')[0]}
                  <X className='h-3 w-3 cursor-pointer' onClick={() => setSdgFilter('all')} />
                </Badge>
              )}
            </div>
          )}
        </div>

        <p className='text-sm text-muted-foreground mt-4'>
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>

      {filteredProjects.length === 0 ? (
        <div className='flex flex-col items-center justify-center min-h-[40vh] text-center'>
          <h2 className='text-2xl font-bold mb-4'>No projects found</h2>
          <p className='text-muted-foreground mb-4'>Try adjusting your filters or search term.</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProjects.map(project => (
            <Card key={project.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
              <Link href={`/projects/${project.id}`}>
                <div className='h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center'>
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className='w-full h-full object-cover' />
                  ) : (
                    <div className='text-4xl font-bold text-primary/30'>
                      {project.title?.charAt(0) || 'P'}
                    </div>
                  )}
                </div>
                <CardContent className='p-4'>
                  <h2 className='text-lg font-bold mb-2 line-clamp-2'>{project.title}</h2>
                  <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                    {project.objectives || project.description}
                  </p>
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {project.program && (
                      <Badge variant='default' className='text-xs'>{project.program}</Badge>
                    )}
                    {project.year && (
                      <Badge variant='outline' className='text-xs'>{project.year}</Badge>
                    )}
                    {project.sdg && (
                      <Badge variant='secondary' className='text-xs'>{project.sdg.split(' - ')[0]}</Badge>
                    )}
                  </div>
                  {project.geographical_scope && (
                    <p className='text-xs text-muted-foreground'>
                      Location: {project.geographical_scope}
                    </p>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
