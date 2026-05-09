'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, Clock, Star, TrendingUp, Briefcase, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const MOCK_CLIENTS = [
  { id: 1, name: 'Ramesh Textiles', type: 'Manufacturing', state: 'Gujarat', pendingTasks: 3, lastActivity: '2 hours ago', status: 'active', turnover: '₹35L' },
  { id: 2, name: 'Priti Kirana Store', type: 'Retail', state: 'Bihar', pendingTasks: 1, lastActivity: 'Yesterday', status: 'active', turnover: '₹8L' },
  { id: 3, name: 'Tech Solutions Ltd', type: 'Service', state: 'Karnataka', pendingTasks: 2, lastActivity: '3 days ago', status: 'review', turnover: '₹1.2Cr' },
  { id: 4, name: 'Star Foods Pvt Ltd', type: 'Food', state: 'Maharashtra', pendingTasks: 0, lastActivity: '1 week ago', status: 'completed', turnover: '₹55L' },
];

const MOCK_TASKS = [
  { id: 1, client: 'Ramesh Textiles', type: 'GST Filing', priority: 'high', due: '20 Nov', amount: 2500, status: 'pending' },
  { id: 2, client: 'Tech Solutions', type: 'TDS Return', priority: 'high', due: '31 Jan', amount: 3500, status: 'pending' },
  { id: 3, client: 'Priti Kirana', type: 'ITR Filing', priority: 'medium', due: '31 Jul', amount: 1800, status: 'ai_ready' },
  { id: 4, client: 'Star Foods', type: 'FSSAI Renewal', priority: 'low', due: '15 Dec', amount: 2000, status: 'completed' },
];

const PRIORITY_CONFIG = {
  high: { color: '#DC2626', bg: '#FEE2E2', label: 'High' },
  medium: { color: '#D97706', bg: '#FEF3C7', label: 'Medium' },
  low: { color: '#138808', bg: '#E8F5E9', label: 'Low' },
};

export default function CADashboard() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  function acceptTask(taskId: number) {
    setAcceptingId(taskId);
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'in_progress' } : t));
      setAcceptingId(null);
      toast.success('Task accepted! Client ko notification bhej di.');
    }, 1500);
  }

  const thisMonthEarnings = tasks.filter(t => t.status === 'completed' || t.status === 'in_progress').reduce((s, t) => s + t.amount, 0);
  const pendingReviews = tasks.filter(t => t.status === 'ai_ready').length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-sm" style={{ color: 'var(--gray-500)' }}>Namaste! 🙏</p>
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>CA / Expert Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--gray-500)' }}>Clients manage karo, AI se help lo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Clients', value: MOCK_CLIENTS.filter(c => c.status === 'active').length, icon: Users, color: 'var(--saffron)', bg: 'var(--saffron-light)' },
          { label: 'Pending Reviews', value: pendingReviews, icon: AlertCircle, color: 'var(--gold)', bg: '#FFF8E1' },
          { label: 'This Month', value: `₹${(thisMonthEarnings / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'var(--india-green)', bg: '#E8F5E9' },
          { label: 'My Rating', value: '4.8 ⭐', icon: Star, color: 'var(--navy)', bg: 'var(--navy-50)' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-4 warm-shadow"
            style={{ background: 'white' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: stat.bg }}>
              <stat.icon className="h-4.5 w-4.5" style={{ color: stat.color }} />
            </div>
            <div className="text-2xl font-bold font-['Sora']" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client List */}
        <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
          <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>My Clients</h3>
          <div className="space-y-3">
            {MOCK_CLIENTS.map((client, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: 'var(--navy)' }}>
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate font-['Sora']" style={{ color: 'var(--navy)' }}>{client.name}</div>
                  <div className="text-xs flex items-center gap-2" style={{ color: 'var(--gray-500)' }}>
                    <span>{client.type}</span>
                    <span>•</span>
                    <span>📍 {client.state}</span>
                    <span>•</span>
                    <span>{client.turnover}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {client.pendingTasks > 0 ? (
                    <Badge className="text-xs" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)', border: 'none' }}>
                      {client.pendingTasks} tasks
                    </Badge>
                  ) : (
                    <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--india-green)' }} />
                  )}
                  <div className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>{client.lastActivity}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <Button className="w-full mt-3 rounded-xl text-sm" variant="outline" style={{ borderColor: 'var(--gray-100)', color: 'var(--gray-500)' }}>
            + Add New Client
          </Button>
        </div>

        {/* Task Queue */}
        <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Task Queue</h3>
            {pendingReviews > 0 && (
              <Badge className="text-xs" style={{ background: '#FFF8E1', color: 'var(--gold)', border: 'none' }}>
                {pendingReviews} AI-ready
              </Badge>
            )}
          </div>
          <div className="space-y-3">
            {tasks.map((task, i) => {
              const priorityCfg = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-xl"
                  style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-semibold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{task.type}</div>
                      <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{task.client}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: priorityCfg.bg, color: priorityCfg.color }}>
                      {priorityCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--gray-500)' }}>
                      <span><Clock className="h-3 w-3 inline mr-0.5" /> Due {task.due}</span>
                      <span className="font-semibold" style={{ color: 'var(--india-green)' }}>₹{task.amount}</span>
                    </div>
                    {task.status === 'pending' && (
                      <Button
                        size="sm"
                        className="text-xs rounded-lg"
                        style={{ background: 'var(--saffron)', color: 'white' }}
                        disabled={acceptingId === task.id}
                        onClick={() => acceptTask(task.id)}
                      >
                        {acceptingId === task.id ? 'Accepting...' : 'Accept'}
                      </Button>
                    )}
                    {task.status === 'ai_ready' && (
                      <Button size="sm" className="text-xs rounded-lg" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                        Review & Approve
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Badge className="text-xs" style={{ background: '#DBEAFE', color: '#1D4ED8', border: 'none' }}>In Progress</Badge>
                    )}
                    {task.status === 'completed' && (
                      <Badge className="text-xs" style={{ background: '#E8F5E9', color: 'var(--india-green)', border: 'none' }}>✅ Done</Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Assistant Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-2xl p-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--saffron)' }}>
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-white font-['Sora'] mb-0.5">AI Research Assistant</div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Complex tax queries, latest CBDT circulars, scheme eligibility research — AI se poocho. Client ko better advice do.
          </p>
        </div>
        <Button className="flex-shrink-0 rounded-xl text-sm font-semibold" style={{ background: 'var(--saffron)', color: 'white' }}>
          Open AI Chat
        </Button>
      </motion.div>
    </div>
  );
}
