import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(_request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase service role key not configured.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Delete all projects (table likely uses a non-numeric primary key, so avoid numeric comparison)
    const { error } = await supabase
      .from('projects')
      .delete()
      .not('id', 'is', null);

    if (error) {
      console.error('Error deleting all projects:', error);
      return NextResponse.json(
        { error: 'Failed to delete all projects.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error deleting all projects:', error);
    return NextResponse.json(
      { error: 'Unexpected error deleting all projects.' },
      { status: 500 }
    );
  }
}

