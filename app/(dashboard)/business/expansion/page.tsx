'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ArrowRight, CheckCircle2, AlertTriangle, Star, Clock, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BusinessProfile, Expert } from '@/types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Puducherry'
];

const URGENCY_CONFIG = {
  high: { color: '#DC2626', bg: '#FEE2E2', label: 'High Priority' },
  medium: { color: '#D97706', bg: '#FEF3C7', label: 'Medium' },
  low: { color: '#138808', bg: '#E8F5E9', label: 'Low' },
};

interface ExpansionResult {
  compliances: { name: string; description: string; urgency: string }[];
  schemes: { name: string; benefit: string; url: string }[];
  risks: string[];
  timelineWeeks: number;
  aiSummary: string;
  recommendedExperts: Expert[];
  fromState: string;
  toState: string;
}

export default function ExpansionPage() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [toState, setToState] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExpansionResult | null>(null);
  const [bookingExpert, setBookingExpert] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('arthmitra_business');
    if (saved) setBusiness(JSON.parse(saved));
  }, []);

  async function analyzeExpansion() {
    if (!toState) { toast.error('Destination state select karo!'); return; }
    if (!business?.state) { toast.error('Pehle business profile complete karo.'); return; }
    if (toState === business.state) { toast.error('Current state aur destination same hai!'); return; }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/expansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromState: business.state,
          toState,
          businessType: business.business_type,
          businessProfile: business,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error('Analysis fail hua. Dobara try karo.');
    } finally {
      setLoading(false);
    }
  }

  function bookConsultation(expertId: string) {
    setBookingExpert(expertId);
    setTimeout(() => {
      setBookingExpert(null);
      toast.success('Consultation request bhej di! Expert 24 ghante mein contact karega.');
    }, 2000);
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>🗺️ Regional Expansion Assistant</h1>
        <p className="text-sm" style={{ color: 'var(--gray-500)' }}>Naye state mein business expand karne ka complete plan AI banayega</p>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl p-6 warm-shadow mb-6" style={{ background: 'white' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>Current State (From)</label>
            <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'var(--gray-50)', color: 'var(--navy)', border: '1px solid var(--gray-100)' }}>
              📍 {business?.state || 'Set in profile'}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <ArrowRight className="h-6 w-6" style={{ color: 'var(--saffron)' }} />
              <span className="text-xs" style={{ color: 'var(--gray-500)' }}>Expand to</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>Destination State (To)</label>
            <Select onValueChange={(v: string | null) => setToState(v ?? '')}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="State select karo" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.filter(s => s !== business?.state).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <div className="text-sm" style={{ color: 'var(--gray-500)' }}>
            Business: <strong style={{ color: 'var(--navy)' }}>{business?.business_type || 'Not set'}</strong>
          </div>
          <Button
            onClick={analyzeExpansion}
            disabled={loading || !toState}
            className="rounded-xl font-bold font-['Sora']"
            style={{ background: 'var(--saffron)', color: 'white' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 rounded-full border-2 border-t-transparent border-white" />
                AI analyze kar raha hai...
              </span>
            ) : (
              <>🤖 Expansion Analyze Karo</>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* AI Summary */}
            <div className="rounded-2xl p-6 warm-shadow" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--saffron)' }}>
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold mb-1 font-['Sora'] text-white">AI Expansion Summary</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{result.aiSummary}</p>
                  <div className="flex gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Clock className="h-3.5 w-3.5" /> ~{result.timelineWeeks} weeks timeline
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> {result.compliances?.length} compliances
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Map className="h-3.5 w-3.5" /> {result.schemes?.length} local schemes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliances */}
              <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
                <h3 className="font-bold mb-4 font-['Sora'] flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                  <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--saffron)' }} />
                  {result.toState} Compliance Checklist
                </h3>
                <div className="space-y-3">
                  {(result.compliances || []).map((comp, i) => {
                    const cfg = URGENCY_CONFIG[comp.urgency as keyof typeof URGENCY_CONFIG] || URGENCY_CONFIG.medium;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: cfg.bg }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: cfg.color }}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{comp.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>{comp.description}</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: 'white', color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Schemes + Risks */}
              <div className="space-y-4">
                <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
                  <h3 className="font-bold mb-3 font-['Sora']" style={{ color: 'var(--navy)' }}>
                    🏛️ {result.toState} ke Local Schemes
                  </h3>
                  <div className="space-y-3">
                    {(result.schemes || []).map((scheme, i) => (
                      <div key={i} className="p-3 rounded-xl" style={{ background: '#E8F5E9', border: '1px solid #A7D7A8' }}>
                        <div className="font-semibold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{scheme.name}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--gray-500)' }}>{scheme.benefit}</div>
                        {scheme.url && scheme.url !== '#' && (
                          <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold mt-1 block" style={{ color: 'var(--india-green)' }}>
                            Apply → {scheme.url}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
                  <h3 className="font-bold mb-3 font-['Sora'] flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                    <AlertTriangle className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                    Key Risks
                  </h3>
                  <div className="space-y-2">
                    {(result.risks || []).map((risk, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--gray-500)' }}>
                        <span className="text-base">⚠️</span>
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Experts */}
            {result.recommendedExperts?.length > 0 && (
              <div className="rounded-2xl p-6 warm-shadow" style={{ background: 'white' }}>
                <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>
                  👥 {result.toState} ke Expert Recommend
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.recommendedExperts.map((expert, i) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: 'var(--navy)' }}>
                          {expert.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{expert.name}</div>
                          <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{expert.qualification}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-current" style={{ color: 'var(--gold)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>{expert.rating}</span>
                        <span className="text-xs" style={{ color: 'var(--gray-500)' }}>({expert.totalConsultations} consultations)</span>
                      </div>
                      <div className="text-xs mb-3" style={{ color: 'var(--gray-500)' }}>
                        ₹{expert.consultationFee} consultation fee
                      </div>
                      <Button
                        size="sm"
                        className="w-full text-xs rounded-lg"
                        style={{ background: bookingExpert === expert.id ? 'var(--india-green)' : 'var(--saffron)', color: 'white' }}
                        onClick={() => bookConsultation(expert.id)}
                        disabled={bookingExpert === expert.id}
                      >
                        {bookingExpert === expert.id ? '✅ Booking...' : 'Book Consultation'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white', border: '2px dashed var(--gray-200)' }}>
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2 font-['Sora']" style={{ color: 'var(--navy)' }}>Expansion Analysis</h3>
          <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
            Destination state select karo aur "Expansion Analyze Karo" click karo.<br />
            AI compliance checklist, schemes, risks, aur experts recommend karega.
          </p>
        </div>
      )}
    </div>
  );
}
