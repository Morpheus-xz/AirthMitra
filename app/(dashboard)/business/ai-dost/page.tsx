'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Mic, History } from 'lucide-react';
import AIChat from '@/components/dashboard/AIChat';
import { BusinessProfile } from '@/types';

const SUGGESTED_QUESTIONS = [
  'GST kaise file karte hain?',
  'MUDRA loan ke liye kya documents chahiye?',
  'Udyam registration kaise karte hain?',
  'Mera turnover ₹18L hai, kya GST zaroori hai?',
  'PF registration kab mandatory hota hai?',
  'CGTMSE aur MUDRA mein kya fark hai?',
  'Assam mein business expand kaise karein?',
  'Shop establishment license kahan se milega?',
];

export default function AIDostPage() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('arthmitra_business');
    if (saved) setBusiness(JSON.parse(saved));
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--gray-50)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ background: 'white', borderColor: 'var(--gray-100)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--saffron)' }}>
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>AI Dost</h1>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--gray-500)' }}>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Online • India Ka Business Dost
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: 'var(--gold)' }} />
          <span className="text-xs" style={{ color: 'var(--gray-500)' }}>Powered by GPT-4o-mini</span>
        </div>
      </div>

      {/* Context Banner */}
      {business && (
        <div className="px-4 py-2 flex items-center gap-2 text-xs" style={{ background: 'var(--saffron-light)', borderBottom: '1px solid var(--saffron)', color: 'var(--saffron)' }}>
          <Sparkles className="h-3 w-3" />
          AI ko pata hai: <strong>{business.business_name}</strong> ({business.business_type}, {business.state}) — context-aware answers milenge
        </div>
      )}

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4">
        {/* Suggested Questions */}
        <div className="hidden lg:block border-r p-4 overflow-y-auto" style={{ borderColor: 'var(--gray-100)', background: 'white' }}>
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
            <h3 className="font-semibold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>Common Questions</h3>
          </div>
          <div className="space-y-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs leading-relaxed transition-colors"
                style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Sawaal poochho..."]') as HTMLInputElement;
                  if (input) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                    nativeInputValueSetter?.call(input, q);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
              >
                {q}
              </motion.button>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--navy)' }}>💡 Tip</div>
            <p className="text-xs" style={{ color: 'var(--gray-500)' }}>
              Hindi ya Hinglish mein likhoge toh Hindi mein hi jawab milega. English mein likhoge toh English mein.
            </p>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden rounded-none" style={{ background: 'white' }}>
            <AIChat businessProfile={business || undefined} compact={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
