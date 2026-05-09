import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { MOCK_EXPERTS } from '@/lib/experts-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromState, toState, businessType, businessProfile } = body;

    if (!fromState || !toState || !businessType) {
      return NextResponse.json({ error: 'fromState, toState, and businessType required' }, { status: 400 });
    }

    const systemPrompt = `You are ArthMitra AI, an expert on Indian business regulations and state-specific compliance. Provide practical, actionable expansion advice for Indian MSME owners in simple Hinglish.`;

    const prompt = `A ${businessType} business from ${fromState} wants to expand to ${toState}.
Business context: ${businessProfile ? `Turnover: ₹${(businessProfile.annual_turnover / 100000).toFixed(1)}L, Employees: ${businessProfile.employee_count}` : 'MSME'}.

Provide:
1. Top 5 compliance requirements specific to ${toState} for ${businessType} businesses
2. Top 3 state-specific schemes/incentives available in ${toState}
3. Key risks and challenges
4. Estimated setup timeline (in weeks)

Format as JSON:
{
  "compliances": [{"name": "...", "description": "...", "urgency": "high/medium/low"}],
  "schemes": [{"name": "...", "benefit": "...", "url": "..."}],
  "risks": ["..."],
  "timelineWeeks": 12,
  "aiSummary": "2-3 sentence Hinglish summary"
}`;

    let expansionData;
    try {
      const response = await callOpenAI(prompt, systemPrompt, 0.4);
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      expansionData = JSON.parse(cleaned);
    } catch {
      expansionData = {
        compliances: [
          { name: 'Shop & Establishment Registration', description: `${toState} mein business shuru karne ke liye local registration zaroori`, urgency: 'high' },
          { name: 'GST Additional Place of Business', description: 'Existing GSTIN mein naya state add karo', urgency: 'high' },
          { name: 'Professional Tax Registration', description: `${toState} specific state tax`, urgency: 'medium' },
          { name: 'FSSAI State License', description: 'Agar food business hai toh state-level license', urgency: 'medium' },
          { name: 'Local Municipal License', description: 'City/town municipal corporation se NOC', urgency: 'low' },
        ],
        schemes: [
          { name: 'State Industrial Policy', benefit: `${toState} sarkar se capital subsidy aur tax incentives`, url: '#' },
          { name: 'MSME Development Programme', benefit: 'Technical and financial assistance for expansion', url: 'https://msme.gov.in' },
          { name: 'GeM Portal', benefit: 'Government procurement direct access', url: 'https://gem.gov.in' },
        ],
        risks: [
          'Naye market mein distribution network banana padega',
          'Local labor laws aur regulations samajhni hongi',
          'Working capital requirement badhegi',
        ],
        timelineWeeks: 12,
        aiSummary: `${fromState} se ${toState} expansion ke liye lagbhag 12 weeks lagenge. Pehle GST mein additional place of business add karo, phir local licenses lo. ${toState} sarkar MSMEs ke liye acche incentives deti hai — apply zaroor karo!`,
      };
    }

    const recommendedExperts = MOCK_EXPERTS.filter(e =>
      e.states.includes(toState) || e.states.includes('all')
    ).slice(0, 3);

    return NextResponse.json({
      ...expansionData,
      recommendedExperts,
      fromState,
      toState,
    });
  } catch (error) {
    console.error('Expansion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
