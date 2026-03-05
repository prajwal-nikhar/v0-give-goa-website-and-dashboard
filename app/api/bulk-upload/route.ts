import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json();

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json(
        { error: 'No projects data provided' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY secret.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const mappedProjects = projects.map((row: Record<string, string>) => {
      const rawSdg = row['SDG'] || row['sdg'] || '';
      let formattedSdg = null;
      
      if (rawSdg) {
        // Match "SDG 11" or "11" from "SDG 11 - Sustainable Cities & Communities" or "SDG 11" or "11"
        const match = rawSdg.match(/(?:SDG\s*)?(\d+)/i);
        if (match) {
          const sdgNum = match[1];
          // Find the matching full option from SDG_OPTIONS equivalent
          const sdgOptions = [
            'SDG 1 - No Poverty', 'SDG 2 - Zero Hunger', 'SDG 3 - Good Health and Well-being',
            'SDG 4 - Quality Education', 'SDG 5 - Gender Equality', 'SDG 6 - Clean Water and Sanitation',
            'SDG 7 - Affordable and Clean Energy', 'SDG 8 - Decent Work and Economic Growth',
            'SDG 9 - Industry, Innovation and Infrastructure', 'SDG 10 - Reduced Inequalities',
            'SDG 11 - Sustainable Cities and Communities', 'SDG 12 - Responsible Consumption and Production',
            'SDG 13 - Climate Action', 'SDG 14 - Life Below Water', 'SDG 15 - Life on Land',
            'SDG 16 - Peace, Justice and Strong Institutions', 'SDG 17 - Partnerships for the Goals'
          ];
          formattedSdg = sdgOptions.find(opt => opt.startsWith(`SDG ${sdgNum} -`) || opt === `SDG ${sdgNum}`) || rawSdg;
        } else {
          formattedSdg = rawSdg;
        }
      }

      return {
        title: row['List of Projects'] || row['Project Title'] || row['title'] || row['Project Name'] || 'Untitled Project',
        sector: row['Sector'] || row['sector'] || null,
        geographical_scope: row['Geographical Scope'] || row['geographical_scope'] || null,
        group_no: row['Group No'] || row['group_no'] || null,
        year: row['Yr'] || row['Year'] || row['year'] || null,
        group_id: row['GroupID'] || row['group_id'] || null,
        concentration: row['conc'] || row['Concentration'] || row['concentration'] || null,
        sdg: formattedSdg,
        program: row['Program'] || row['program'] || null,
        project_link: row['Link to the projects'] || row['Project Link'] || row['project_link'] || null,
        objectives: row['Objectives'] || row['objectives'] || null,
        description: row['Objectives'] || row['Description'] || row['description'] || null,
        organization_name: row['Organization'] || row['Partner Organization'] || row['organization_name'] || null,
        faculty: row['Faculty'] || row['faculty'] || null,
        mentor: row['Mentor'] || row['mentor'] || null,
        submitter_email: row['Email'] || row['submitter_email'] || 'bulk-import@admin.com',
        status: 'approved',
        created_at: new Date().toISOString(),
      };
    });

    const { data, error } = await supabase
      .from('projects')
      .insert(mappedProjects)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      count: data?.length || 0,
      message: `Successfully imported ${data?.length || 0} projects`
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
