'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Star, TrendingUp, Award, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const AVAILABLE_TASKS = [
  { id: 1, business: 'Sharma Grocery Store', type: 'Udyam Registration Help', payment: 150, deadline: '2 days', difficulty: 'Easy', description: 'Help owner register on Udyam portal and fill form.' },
  { id: 2, business: 'Kumar Electronics', type: 'GST Return Prep', payment: 300, deadline: '5 days', difficulty: 'Medium', description: 'Prepare GSTR-1 data from invoices provided by client.' },
  { id: 3, business: 'Meena Fashion', type: 'Scheme Discovery', payment: 200, deadline: '7 days', difficulty: 'Easy', description: 'Research and list 5 applicable government schemes with application links.' },
  { id: 4, business: 'Raj Auto Parts', type: 'Compliance Checklist', payment: 250, deadline: '4 days', difficulty: 'Medium', description: 'Create complete compliance checklist for manufacturing MSME in Rajasthan.' },
];

const MY_SKILLS = [
  { name: 'GST Filing', level: 65, color: 'var(--saffron)' },
  { name: 'MSME Schemes', level: 80, color: 'var(--india-green)' },
  { name: 'Udyam Registration', level: 90, color: 'var(--gold)' },
  { name: 'TDS/TCS', level: 40, color: '#7C3AED' },
  { name: 'ITR Filing', level: 55, color: '#1D4ED8' },
];

const BADGES = [
  { name: 'Scheme Expert', emoji: '🏛️', earned: true },
  { name: 'GST Assistant', emoji: '📊', earned: true },
  { name: 'MSME Specialist', emoji: '🏭', earned: false },
  { name: 'TDS Pro', emoji: '💰', earned: false },
];

const DIFF_CONFIG = {
  Easy: { color: 'var(--india-green)', bg: '#E8F5E9' },
  Medium: { color: 'var(--gold)', bg: '#FEF3C7' },
  Hard: { color: 'var(--danger)', bg: '#FEE2E2' },
};

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState('Student');
  const [tasks, setTasks] = useState(AVAILABLE_TASKS);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [totalEarnings] = useState(2450);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arthmitra_student_name');
      if (saved) setStudentName(saved);
    } catch {}
  }, []);

  function acceptTask(taskId: number) {
    setAcceptedIds(prev => [...prev, taskId]);
    toast.success('Task accept kar liya! Client ko notification bhej di. All the best! 🎉');
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--saffron)' }}>
          Namaste, {studentName}! 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Aaj kya seekhein aur kamayein?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'This Month', value: `₹${(totalEarnings / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'var(--india-green)', bg: '#E8F5E9' },
          { label: 'Tasks Done', value: '12', icon: CheckCircle2, color: 'var(--saffron)', bg: 'var(--saffron-light)' },
          { label: 'My Rating', value: '4.6 ⭐', icon: Star, color: 'var(--gold)', bg: '#FFF8E1' },
          { label: 'Badges Earned', value: BADGES.filter(b => b.earned).length, icon: Award, color: 'var(--navy)', bg: 'var(--navy-50)' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Tasks */}
        <div className="lg:col-span-2">
          <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>Available Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task, i) => {
              const diffCfg = DIFF_CONFIG[task.difficulty as keyof typeof DIFF_CONFIG];
              const isAccepted = acceptedIds.includes(task.id);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl p-5 warm-shadow"
                  style={{ background: 'white', opacity: isAccepted ? 0.7 : 1 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-bold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{task.type}</h4>
                      <p className="text-xs" style={{ color: 'var(--gray-500)' }}>{task.business}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold font-['Sora']" style={{ color: 'var(--india-green)' }}>₹{task.payment}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: diffCfg.bg, color: diffCfg.color }}>
                        {task.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--gray-500)' }}>{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--gray-500)' }}>
                      <Clock className="h-3 w-3" /> {task.deadline} deadline
                    </div>
                    <Button
                      size="sm"
                      className="rounded-xl text-xs font-semibold"
                      style={{ background: isAccepted ? 'var(--india-green)' : 'var(--saffron)', color: 'white' }}
                      onClick={() => !isAccepted && acceptTask(task.id)}
                      disabled={isAccepted}
                    >
                      {isAccepted ? '✅ Accepted' : 'Accept Task'}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Skills + Badges */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
            <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>My Skills</h3>
            <div className="space-y-3">
              {MY_SKILLS.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: 'var(--navy)' }}>{skill.name}</span>
                    <span style={{ color: skill.color }}>{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--gray-100)' }}>
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ background: skill.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
            <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-3 rounded-xl"
                  style={{
                    background: badge.earned ? 'var(--gold-light)' : 'var(--gray-50)',
                    border: `1px solid ${badge.earned ? 'var(--gold)' : 'var(--gray-100)'}`,
                    opacity: badge.earned ? 1 : 0.5,
                  }}
                >
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-xs font-semibold" style={{ color: badge.earned ? 'var(--gold)' : 'var(--gray-500)' }}>
                    {badge.name}
                  </div>
                  {!badge.earned && <div className="text-xs" style={{ color: 'var(--gray-500)' }}>Locked</div>}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)' }}>
            <div className="text-white font-bold font-['Sora'] mb-1">🎯 Next Goal</div>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>2 more tasks complete karo MSME Specialist badge unlock karne ke liye!</p>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div className="h-2 rounded-full" style={{ background: 'var(--gold)', width: '60%' }} />
            </div>
            <div className="text-xs mt-1 text-right" style={{ color: 'rgba(255,255,255,0.6)' }}>3/5 tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
