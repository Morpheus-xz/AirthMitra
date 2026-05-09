'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GovernmentScheme } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SchemeInfoModalProps {
  scheme: GovernmentScheme;
  open: boolean;
  onClose: () => void;
}

export default function SchemeInfoModal({ scheme, open, onClose }: SchemeInfoModalProps) {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      fetchSchemeInfo();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchSchemeInfo() {
    setLoading(true);
    const prompt = lang === 'hi'
      ? `${scheme.name} सरकारी योजना के बारे में विस्तृत जानकारी दें। निम्नलिखित शामिल करें:\n1. योजना क्या है और इसका उद्देश्य\n2. पात्रता मानदंड (टर्नओवर, कर्मचारी, व्यापार प्रकार)\n3. आवेदन कैसे करें (चरण-दर-चरण)\n4. आवश्यक दस्तावेज\n5. मुख्य लाभ और राशि\n6. समयसीमा\n7. छोटे व्यापार के लिए सुझाव\n\nयोजना की पूरी जानकारी: ${scheme.fullDescription}\nलाभ: ${scheme.benefit}\nमंत्रालय: ${scheme.ministry}`
      : `Provide comprehensive information about the ${scheme.name} government scheme in India. Include:\n1. What the scheme is and its main objective\n2. Eligibility criteria (turnover, employees, business type, registration)\n3. How to apply — step-by-step process\n4. Documents required\n5. Key benefits and amounts\n6. Processing timeline\n7. Practical tips for small business owners\n\nScheme details: ${scheme.fullDescription}\nBenefit: ${scheme.benefit}\nMinistry: ${scheme.ministry}`;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      const reply = data.message || data.content || data.reply || 'Information not available. Please visit the official scheme website.';
      setMessages([{ role: 'assistant', content: reply }]);
    } catch {
      setMessages([{ role: 'assistant', content: 'Could not fetch scheme information. Please try again or visit the official website.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const schemeContext = `Context: The user is asking about the ${scheme.name} government scheme (${scheme.ministry}). Benefit: ${scheme.benefit}.`;
      const apiMessages = [
        { role: 'user', content: schemeContext + '\n\n' + newMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') },
      ];
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      const reply = data.message || data.content || data.reply || 'Please try asking again.';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Could not get a response. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(13,27,42,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '90vh', height: '90vh' }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b flex items-start gap-3 flex-shrink-0" style={{ borderColor: 'var(--gray-100)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--saffron-light)' }}>
              <Info className="h-5 w-5" style={{ color: 'var(--saffron)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold font-['Sora'] text-sm leading-tight" style={{ color: 'var(--navy)' }}>
                {t('schemeInfoTitle', lang)}
              </div>
              <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--gray-500)' }}>
                {scheme.name} — {scheme.ministry}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-gray-100"
              style={{ color: 'var(--gray-500)' }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Benefit pill */}
          <div className="px-5 py-3 flex-shrink-0" style={{ background: '#E8F5E9', borderBottom: '1px solid #C8E6C9' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--india-green)' }}>
              💰 {scheme.benefit}
            </p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.length === 0 && loading && (
              <div className="flex items-center gap-3 py-6 justify-center">
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--saffron)' }} />
                <span className="text-sm" style={{ color: 'var(--gray-500)' }}>{t('schemeInfoLoading', lang)}</span>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 self-start" style={{ background: 'var(--saffron-light)' }}>
                    <Sparkles className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
                  </div>
                )}
                <div
                  className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap max-w-[85%]"
                  style={
                    msg.role === 'assistant'
                      ? { background: 'var(--gray-50)', color: 'var(--navy)', border: '1px solid var(--gray-100)' }
                      : { background: 'var(--saffron)', color: 'white' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && messages.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--saffron-light)' }}>
                  <Sparkles className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
                </div>
                <div className="flex gap-1 px-4 py-3 rounded-2xl" style={{ background: 'var(--gray-50)' }}>
                  {[0, 1, 2].map(j => (
                    <motion.div
                      key={j}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--saffron)' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-3 border-t flex-shrink-0" style={{ borderColor: 'var(--gray-100)' }}>
            <div className="flex gap-2 rounded-xl border items-center px-3" style={{ borderColor: 'var(--gray-200)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={t('askFollowup', lang)}
                className="flex-1 py-3 text-sm outline-none bg-transparent"
                style={{ color: 'var(--navy)' }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity"
                style={{
                  background: input.trim() ? 'var(--saffron)' : 'var(--gray-100)',
                  color: input.trim() ? 'white' : 'var(--gray-500)',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
