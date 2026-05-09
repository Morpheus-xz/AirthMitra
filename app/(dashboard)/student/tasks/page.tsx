'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

type TaskStatus = 'available' | 'accepted' | 'submitted' | 'completed';
type TabKey = 'available' | 'active' | 'completed';

interface Task {
  id: string;
  title: string;
  businessName: string;
  businessState: string;
  taskType: string;
  difficulty: 'beginner' | 'intermediate';
  payment: number;
  deadline: string;
  description: string;
  skills: string[];
  estimatedHours: number;
  status: TaskStatus;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 'st1', title: 'GST Return Preparation', businessName: 'Mehta Traders',
    businessState: 'Gujarat', taskType: 'GST', difficulty: 'beginner',
    payment: 350, deadline: '2025-01-22', description: 'Prepare GSTR-3B draft for December 2024. All invoices provided. CA will review and file.',
    skills: ['GST', 'Data Entry'], estimatedHours: 3, status: 'available',
  },
  {
    id: 'st2', title: 'Udyam Registration Assistance', businessName: 'Rani Garments',
    businessState: 'Rajasthan', taskType: 'Registration', difficulty: 'beginner',
    payment: 200, deadline: '2025-01-25', description: 'Help business owner fill Udyam registration form. All documents ready.',
    skills: ['MSME', 'Registration'], estimatedHours: 2, status: 'available',
  },
  {
    id: 'st3', title: 'Scheme Discovery Report', businessName: 'Gupta Engineering',
    businessState: 'Maharashtra', taskType: 'Research', difficulty: 'intermediate',
    payment: 500, deadline: '2025-01-28', description: 'Research and compile list of applicable government schemes for a manufacturing unit with ₹45L turnover.',
    skills: ['Research', 'MSME Schemes'], estimatedHours: 4, status: 'available',
  },
  {
    id: 'st4', title: 'Bahi Khata Digitization', businessName: 'Sharma Kirana',
    businessState: 'Uttar Pradesh', taskType: 'Data Entry', difficulty: 'beginner',
    payment: 300, deadline: '2025-01-30', description: 'Digitize 2 months of handwritten ledger entries into Excel format provided.',
    skills: ['Data Entry', 'Accounting'], estimatedHours: 5, status: 'accepted',
  },
];

const DIFF_STYLE = {
  beginner: { bg: '#E8F5E9', color: '#138808' },
  intermediate: { bg: '#FEF3C7', color: '#D97706' },
};

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  GST: { bg: '#EDE9FE', color: '#7C3AED' },
  Registration: { bg: '#DBEAFE', color: '#1D4ED8' },
  Research: { bg: '#FEF3C7', color: '#D97706' },
  'Data Entry': { bg: 'var(--saffron-light)', color: 'var(--saffron)' },
};

export default function StudentTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [tab, setTab] = useState<TabKey>('available');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const available = tasks.filter(t => t.status === 'available');
  const active = tasks.filter(t => t.status === 'accepted');
  const completed = tasks.filter(t => t.status === 'completed' || t.status === 'submitted');

  function acceptTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'accepted' } : t));
    setConfirmId(null);
    toast.success('Task accept ho gaya! CA ko notification bhej di. All the best! 🎉');
    setTab('active');
  }

  function submitTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'submitted' } : t));
    toast.success('Task submit ho gayi! CA review kar lega. ✅');
    setTab('completed');
  }

  const displayTasks = tab === 'available' ? available : tab === 'active' ? active : completed;

  const TABS = [
    { key: 'available' as TabKey, label: `Available (${available.length})` },
    { key: 'active' as TabKey, label: `My Active (${active.length})` },
    { key: 'completed' as TabKey, label: `Completed (${completed.length})` },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>My Tasks</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Tasks accept karo, kaam karo, aur paisa kamao</p>
      </div>

      <div className="flex gap-2 mb-5">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: tab === t.key ? 'var(--navy)' : 'white',
              color: tab === t.key ? 'white' : 'var(--gray-500)',
              border: `1.5px solid ${tab === t.key ? 'var(--navy)' : '#E8E8E0'}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayTasks.map((task, i) => {
          const diffStyle = DIFF_STYLE[task.difficulty];
          const typeStyle = TYPE_STYLE[task.taskType] || { bg: 'var(--gray-50)', color: 'var(--gray-500)' };
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl warm-shadow overflow-hidden"
              style={{ background: 'white' }}
            >
              <div className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{task.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: typeStyle.bg, color: typeStyle.color }}>{task.taskType}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ background: diffStyle.bg, color: diffStyle.color }}>{task.difficulty}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--gray-500)' }}>
                      {task.businessName} • 📍 {task.businessState}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-lg font-bold font-['Sora']" style={{ color: '#138808' }}>₹{task.payment}</div>
                    <div className="text-xs flex items-center gap-1 justify-end" style={{ color: 'var(--gray-500)' }}>
                      <Clock className="h-3 w-3" /> ~{task.estimatedHours}h
                    </div>
                  </div>
                </div>

                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--gray-500)' }}>{task.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {task.skills.map(skill => (
                    <span key={skill} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--gray-500)' }}>Deadline: {task.deadline}</span>
                  {task.status === 'available' && (
                    <button
                      onClick={() => setConfirmId(task.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: 'var(--saffron)', color: 'white' }}
                    >
                      Accept Task
                    </button>
                  )}
                  {task.status === 'accepted' && (
                    <button
                      onClick={() => submitTask(task.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: '#138808', color: 'white' }}
                    >
                      Mark as Submitted
                    </button>
                  )}
                  {(task.status === 'submitted' || task.status === 'completed') && (
                    <span className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1" style={{ background: '#E8F5E9', color: '#138808' }}>
                      <CheckCircle2 className="h-3 w-3" /> Submitted
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {confirmId === task.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t px-5 py-4 flex items-center gap-3"
                    style={{ background: 'var(--saffron-light)', borderColor: 'var(--saffron)' }}
                  >
                    <p className="text-sm flex-1" style={{ color: 'var(--navy)' }}>
                      "{task.title}" accept karna chahte hain? ₹{task.payment} milenge completion par.
                    </p>
                    <button
                      onClick={() => acceptTask(task.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                      style={{ background: 'var(--saffron)', color: 'white' }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: 'white', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}
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

      {displayTasks.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--gray-500)' }}>
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Is tab mein koi task nahi</p>
        </div>
      )}
    </div>
  );
}
