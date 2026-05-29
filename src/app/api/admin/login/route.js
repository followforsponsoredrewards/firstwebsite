// src/app/api/admin/login/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const systemPassword = process.env.ADMIN_PASSWORD;

    // Server-side evaluation protect against client tempering
    if (password === systemPassword) {
      return NextResponse.json({ authenticated: true }, { status: 200 });
    }

    return NextResponse.json({ authenticated: false, error: 'Unauthorized Key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}