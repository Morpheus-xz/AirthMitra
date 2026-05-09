'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ComplianceScore from '@/components/dashboard/ComplianceScore';
import { BusinessProfile, ComplianceRule } from '@/types';

const STATUS_CONFIG = {
  filed: { label: '✅ Filed', bg: '#E8F5E9', color: '#138808', icon: CheckCircle2 },
  pending: { label: '⏳ Pending', bg: '#FEF3C7', color: '#D97706', icon: Clock },
  overdue: { label: '❌ Overdue', bg: '#FEE2E2', color: '#DC2626', icon: XCircle },
  na: { label: '⬛ N/A', bg: '#F3F4F6', color: '#6B7280', icon: XCircle },
};

export default function CompliancePage() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [complianceData, setComplianceData] = useState<{
    score: number;
    applicable: ComplianceRule[];
    pending: ComplianceRule[];
    aiExplanation: string;
    upcomingDeadlines: { rule: string; deadline: string; status: string; penalty: string }[];
  } | null>(null);
  const [filedIds, setFiledIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [askingAI, setAskingAI] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('arthmitra_business');
    const savedFiled = localStorage.getItem('arthmitra_filed') || '[]';
    const filed = JSON.parse(savedFiled);
    setFiledIds(filed);
    if (saved) {
      const b = JSON.parse(saved);
      setBusiness(b);
      loadCompliance(b, filed);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadCompliance(b: BusinessProfile, filed: string[]) {
    try {
      const res = await fetch('/api/ai/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: b, filedIds: filed }),
      });
      const data = await res.json();
      setComplianceData(data);
    } catch {
      setComplianceData({
        score: 72,
        applicable: [],
        pending: [],
        aiExplanation: 'Aapka compliance score 72 hai. GST filing aur Income Tax pe dhyan do.',
        upcomingDeadlines: [],
      });
    } finally {
      setLoading(false);
    }
  }

  function markAsFiled(ruleId: string) {
    const newFiled = [...filedIds, ruleId];
    setFiledIds(newFiled);
    localStorage.setItem('arthmitra_filed', JSON.stringify(newFiled));
    toast.success('Compliance filed mark kar diya! Score update hoga.');
    if (business) loadCompliance(business, newFiled);
  }

  async function askAI() {
    if (!aiQuestion.trim()) return;
    setAskingAI(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: aiQuestion }],
          businessProfile: business,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.response);
    } catch {
      setAiAnswer('Network error. Dobara try karo.');
    } finally {
      setAskingAI(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-lg" style={{ color: 'var(--gray-500)' }}>Loading compliance data...</div></div>;
  }

  const allRules: (ComplianceRule & { status: string })[] = (complianceData?.applicable || []).map(rule => ({
    ...rule,
    status: filedIds.includes(rule.id) ? 'filed' : 'pending',
  }));

  const filteredRules = activeTab === 'all' ? allRules :
    activeTab === 'pending' ? allRules.filter(r => r.status === 'pending') :
    activeTab === 'filed' ? allRules.filter(r => r.status === 'filed') : allRules;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Compliance Center</h1>
        <p className="text-sm" style={{ color: 'var(--gray-500)' }}>Aapke business ke sare compliance obligations</p>
      </div>

      {/* Score + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1 rounded-2xl p-6 warm-shadow flex flex-col items-center" style={{ background: 'white' }}>
          <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>Compliance Health Score</h3>
          <ComplianceScore score={complianceData?.score ?? 72} size={180} />
          {complianceData?.aiExplanation && (
            <div className="mt-4 rounded-xl p-3 w-full" style={{ background: 'var(--saffron-50)' }}>
              <p className="text-xs leading-relaxed text-center" style={{ color: 'var(--navy)' }}>
                🤖 {complianceData.aiExplanation}
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-2 rounded-2xl p-6 warm-shadow" style={{ background: 'white' }}>
          <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>Compliance Summary</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Total Applicable', value: allRules.length, color: 'var(--navy)', bg: 'var(--gray-50)' },
              { label: 'Filed ✅', value: allRules.filter(r => r.status === 'filed').length, color: 'var(--india-green)', bg: '#E8F5E9' },
              { label: 'Pending ⏳', value: allRules.filter(r => r.status === 'pending').length, color: 'var(--saffron)', bg: 'var(--saffron-light)' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ background: s.bg }}>
                <div className="text-2xl font-bold font-['Sora']" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--navy)' }}>Upcoming Deadlines</h4>
          <div className="space-y-2">
            {(complianceData?.upcomingDeadlines || []).slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{
                  background: d.status === 'filed' ? 'var(--india-green)' : 'var(--saffron)',
                }} />
                <div className="flex-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--navy)' }}>{d.rule}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--gray-500)' }}>{d.deadline}</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--danger)' }}>{d.penalty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'filed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? 'var(--saffron)' : 'white',
                color: activeTab === tab ? 'white' : 'var(--gray-500)',
                border: `1px solid ${activeTab === tab ? 'var(--saffron)' : 'var(--gray-100)'}`,
              }}
            >
              {tab === 'all' ? `All (${allRules.length})` : tab === 'pending' ? `Pending (${allRules.filter(r => r.status === 'pending').length})` : `Filed (${allRules.filter(r => r.status === 'filed').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredRules.length === 0 ? (
          <div className="col-span-2 text-center py-12 rounded-2xl" style={{ background: 'white' }}>
            <div className="text-5xl mb-3">✅</div>
            <p className="font-semibold" style={{ color: 'var(--navy)' }}>Sab filed hai!</p>
          </div>
        ) : filteredRules.map((rule, i) => {
          const statusCfg = STATUS_CONFIG[rule.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
          const isExpanded = expandedId === rule.id;

          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden warm-shadow"
              style={{ background: 'white', border: '1px solid var(--gray-100)' }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{rule.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>{rule.description}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                    {statusCfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-lg p-2" style={{ background: 'var(--gray-50)' }}>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--gray-500)' }}>Deadline</div>
                    <div className="text-xs font-medium" style={{ color: 'var(--navy)' }}>{rule.deadlines[0]}</div>
                  </div>
                  <div className="rounded-lg p-2" style={{ background: '#FEE2E2' }}>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--danger)' }}>Penalty</div>
                    <div className="text-xs font-medium" style={{ color: 'var(--danger)' }}>{rule.penalty}</div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3">
                        <div className="text-xs mb-1 font-semibold" style={{ color: 'var(--gray-500)' }}>Filing Frequency</div>
                        <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}>
                          {rule.filingFrequency}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2">
                  {rule.status !== 'filed' && (
                    <Button
                      size="sm"
                      className="flex-1 text-xs rounded-xl font-semibold"
                      style={{ background: 'var(--india-green)', color: 'white' }}
                      onClick={() => markAsFiled(rule.id)}
                    >
                      Mark as Filed ✅
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs rounded-xl"
                    style={{ borderColor: 'var(--gray-100)' }}
                    onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                  >
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Advisor */}
      <div className="rounded-2xl p-6 warm-shadow" style={{ background: 'white' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--saffron)' }}>
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>AI Compliance Advisor</h3>
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--gray-500)' }}>Koi bhi compliance sawaal poochho — AI simple language mein jawab dega</p>
        <div className="flex gap-2">
          <input
            value={aiQuestion}
            onChange={e => setAiQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askAI()}
            placeholder="e.g., GSTR-3B vs GSTR-1 mein kya fark hai?"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm border"
            style={{ borderColor: 'var(--gray-100)', outline: 'none' }}
          />
          <Button onClick={askAI} disabled={askingAI} style={{ background: 'var(--saffron)', color: 'white' }} className="rounded-xl">
            {askingAI ? '...' : 'Poochho'}
          </Button>
        </div>
        {aiAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 rounded-xl"
            style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}
          >
            <div className="flex items-start gap-2">
              <span>🤖</span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)' }}>{aiAnswer}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
