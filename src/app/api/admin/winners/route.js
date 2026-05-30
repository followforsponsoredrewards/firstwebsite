import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { password, winnerData } = await request.json();

        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'UNAUTHORIZED SYSTEM TOKEN' }, { status: 401 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        );

        const { data, error } = await supabaseAdmin
            .from('winners')
            .insert([
                {
                    drop_id: winnerData.drop_id,
                    username: winnerData.username,
                    amount: Number(winnerData.amount),
                    payment_proof_url: winnerData.payment_proof_url || null
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}