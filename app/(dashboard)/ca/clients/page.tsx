'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const MOCK_CLIENTS = [
  {
    id: '1', businessName: 'Sharma Textiles', type: 'Manufacturing', state: 'Gujarat',
    turnover: '₹42L', employees: 12, pendingTasks: 3, lastActivity: '2 days ago',
    complianceScore: 68, gstStatus: 'Registered', contactName: 'Rajesh Sharma',
    email: 'rajesh@sharmatextiles.com', phone: '+91 98765 43210',
  },
  {
    id: '2', businessName: 'Patel Food Works', type: 'Food Processing', state: 'Maharashtra',
    turnover: '₹28L', employees: 8, pendingTasks: 1, lastActivity: 'Today',
    complianceScore: 82, gstStatus: 'Registered', contactName: 'Kiran Patel',
    email: 'kiran@patelfood.com', phone: '+91 87654 32109',
  },
  {
    id: '3', businessName: 'Krishna Electronics', type: 'Retail', state: 'Rajasthan',
    turnover: '₹18L', employees: 4, pendingTasks: 5, lastActivity: '1 week ago',
    complianceScore: 45, gstStatus: 'Not Registered', contactName: 'Mohan Krishna',
    email: 'mohan@krishnaelec.com', phone: '+91 76543 21098',
  },
  {
    id: '4', businessName: 'Devi Handicrafts', type: 'Manufacturing', state: 'Uttar Pradesh',
    turnover: '₹9L', employees: 6, pendingTasks: 2, lastActivity: '3 days ago',
    complianceScore: 91, gstStatus: 'Exempt', contactName: 'Sunita Devi',
    email: 'sunita@devicraft.com', phone: '+91 65432 10987',
  },
];

type FilterTab = 'all' | 'high_risk' | 'pending';

function ComplianceCircle({ score }: { score: number }) {
  const color = score >= 80 ? '#138808' : score >= 60 ? '#D97706' : '#DC2626';
  const bg = score >= 80 ? '#E8F5E9' : score >= 60 ? '#FEF3C7' : '#FEE2E2';
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
      style={{ background: bg, color }}
    >
      {score}
    </div>
  );
}

export default function CAClientsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState<string | null>(null);
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});

  const filtered = MOCK_CLIENTS.filter(c => {
    const matchSearch = !search || c.businessName.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'high_risk' && c.complianceScore < 60) || (filter === 'pending' && c.pendingTasks > 0);
    return matchSearch && matchFilter;
  });

  async function getAISummary(client: typeof MOCK_CLIENTS[0]) {
    if (aiSummaries[client.id]) return;
    setAiSummaryLoading(client.id);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Give a 3-line compliance summary for ${client.businessName} — ${client.type} business in ${client.state}, turnover ${client.turnover}, GST status: ${client.gstStatus}, compliance score: ${client.complianceScore}/100, pending tasks: ${client.pendingTasks}.` }],
          systemPrompt: 'You are a CA assistant. Give a concise 3-line compliance summary. Be specific. Use professional English.',
        }),
      });
      const data = await res.json();
      setAiSummaries(prev => ({ ...prev, [client.id]: data.reply || data.response || 'Summary unavailable.' }));
    } catch {
      setAiSummaries(prev => ({ ...prev, [client.id]: 'Unable to generate summary. Please try again.' }));
    } finally {
      setAiSummaryLoading(null);
    }
  }

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `All (${MOCK_CLIENTS.length})` },
    { key: 'high_risk', label: `High Risk (${MOCK_CLIENTS.filter(c => c.complianceScore < 60).length})` },
    { key: 'pending', label: `Pending Action (${MOCK_CLIENTS.filter(c => c.pendingTasks > 0).length})` },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Mere Clients</h1>
          <span className="px-2.5 py-0.5 rounded-full text-sm font-semibold" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}>
            {MOCK_CLIENTS.length} total
          </span>
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Sabhi clients ka compliance status aur tasks yahan dekhein</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--gray-500)' }} />
          <input
            type="text"
            placeholder="Client ya state search karo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 14px 9px 36px',
              border: '1.5px solid #E8E8E0', borderRadius: '10px',
              fontSize: '14px', color: '#0D1B2A', backgroundColor: '#fff', outline: 'none',
            }}
          />
        </div>
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filter === tab.key ? 'var(--navy)' : 'white',
                color: filter === tab.key ? 'white' : 'var(--gray-500)',
                border: `1.5px solid ${filter === tab.key ? 'var(--navy)' : '#E8E8E0'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl warm-shadow overflow-hidden"
            style={{ background: 'white' }}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <ComplianceCircle score={client.complianceScore} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{client.businessName}</h3>
                      <p className="text-xs" style={{ color: 'var(--gray-500)' }}>{client.contactName} • 📍 {client.state}</p>
                    </div>
                    {client.pendingTasks > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                        {client.pendingTasks} pending
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }}>{client.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}>{client.turnover}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: client.gstStatus === 'Registered' ? '#E8F5E9' : client.gstStatus === 'Exempt' ? '#FEF3C7' : '#FEE2E2',
                      color: client.gstStatus === 'Registered' ? '#138808' : client.gstStatus === 'Exempt' ? '#D97706' : '#DC2626',
                    }}>GST: {client.gstStatus}</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--gray-500)' }}>
                    👥 {client.employees} employees • Last activity: {client.lastActivity}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  style={{ background: 'var(--navy)', color: 'white' }}
                >
                  View Details {expandedId === client.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => toast.success(`Reminder bhej di ${client.contactName} ko!`)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  style={{ background: 'var(--saffron-light)', color: 'var(--saffron)', border: '1px solid var(--saffron)' }}
                >
                  <Send className="h-3 w-3" /> Send Reminder
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === client.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t"
                  style={{ borderColor: 'var(--gray-100)' }}
                >
                  <div className="p-5 space-y-4" style={{ background: 'var(--gray-50)' }}>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span style={{ color: 'var(--gray-500)' }}>Email: </span><span style={{ color: 'var(--navy)' }}>{client.email}</span></div>
                      <div><span style={{ color: 'var(--gray-500)' }}>Phone: </span><span style={{ color: 'var(--navy)' }}>{client.phone}</span></div>
                      <div><span style={{ color: 'var(--gray-500)' }}>Compliance Score: </span><span className="font-bold" style={{ color: client.complianceScore >= 80 ? '#138808' : client.complianceScore >= 60 ? '#D97706' : '#DC2626' }}>{client.complianceScore}/100</span></div>
                      <div><span style={{ color: 'var(--gray-500)' }}>Pending Tasks: </span><span className="font-bold" style={{ color: client.pendingTasks > 0 ? '#DC2626' : '#138808' }}>{client.pendingTasks}</span></div>
                    </div>

                    <div className="rounded-xl p-3" style={{ background: 'white', border: '1px solid var(--gray-100)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold" style={{ color: 'var(--navy)' }}>AI Compliance Summary</span>
                        {!aiSummaries[client.id] && (
                          <button
                            onClick={() => getAISummary(client)}
                            disabled={aiSummaryLoading === client.id}
                            className="text-xs px-3 py-1 rounded-lg font-semibold"
                            style={{ background: 'var(--saffron)', color: 'white' }}
                          >
                            {aiSummaryLoading === client.id ? 'Generating...' : '🤖 Generate'}
                          </button>
                        )}
                      </div>
                      {aiSummaries[client.id] ? (
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--gray-500)' }}>{aiSummaries[client.id]}</p>
                      ) : (
                        <p className="text-xs" style={{ color: 'var(--gray-500)' }}>Click "Generate" to get AI compliance summary for this client.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--gray-500)' }}>
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Koi client nahi mila</p>
          <p className="text-sm">Filter ya search change karo</p>
        </div>
      )}
    </div>
  );
}
