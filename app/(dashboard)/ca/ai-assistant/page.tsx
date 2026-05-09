'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  ts: string;
}

const CA_SYSTEM_PROMPT = `You are ArthMitra's CA Assistant — a professional AI tool for Chartered Accountants and legal professionals in India.

You help CAs with:
1. Compliance queries (GST, TDS, Income Tax, PF, ESIC)
2. Client-specific advice and risk assessment
3. Government scheme eligibility for clients
4. Interstate business expansion compliance
5. Recent regulatory changes and notifications

Respond in professional English or Hinglish based on how the CA writes. Be precise and cite sections/rules where relevant. Always note when professional judgment is needed.`;

const QUICK_PROMPTS = [
  'Latest GST circular summary',
  'TDS rate chart for FY25',
  'MSME scheme for textile client',
  'Penalty waiver procedure',
];

const INITIAL_MESSAGE: Msg = {
  role: 'assistant',
  content: 'Namaste! I am your ArthMitra CA Assistant. Ask me about GST, TDS, Income Tax, client compliance, government schemes, or any regulatory queries. I will provide precise, actionable guidance.',
  ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
};

export default function CAAssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg: Msg = { role: 'user', content: userText, ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: CA_SYSTEM_PROMPT,
          role: 'ca',
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.response || '';
      if (data.error && !reply) {
        setError(true);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: reply || 'Unable to get response. Please retry.',
          ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      setMessages(prev => prev.filter((_, i) => i < prev.lastIndexOf(lastUser) + 1));
      setError(false);
      sendMessage(lastUser.content);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--gray-50)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ background: 'white', borderColor: 'var(--gray-100)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--navy)' }}>
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>AI CA Assistant</h1>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--gray-500)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Online
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: 'var(--gray-500)' }}>
          <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
          Powered by GPT-4o-mini
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-5 py-2 flex gap-2 overflow-x-auto border-b" style={{ background: 'white', borderColor: 'var(--gray-100)' }}>
        {QUICK_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => sendMessage(p)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{ borderColor: 'var(--gray-100)', color: 'var(--gray-500)', background: 'var(--gray-50)' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: msg.role === 'user' ? 'var(--saffron)' : 'var(--navy)' }}
              >
                {msg.role === 'user'
                  ? <User className="h-4 w-4 text-white" />
                  : <Bot className="h-4 w-4 text-white" />}
              </div>
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === 'user' ? 'var(--saffron)' : 'white',
                    color: msg.role === 'user' ? 'white' : 'var(--navy)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
                <span className="text-xs" style={{ color: 'var(--gray-500)' }}>{msg.ts}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--navy)' }}>
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(j => (
                  <motion.div
                    key={j}
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--gray-500)' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: '#FEE2E2' }}>
            <span className="text-sm" style={{ color: '#DC2626' }}>API call failed. Retry karo.</span>
            <button
              onClick={retry}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{ background: '#DC2626', color: 'white' }}
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t flex gap-3" style={{ background: 'white', borderColor: 'var(--gray-100)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="GST, TDS, Income Tax, client query... poochho"
          disabled={loading}
          style={{
            flex: 1, padding: '10px 14px',
            border: '1.5px solid #E8E8E0', borderRadius: '10px',
            fontSize: '14px', color: '#0D1B2A', backgroundColor: '#F9F9F7', outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = '#FF6B00'; }}
          onBlur={e => { e.target.style.borderColor = '#E8E8E0'; }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity"
          style={{ background: 'var(--navy)', opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}
