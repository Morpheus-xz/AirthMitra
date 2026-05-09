import { NextRequest, NextResponse } from 'next/server';
import { SCHEMES, matchSchemes } from '@/lib/schemes-data';
import { callOpenAI } from '@/lib/openai';

const SYSTEM_PROMPT = `You are ArthMitra AI. Explain government schemes in SIMPLE Hinglish. Be enthusiastic about benefits. Tell the user exactly why they qualify and what they'll get. Keep it to 2-3 sentences max per scheme.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business } = body;

    if (!business) {
      return NextResponse.json({ error: 'Business profile required' }, { status: 400 });
    }

    const matched = matchSchemes(business);

    const schemesWithExplanations = await Promise.all(
      matched.slice(0, 6).map(async (scheme) => {
        let explanation = '';
        try {
          const prompt = `Business: ${business.business_name} (${business.business_type}, ${business.state}, ₹${(business.annual_turnover / 100000).toFixed(1)}L turnover).

Scheme: ${scheme.name} — ${scheme.benefit}

Explain in 2 sentences why this business qualifies for this scheme and what they should do next. Use simple Hinglish.`;
          explanation = await callOpenAI(prompt, SYSTEM_PROMPT, 0.5);
        } catch {
          explanation = `Aapka business ${scheme.name} ke liye eligible hai! ${scheme.benefit}. Abhi apply karo.`;
        }
        return { ...scheme, aiExplanation: explanation, priority: scheme.category === 'loan' ? 'high' : 'medium' };
      })
    );

    const almostEligible = SCHEMES.filter(s => !matched.find(m => m.id === s.id)).slice(0, 3).map(s => ({
      ...s,
      gapReason: s.eligibility.requiresUdyam && !business.udyam_number ? 'Udyam registration chahiye' :
        s.eligibility.isStartup && !business.is_startup ? 'Startup hona chahiye (<2 years)' :
        'Profile mein kuch changes needed',
    }));

    return NextResponse.json({
      matched: schemesWithExplanations,
      almostEligible,
      totalMatched: matched.length,
    });
  } catch (error) {
    console.error('Schemes API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
