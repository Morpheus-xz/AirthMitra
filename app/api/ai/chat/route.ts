import { NextRequest, NextResponse } from 'next/server';
import { callOpenAIChat } from '@/lib/openai';
import { ChatMessage } from '@/types';

const DEFAULT_SYSTEM_PROMPT = `You are ArthMitra AI — "India Ka Business Dost". You help Indian MSME owners with:
1. Compliance questions (GST, TDS, PF, ESIC, income tax)
2. Government scheme discovery and application
3. Business expansion queries
4. General business advice

Reply in the same language the user writes in. If they write Hindi/Devanagari, reply in Hindi. If Hinglish, use Hinglish. If English, reply in English.

Keep answers simple, practical, and actionable. Always mention if they should consult a professional CA or lawyer for complex matters.

Current date: ${new Date().toLocaleDateString('en-IN')}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, businessProfile, language, systemPrompt } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    let finalSystemPrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;

    // Append business context for business role if no custom systemPrompt
    if (!systemPrompt && businessProfile) {
      const businessContext = `Business: ${businessProfile.business_name}, Type: ${businessProfile.business_type}, State: ${businessProfile.state}, Turnover: ₹${(businessProfile.annual_turnover / 100000).toFixed(1)}L, Employees: ${businessProfile.employee_count}, GST: ${businessProfile.gst_registered ? 'Registered' : 'Not registered'}, Udyam: ${businessProfile.udyam_number || 'Not registered'}.`;
      finalSystemPrompt += `\nPreferred language: ${language || 'en'}\nBusiness context: ${businessContext}`;
    }

    let reply = '';
    try {
      reply = await callOpenAIChat(
        messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
        finalSystemPrompt
      );
    } catch {
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      if (lastMsg.includes('gst') || lastMsg.includes('जीएसटी')) {
        reply = 'GST ke baare mein: Agar aapka annual turnover ₹20 lakh se zyada hai toh GST registration mandatory hai. GSTR-3B monthly file karna hota hai — 20 tarikh tak. Late filing pe ₹50/day penalty lagti hai. Koi specific sawaal hai?';
      } else if (lastMsg.includes('mudra') || lastMsg.includes('loan')) {
        reply = 'MUDRA Loan ke liye: Apne nearest bank ya NBFC mein jao. Shishu (₹50K tak), Kishor (₹5L tak), ya Tarun (₹10L tak) — teen categories hain. Documents: Aadhaar, PAN, 6 months bank statement. Collateral nahi chahiye!';
      } else {
        reply = 'Namaste! Main ArthMitra AI hun — aapka business dost. GST, schemes, compliance, ya expansion — kisi bhi topic pe sawaal karo. Main simple language mein jawab dunga!';
      }
    }

    return NextResponse.json({ reply, response: reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      reply: 'Maafi karo, abhi AI service temporary unavailable hai. Thodi der baad try karo.',
      response: 'Maafi karo, abhi AI service temporary unavailable hai. Thodi der baad try karo.',
      error: true,
    }, { status: 200 });
  }
}
