import { NextRequest, NextResponse } from 'next/server';
import { COMPLIANCE_RULES, isApplicable, calculateComplianceScore } from '@/lib/compliance-rules';
import { callOpenAI } from '@/lib/openai';

const SYSTEM_PROMPT = `You are ArthMitra AI, India's MSME compliance assistant. Explain compliance requirements in SIMPLE Hindi-English (Hinglish) that a small business owner can understand. Never use complex legal jargon. Be friendly and helpful like a knowledgeable dost. Keep responses concise and actionable.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business } = body;

    if (!business) {
      return NextResponse.json({ error: 'Business profile required' }, { status: 400 });
    }

    const { score, applicable, pending } = calculateComplianceScore(business, body.filedIds || []);

    let aiExplanation = '';
    try {
      const prompt = `Business: ${business.business_name}, Type: ${business.business_type}, State: ${business.state}, Turnover: ₹${(business.annual_turnover / 100000).toFixed(1)}L, Employees: ${business.employee_count}.

Applicable compliances: ${applicable.map(r => r.name).join(', ')}.
Pending: ${pending.map(r => r.name).join(', ')}.

Give a 3-line summary of their compliance status and top 2 actions to take immediately. Keep it in simple Hinglish.`;

      aiExplanation = await callOpenAI(prompt, SYSTEM_PROMPT);
    } catch {
      aiExplanation = `Aapke business ke liye ${applicable.length} compliance rules applicable hain. ${pending.length} pending hain. GST aur Income Tax filing sabse important hai. Deadline miss mat karo — penalty bahut badi ho sakti hai!`;
    }

    const upcomingDeadlines = applicable.slice(0, 6).map((rule, i) => ({
      rule: rule.name,
      deadline: rule.deadlines[0],
      status: pending.find(p => p.id === rule.id) ? 'pending' : 'filed',
      penalty: rule.penalty,
    }));

    return NextResponse.json({
      score,
      applicable,
      pending,
      aiExplanation,
      upcomingDeadlines,
    });
  } catch (error) {
    console.error('Compliance API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
