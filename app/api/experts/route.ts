import { NextRequest, NextResponse } from 'next/server';
import { MOCK_EXPERTS } from '@/lib/experts-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const state = searchParams.get('state');
  const language = searchParams.get('language');
  const maxRate = searchParams.get('maxRate');

  let experts = MOCK_EXPERTS;

  if (type) experts = experts.filter(e => e.type === type);
  if (state) experts = experts.filter(e => e.states.includes(state));
  if (language) experts = experts.filter(e => e.languages.includes(language));
  if (maxRate) experts = experts.filter(e => e.hourlyRate <= parseInt(maxRate));

  return NextResponse.json({ experts });
}
