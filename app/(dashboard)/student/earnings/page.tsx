'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle2, IndianRupee } from 'lucide-react';

type TxFilter = 'all' | 'paid' | 'pending';

const MOCK_EARNINGS = {
  thisMonth: 1350,
  lastMonth: 800,
  total: 2150,
  pending: 500,
  paid: 1650,
  transactions: [
    { id: 'e1', task: 'GST Return Preparation', business: 'Mehta Traders', amount: 350, status: 'paid' as const, date: '2025-01-10', paidOn: '2025-01-12' },
    { id: 'e2', task: 'Scheme Research Report', business: 'Verma Industries', amount: 500, status: 'paid' as const, date: '2025-01-05', paidOn: '2025-01-07' },
    { id: 'e3', task: 'Udyam Registration', business: 'Kapoor Stores', amount: 200, status: 'paid' as const, date: '2024-12-28', paidOn: '2024-12-30' },
    { id: 'e4', task: 'Bahi Khata Digitization', business: 'Sharma Kirana', amount: 300, status: 'pending' as const, date: '2025-01-18', paidOn: null },
    { id: 'e5', task: 'Compliance Checklist', business: 'Patel Textiles', amount: 200, status: 'pending' as const, date: '2025-01-15', paidOn: null },
    { id: 'e6', task: 'GST Help', business: 'Singh Traders', amount: 350, status: 'paid' as const, date: '2024-12-20', paidOn: '2024-12-22' },
    { id: 'e7', task: 'MSME Scheme Report', business: 'Gupta Metals', amount: 250, status: 'paid' as const, date: '2024-12-15', paidOn: '2024-12-17' },
  ],
};

const CHART_DATA = [
  { month: 'Oct', amount: 900 },
  { month: 'Nov', amount: 650 },
  { month: 'Dec', amount: 800 },
  { month: 'Jan', amount: 850 },
];

const MAX_CHART = Math.max(...CHART_DATA.map(d => d.amount));

export default function StudentEarningsPage() {
  const [filter, setFilter] = useState<TxFilter>('all');

  const { thisMonth, lastMonth, total, pending, paid, transactions } = MOCK_EARNINGS;
  const filtered = transactions.filter(t => filter === 'all' || t.status === filter);
  const avg = Math.round(transactions.reduce((s, t) => s + t.amount, 0) / transactions.length);

  const STATS = [
    { label: 'Is Mahine', value: `₹${thisMonth.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'var(--saffron)', bg: 'var(--saffron-light)' },
    { label: 'Pichhle Mahine', value: `₹${lastMonth.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'var(--navy)', bg: 'var(--navy-50)' },
    { label: 'Total Kamaya', value: `₹${total.toLocaleString('en-IN')}`, icon: CheckCircle2, color: '#138808', bg: '#E8F5E9' },
    { label: 'Pending', value: `₹${pending.toLocaleString('en-IN')}`, icon: Clock, color: '#D97706', bg: '#FEF3C7' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Meri Kamaai</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Transactions aur earnings yahan track karo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-4 warm-shadow"
            style={{ background: 'white' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: stat.bg }}>
              <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
            </div>
            <div className="text-xl font-bold font-['Sora']" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="rounded-2xl p-5 warm-shadow mb-6" style={{ background: 'white' }}>
        <h3 className="font-bold font-['Sora'] mb-4" style={{ color: 'var(--navy)' }}>Monthly Earnings</h3>
        <div className="flex items-end gap-4 h-32">
          {CHART_DATA.map((d, i) => {
            const heightPct = (d.amount / MAX_CHART) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--saffron)' }}>₹{(d.amount / 1000).toFixed(1)}K</span>
                <div className="w-full rounded-t-lg overflow-hidden" style={{ height: '96px', display: 'flex', alignItems: 'flex-end', background: 'var(--gray-50)' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ width: '100%', background: i === CHART_DATA.length - 1 ? 'var(--saffron)' : 'var(--navy)', borderRadius: '4px 4px 0 0' }}
                  />
                </div>
                <span className="text-xs" style={{ color: 'var(--gray-500)' }}>{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl warm-shadow overflow-hidden" style={{ background: 'white' }}>
        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: 'var(--gray-100)' }}>
          <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Transactions</h3>
          <div className="flex gap-2">
            {(['all', 'paid', 'pending'] as TxFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-xl text-xs font-medium capitalize"
                style={{
                  background: filter === f ? 'var(--navy)' : 'var(--gray-50)',
                  color: filter === f ? 'white' : 'var(--gray-500)',
                  border: `1px solid ${filter === f ? 'var(--navy)' : 'var(--gray-100)'}`,
                }}
              >
                {f === 'all' ? 'All' : f === 'paid' ? 'Paid' : 'Pending'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: 'var(--gray-50)' }}>
                {['Task', 'Business', 'Amount', 'Date', 'Status', 'Paid On'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: 'var(--gray-500)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => (
                <tr key={tx.id} className="border-b" style={{ borderColor: 'var(--gray-100)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--navy)' }}>{tx.task}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--gray-500)' }}>{tx.business}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#138808' }}>₹{tx.amount}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--gray-500)' }}>{tx.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full font-semibold" style={{
                      background: tx.status === 'paid' ? '#E8F5E9' : '#FEF3C7',
                      color: tx.status === 'paid' ? '#138808' : '#D97706',
                    }}>
                      {tx.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--gray-500)' }}>{tx.paidOn || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--saffron-light)', border: '1px solid var(--saffron)' }}>
        <span className="text-xl">💡</span>
        <p className="text-sm" style={{ color: 'var(--navy)' }}>
          Aapka average task moolya: <strong style={{ color: 'var(--saffron)' }}>₹{avg}/task</strong> — intermediate tasks accept karke is badhao!
        </p>
      </div>
    </div>
  );
}
