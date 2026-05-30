import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { password, dropData } = await request.json();

        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'UNAUTHORIZED SYSTEM TOKEN' }, { status: 401 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        );

        // Map data directly to the public.drops table columns
        const { data, error } = await supabaseAdmin
            .from('drops')
            .insert([
                {
                    drop_number: Number(dropData.drop_number),
                    title: dropData.title,
                    keyword: dropData.keyword,
                    instagram_url: dropData.instagram_url || null,
                    sponsor_id: dropData.sponsor_id || null // Links foreign key relation if present
                }
            ])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}