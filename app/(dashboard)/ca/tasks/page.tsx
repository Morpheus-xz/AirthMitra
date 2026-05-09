'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

type TaskStatus = 'pending' | 'overdue' | 'in_review' | 'completed';
type Priority = 'high' | 'medium' | 'low';
type FilterTab = 'all' | 'high' | 'overdue' | 'pending' | 'completed';
type SortKey = 'due' | 'priority' | 'client';

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const MOCK_TASKS = [
  {
    id: 't1', clientName: 'Sharma Textiles', taskType: 'GST Filing Review',
    priority: 'high' as Priority, dueDate: '2025-01-20', status: 'pending' as TaskStatus,
    description: 'Review and approve GSTR-3B for December 2024. AI has pre-filled based on uploaded invoices.',
    aiSummary: 'Total outward supplies: ₹4.2L. Input tax credit: ₹38,000. Net payable: ₹37,600. No anomalies detected.',
    estimatedTime: '30 mins',
  },
  {
    id: 't2', clientName: 'Patel Food Works', taskType: 'FSSAI Renewal',
    priority: 'medium' as Priority, dueDate: '2025-02-15', status: 'pending' as TaskStatus,
    description: 'FSSAI license renewal due. Documents collected by student associate Amit Verma.',
    aiSummary: 'All documents ready. Only Form B submission pending on FSSAI portal.',
    estimatedTime: '20 mins',
  },
  {
    id: 't3', clientName: 'Krishna Electronics', taskType: 'TDS Return Q3',
    priority: 'high' as Priority, dueDate: '2025-01-31', status: 'overdue' as TaskStatus,
    description: 'TDS return for Q3 FY2024-25 overdue. Penalty accruing at ₹200/day.',
    aiSummary: 'Deductee details: 3 vendors. Total TDS: ₹18,400. Form 26Q ready to file.',
    estimatedTime: '45 mins',
  },
  {
    id: 't4', clientName: 'Devi Handicrafts', taskType: 'ODOP Scheme Application',
    priority: 'low' as Priority, dueDate: '2025-03-01', status: 'in_review' as TaskStatus,
    description: 'Student has prepared ODOP application. CA verification needed.',
    aiSummary: 'Business eligible for UP ODOP scheme (Chikankari category). Application 90% complete.',
    estimatedTime: '15 mins',
  },
];

const STRIPE_COLORS: Record<string, string> = {
  overdue: '#DC2626',
  high: '#FF6B00',
  medium: '#D97706',
  low: '#6B7280',
};

const STATUS_COLORS: Record<TaskStatus, { bg: string; color: string; label: string }> = {
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
  overdue: { bg: '#FEE2E2', color: '#DC2626', label: 'Overdue' },
  in_review: { bg: '#DBEAFE', color: '#1D4ED8', label: 'In Review' },
  completed: { bg: '#E8F5E9', color: '#138808', label: 'Completed' },
};

export default function CATasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<SortKey>('due');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;
  const reviewCount = tasks.filter(t => t.status === 'in_review').length;

  const filtered = tasks
    .filter(t => {
      if (filter === 'all') return true;
      if (filter === 'high') return t.priority === 'high';
      if (filter === 'overdue') return t.status === 'overdue';
      if (filter === 'pending') return t.status === 'pending';
      if (filter === 'completed') return t.status === 'completed';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'due') return a.dueDate.localeCompare(b.dueDate);
      if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === 'client') return a.clientName.localeCompare(b.clientName);
      return 0;
    });

  function completeTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' as TaskStatus } : t));
    setConfirmId(null);
    toast.success('Task mark as complete ho gayi! ✅');
  }

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High Priority' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Task Queue</h1>
        <div className="flex gap-4 mt-2 text-sm">
          <span style={{ color: '#D97706' }}>Pending: <strong>{pendingCount}</strong></span>
          <span style={{ color: '#DC2626' }}>Overdue: <strong>{overdueCount}</strong></span>
          <span style={{ color: '#1D4ED8' }}>In Review: <strong>{reviewCount}</strong></span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
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
        <div className="flex items-center gap-2 ml-auto text-xs">
          <span style={{ color: 'var(--gray-500)' }}>Sort:</span>
          {(['due', 'priority', 'client'] as SortKey[]).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="px-2.5 py-1 rounded-lg capitalize"
              style={{
                background: sortBy === s ? 'var(--saffron-light)' : 'var(--gray-50)',
                color: sortBy === s ? 'var(--saffron)' : 'var(--gray-500)',
                fontWeight: sortBy === s ? '600' : '400',
              }}
            >
              {s === 'due' ? 'Due Date' : s === 'priority' ? 'Priority' : 'Client'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task, i) => {
          const stripeColor = task.status === 'overdue' ? STRIPE_COLORS.overdue : STRIPE_COLORS[task.priority];
          const statusCfg = STATUS_COLORS[task.status];
          const isOverdue = task.status === 'overdue';
          const isExpanded = expandedId === task.id;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl warm-shadow overflow-hidden"
              style={{ background: 'white' }}
            >
              <div className="flex">
                <div className="w-1 flex-shrink-0" style={{ background: stripeColor }} />
                <div className="flex-1 p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{task.taskType}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                          {statusCfg.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{
                          background: task.priority === 'high' ? '#FEE2E2' : task.priority === 'medium' ? '#FEF3C7' : '#E8F5E9',
                          color: task.priority === 'high' ? '#DC2626' : task.priority === 'medium' ? '#D97706' : '#138808',
                        }}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--gray-500)' }}>{task.clientName}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-xs font-semibold flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}
                        style={{ color: isOverdue ? '#DC2626' : 'var(--gray-500)' }}>
                        <Clock className="h-3 w-3" />
                        {isOverdue ? 'OVERDUE' : 'Due'}: {task.dueDate}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--gray-500)' }}>~{task.estimatedTime}</span>
                    </div>
                  </div>

                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--gray-500)' }}>{task.description}</p>

                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : task.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ background: 'var(--gray-50)', color: 'var(--navy)', border: '1px solid var(--gray-100)' }}
                    >
                      🤖 AI Summary {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    {task.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => setConfirmId(task.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                          style={{ background: 'var(--saffron)', color: 'white' }}
                        >
                          Review & Approve
                        </button>
                        <button
                          onClick={() => toast.success('More info request bhej di client ko!')}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}
                        >
                          Request Info
                        </button>
                        <button
                          onClick={() => setConfirmId(task.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{ background: '#E8F5E9', color: '#138808' }}
                        >
                          Mark Complete
                        </button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <span className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1" style={{ background: '#E8F5E9', color: '#138808' }}>
                        <CheckCircle2 className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t"
                    style={{ borderColor: 'var(--gray-100)' }}
                  >
                    <div className="ml-1 px-4 py-3" style={{ background: 'var(--saffron-light)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--saffron)' }}>AI Summary</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--navy)' }}>{task.aiSummary}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm Modal */}
              <AnimatePresence>
                {confirmId === task.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t p-4 flex items-center gap-3"
                    style={{ background: '#E8F5E9', borderColor: '#138808' }}
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#138808' }} />
                    <p className="text-sm flex-1" style={{ color: '#138808' }}>"{task.taskType}" mark as complete karein?</p>
                    <button
                      onClick={() => completeTask(task.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                      style={{ background: '#138808', color: 'white' }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: 'white', color: '#138808' }}
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--gray-500)' }}>
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Is filter mein koi task nahi</p>
        </div>
      )}
    </div>
  );
}
