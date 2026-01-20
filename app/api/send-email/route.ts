
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    // Ensure service role key is available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Supabase service role key is not available.');
        return NextResponse.json({ error: 'Server configuration error: Missing Supabase service role key.' }, { status: 500 });
    }
    
    // Create Supabase client with service role
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    try {
        const { project } = await req.json();

        if (!project) {
          return NextResponse.json({ error: 'Project data not provided' }, { status: 400 });
        }
        
        // Invoke the Supabase Edge Function
        const { data, error: invokeError } = await supabaseAdmin.functions.invoke('send-email', {
          body: { project },
        });

        if (invokeError) {
          throw invokeError;
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Error invoking send-email function:', error);
        return NextResponse.json({ error: error.message || 'Failed to invoke function.' }, { status: 500 });
    }
}
