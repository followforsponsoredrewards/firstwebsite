import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { password, sponsorData } = await request.json();

        // 1. Authenticate with master gateway credentials
        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'UNAUTHORIZED SYSTEM TOKEN' }, { status: 401 });
        }
        
        // Replace your previous createClient initialization with this hard-coded option config:
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false
                },
                global: {
                    headers: {
                        // Force the master Service Role authorization token directly into the query header pipeline
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`
                    }
                }
            }
        );

        // 3. Write data to public.sponsors
        const { data, error } = await supabaseAdmin
            .from('sponsors')
            .insert([
                {
                    name: sponsorData.name.toUpperCase(),
                    logo_url: sponsorData.logo_url || null,
                    website_url: sponsorData.website_url || null
                }
            ])
            .select()

        if (error) throw error;

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}