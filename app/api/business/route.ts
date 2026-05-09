import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Store in localStorage on client, Supabase when configured
    return NextResponse.json({ success: true, business: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save business' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ businesses: [] });
}
