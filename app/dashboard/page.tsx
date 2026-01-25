'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Users, Target, MapPin, Building2, Calendar, TrendingUp, Filter } from 'lucide-react'
import { IndiaMap } from '@/components/india-map'
import { getSupabaseClient } from '@/lib/supabase'

interface Project {
  id: string;
  title: string;
  year: string | null;
  sdg: string | null;
  sector: string | null;
  program: string | null;
  organization_name: string | null;
  geographical_scope: string | null;
  group_no: string | null;
  student_names: string[] | null;
}

interface StateData {
  projects: number;
  partners: number;
  coordinates: [number, number];
}

interface GeographyData {
  [key: string]: StateData;
}

const programs: { [key: string]: number } = {
  'PGDM CORE': 2005,
  'PGDM BDA': 2020,
  'PGDM BIFS': 2016,
  'PGDM HCM': 2022,
};

const SDG_COLORS = [
  'hsl(10, 70%, 55%)',
  'hsl(40, 80%, 55%)',
  'hsl(120, 65%, 45%)',
  'hsl(200, 75%, 50%)',
  'hsl(260, 50%, 50%)',
  'hsl(350, 70%, 50%)',
  'hsl(180, 60%, 45%)',
  'hsl(300, 50%, 55%)',
  'hsl(60, 70%, 50%)',
  'hsl(220, 60%, 55%)',
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedSDG, setSelectedSDG] = useState('all')
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedProgram, setSelectedProgram] = useState('all');

  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('id, title, year, sdg, sector, program, organization_name, geographical_scope, group_no, student_names')
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [supabase]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (selectedYear !== 'all' && p.year !== selectedYear) return false;
      if (selectedSDG !== 'all' && (!p.sdg || !p.sdg.toLowerCase().includes(selectedSDG.toLowerCase()))) return false;
      if (selectedSector !== 'all' && (!p.sector || !p.sector.toLowerCase().includes(selectedSector.toLowerCase()))) return false;
      if (selectedProgram !== 'all' && (!p.program || !p.program.includes(selectedProgram))) return false;
      return true;
    });
  }, [projects, selectedYear, selectedSDG, selectedSector, selectedProgram]);

  const stats = useMemo(() => {
    let studentsCount = 0;
    const orgsSet = new Set<string>();
    const geoSet = new Set<string>();

    filteredProjects.forEach(p => {
      if (p.student_names && Array.isArray(p.student_names)) {
        studentsCount += p.student_names.length;
      } else if (p.group_no) {
        studentsCount += 4;
      }
      if (p.organization_name) {
        orgsSet.add(p.organization_name);
      }
      if (p.geographical_scope) {
        geoSet.add(p.geographical_scope);
      }
    });

    return {
      totalProjects: filteredProjects.length,
      studentsEngaged: studentsCount,
      partnerOrgs: orgsSet.size,
      geographicReach: geoSet.size || 1,
    };
  }, [filteredProjects]);

  const availableYears = useMemo(() => {
    const yearsFromData = new Set<string>();
    projects.forEach(p => {
      if (p.year) yearsFromData.add(p.year);
    });
    
    if (selectedProgram !== 'all' && programs[selectedProgram]) {
      const startYear = programs[selectedProgram];
      return Array.from(yearsFromData)
        .filter(y => parseInt(y) >= startYear)
        .sort((a, b) => parseInt(b) - parseInt(a));
    }
    
    return Array.from(yearsFromData).sort((a, b) => parseInt(b) - parseInt(a));
  }, [projects, selectedProgram]);

  const availableSDGs = useMemo(() => {
    const sdgSet = new Set<string>();
    projects.forEach(p => {
      if (p.sdg) {
        const matches = p.sdg.match(/SDG\s*\d+/gi);
        if (matches) {
          matches.forEach(s => sdgSet.add(s.toUpperCase().replace(/\s+/g, ' ')));
        }
      }
    });
    return Array.from(sdgSet).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''));
      const numB = parseInt(b.replace(/\D/g, ''));
      return numA - numB;
    });
  }, [projects]);

  const availableSectors = useMemo(() => {
    const sectorSet = new Set<string>();
    projects.forEach(p => {
      if (p.sector) sectorSet.add(p.sector);
    });
    return Array.from(sectorSet).sort();
  }, [projects]);

  const projectsByYear = useMemo(() => {
    const yearMap: { [key: string]: { projects: number; students: number } } = {};
    
    filteredProjects.forEach(p => {
      const year = p.year || 'Unknown';
      if (!yearMap[year]) {
        yearMap[year] = { projects: 0, students: 0 };
      }
      yearMap[year].projects++;
      if (p.student_names && Array.isArray(p.student_names)) {
        yearMap[year].students += p.student_names.length;
      } else if (p.group_no) {
        yearMap[year].students += 4;
      }
    });

    return Object.entries(yearMap)
      .map(([year, data]) => ({ year, ...data }))
      .filter(d => d.year !== 'Unknown')
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [filteredProjects]);

  const projectsBySDG = useMemo(() => {
    const sdgMap: { [key: string]: number } = {};
    
    filteredProjects.forEach(p => {
      if (p.sdg) {
        const matches = p.sdg.match(/SDG\s*\d+/gi);
        if (matches) {
          matches.forEach(s => {
            const normalized = s.toUpperCase().replace(/\s+/g, ' ');
            sdgMap[normalized] = (sdgMap[normalized] || 0) + 1;
          });
        }
      }
    });

    return Object.entries(sdgMap)
      .map(([sdg, count], index) => ({
        sdg,
        count,
        color: SDG_COLORS[index % SDG_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredProjects]);

  const projectsBySector = useMemo(() => {
    const sectorMap: { [key: string]: number } = {};
    
    filteredProjects.forEach(p => {
      const sector = p.sector || 'Other';
      sectorMap[sector] = (sectorMap[sector] || 0) + 1;
    });

    return Object.entries(sectorMap)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredProjects]);

  const projectsByProgram = useMemo(() => {
    const programMap: { [key: string]: number } = {};
    
    filteredProjects.forEach(p => {
      const program = p.program || 'Other';
      programMap[program] = (programMap[program] || 0) + 1;
    });

    const total = filteredProjects.length || 1;
    return Object.entries(programMap)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredProjects]);

  const geographyData: GeographyData = useMemo(() => {
    const geoMap: { [key: string]: { projects: number; partners: Set<string> } } = {
      'Goa': { projects: 0, partners: new Set() },
    };
    
    filteredProjects.forEach(p => {
      const geo = p.geographical_scope || 'Goa';
      if (!geoMap[geo]) {
        geoMap[geo] = { projects: 0, partners: new Set() };
      }
      geoMap[geo].projects++;
      if (p.organization_name) {
        geoMap[geo].partners.add(p.organization_name);
      }
    });

    const result: GeographyData = {};
    const defaultCoords: { [key: string]: [number, number] } = {
      'Goa': [74.05, 15.29],
      'Maharashtra': [75.5, 19.5],
      'Karnataka': [75.5, 14.5],
      'Delhi': [77.2, 28.6],
      'Kerala': [76.5, 10.5],
      'Tamil Nadu': [78.5, 11.0],
    };

    Object.entries(geoMap).forEach(([key, value]) => {
      result[key] = {
        projects: value.projects,
        partners: value.partners.size,
        coordinates: defaultCoords[key] || [74.05, 15.29],
      };
    });

    return result;
  }, [filteredProjects]);

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-xl font-medium'>Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b bg-card'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10'>
          <div className='flex flex-col gap-3'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>GiveGoa Live Dashboard</h1>
              <p className='text-base md:text-lg text-muted-foreground mt-3 leading-relaxed'>
                Real-time insights into community engagement projects led by GIM students
              </p>
            </div>
            <p className='text-sm md:text-base text-muted-foreground max-w-4xl leading-relaxed'>
              Filter projects by year, SDG alignment, sector, and program to understand how student
              initiatives contribute to sustainable development across Goa and beyond.
            </p>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10'>
        <Card className='mb-8 md:mb-10'>
          <CardHeader className='pb-6'>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <Filter className='h-5 w-5 flex-shrink-0' />
              Filter Projects
            </CardTitle>
            <CardDescription className='text-base'>
              Refine the dashboard data by selecting specific criteria
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
              <div className='space-y-2'>
                <label className='text-sm font-medium leading-none'>Program</label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder='All Programs' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Programs</SelectItem>
                    {Object.keys(programs).map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium leading-none'>Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder='All Years' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium leading-none'>SDG Alignment</label>
                <Select value={selectedSDG} onValueChange={setSelectedSDG}>
                  <SelectTrigger>
                    <SelectValue placeholder='All SDGs' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All SDGs</SelectItem>
                    {availableSDGs.map((sdg) => (
                      <SelectItem key={sdg} value={sdg}>
                        {sdg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium leading-none'>Sector</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder='All Sectors' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Sectors</SelectItem>
                    {availableSectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='mt-6 flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSelectedYear('all')
                  setSelectedSDG('all')
                  setSelectedSector('all')
                  setSelectedProgram('all')
                }}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8 md:mb-10'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='text-4xl font-bold'>{stats.totalProjects.toLocaleString()}</div>
                  <p className='text-xs text-muted-foreground mt-2'>Approved projects</p>
                </div>
                <Target className='h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Students Engaged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='text-4xl font-bold'>{stats.studentsEngaged.toLocaleString()}</div>
                  <p className='text-xs text-muted-foreground mt-2'>Participating students</p>
                </div>
                <Users className='h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Partner Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='text-4xl font-bold'>{stats.partnerOrgs.toLocaleString()}</div>
                  <p className='text-xs text-muted-foreground mt-2'>Across all sectors</p>
                </div>
                <Building2 className='h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Geographic Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='text-4xl font-bold'>{stats.geographicReach}</div>
                  <p className='text-xs text-muted-foreground mt-2'>Regions covered</p>
                </div>
                <MapPin className='h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50' />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <Card>
            <CardHeader className='pb-6'>
              <CardTitle className='text-xl'>Project Growth Over Time</CardTitle>
              <CardDescription className='text-base'>
                Number of projects and student participation by year
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              {projectsByYear.length > 0 ? (
                <ChartContainer
                  config={{
                    projects: {
                      label: 'Projects',
                      color: 'hsl(200, 75%, 50%)',
                    },
                    students: {
                      label: 'Students',
                      color: 'hsl(260, 50%, 50%)',
                    },
                  }}
                  className='h-[320px]'
                >
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={projectsByYear}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='year' />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type='monotone'
                        dataKey='projects'
                        stroke='hsl(200, 75%, 50%)'
                        strokeWidth={2}
                        name='Projects'
                      />
                      <Line
                        type='monotone'
                        dataKey='students'
                        stroke='hsl(260, 50%, 50%)'
                        strokeWidth={2}
                        name='Students'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className='h-[320px] flex items-center justify-center text-muted-foreground'>
                  No data available for selected filters
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-6'>
              <CardTitle className='text-xl'>Projects by Sector</CardTitle>
              <CardDescription className='text-base'>Distribution across different focus areas</CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              {projectsBySector.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: 'Projects',
                      color: 'hsl(200, 75%, 50%)',
                    },
                  }}
                  className='h-[320px]'
                >
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={projectsBySector}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='sector' />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey='count' fill='hsl(200, 75%, 50%)' name='Projects' />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className='h-[320px] flex items-center justify-center text-muted-foreground'>
                  No data available for selected filters
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:mb-10'>
          <Card>
            <CardHeader className='pb-6'>
              <CardTitle className='text-xl'>SDG Alignment</CardTitle>
              <CardDescription className='text-base'>
                Projects aligned with UN Sustainable Development Goals
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              {projectsBySDG.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: 'Projects',
                    },
                  }}
                  className='h-[320px]'
                >
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={projectsBySDG}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={(entry) => {
                          if (!entry || !entry.sdg) return ''
                          const percent = entry.percent || 0
                          return `${entry.sdg} ${(percent * 100).toFixed(0)}%`
                        }}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='count'
                        nameKey='sdg'
                      >
                        {projectsBySDG.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className='h-[320px] flex items-center justify-center text-muted-foreground'>
                  No SDG data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-6'>
              <CardTitle className='text-xl'>Program Distribution</CardTitle>
              <CardDescription className='text-base'>Projects by academic program</CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='space-y-6 pt-4'>
                {projectsByProgram.length > 0 ? (
                  projectsByProgram.map((program) => (
                    <div key={program.type} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='font-medium text-base'>{program.type}</div>
                          <Badge variant='secondary' className='text-sm'>
                            {program.count} projects
                          </Badge>
                        </div>
                        <div className='text-sm font-medium text-muted-foreground'>{program.percentage}%</div>
                      </div>
                      <div className='h-3 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-primary rounded-full transition-all'
                          style={{ width: `${program.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='h-[200px] flex items-center justify-center text-muted-foreground'>
                    No program data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className='mb-8 md:mb-10'>
          <CardHeader className='pb-6'>
            <CardTitle className='text-xl'>Geographic Distribution</CardTitle>
            <CardDescription className='text-base'>Project locations across Goa and beyond</CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='mb-8'>
              <IndiaMap data={geographyData} />
            </div>
          </CardContent>
        </Card>

        {process.env.NEXT_PUBLIC_POWERBI_EMBED_URL && (
          <Card className='mb-8 md:mb-10'>
            <CardHeader className='pb-6'>
              <CardTitle className='text-xl'>Power BI Analytics</CardTitle>
              <CardDescription className='text-base'>Advanced analytics and real-time insights</CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='w-full aspect-video rounded-lg overflow-hidden border'>
                <iframe
                  title="Power BI Dashboard"
                  width="100%"
                  height="100%"
                  src={process.env.NEXT_PUBLIC_POWERBI_EMBED_URL}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className='mt-8 p-5 bg-muted/50 rounded-lg border'>
          <p className='text-sm text-muted-foreground text-center flex items-center justify-center gap-2'>
            <Calendar className='h-4 w-4 flex-shrink-0' />
            <span>Dashboard updated in real-time from database | Total: {projects.length} approved projects</span>
          </p>
        </div>
      </main>
    </div>
  )
}
