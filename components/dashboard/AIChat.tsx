'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, BusinessProfile } from '@/types';

const QUICK_PROMPTS = [
  'GST filing kaise karo?',
  'MUDRA loan kaise milega?',
  'Mera compliance score kyon kam hai?',
  'Expansion ke liye kya karna hoga?',
];

interface AIChatProps {
  businessProfile?: BusinessProfile;
  compact?: boolean;
}

export default function AIChat({ businessProfile, compact = false }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Namaste! Main ArthMitra AI hun — aapka business dost! 🙏\n\nGST, schemes, compliance ya koi bhi business sawaal poochho. Main Hindi, Hinglish ya English — kisi mein bhi jawab dunga!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text?: string) {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          businessProfile,
          language: 'hi',
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Kuch error aaya. Dobara try karo.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Internet check karo aur dobara try karo.' }]);
    } finally {
      setLoading(false);
    }
  }

  const displayMessages = compact ? messages.slice(-3) : messages;

  return (
    <div className="flex flex-col h-full" style={{ minHeight: compact ? 0 : 500 }}>
      {!compact && (
        <div className="flex items-center gap-2 p-4 border-b" style={{ borderColor: 'var(--gray-100)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--saffron)' }}>
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>AI Dost</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs" style={{ color: 'var(--gray-500)' }}>Online</span>
            </div>
          </div>
          <Sparkles className="ml-auto h-4 w-4" style={{ color: 'var(--gold)' }} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: compact ? 200 : 400 }}>
        <AnimatePresence initial={false}>
          {displayMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: msg.role === 'user' ? 'var(--saffron)' : 'var(--navy)' }}
              >
                {msg.role === 'user' ? <User className="h-3.5 w-3.5 text-white" /> : <Bot className="h-3.5 w-3.5 text-white" />}
              </div>
              <div
                className={`max-w-[80%] px-3 py-2.5 text-xs leading-relaxed ${msg.role === 'user' ? 'chat-user' : 'chat-ai'}`}
              >
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--navy)' }}>
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="chat-ai px-3 py-2.5">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--gray-500)' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {!compact && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-saffron"
              style={{ borderColor: 'var(--gray-100)', color: 'var(--gray-500)', background: 'var(--gray-50)' }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--gray-100)' }}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Sawaal poochho..."
          className="flex-1 text-sm rounded-xl border-0 bg-gray-50 focus-visible:ring-1"
          style={{ outline: 'none' }}
        />
        <Button
          onClick={() => sendMessage()}
          size="sm"
          disabled={loading || !input.trim()}
          className="rounded-xl px-3"
          style={{ background: 'var(--saffron)', color: 'white' }}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
