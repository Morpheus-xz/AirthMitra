'use client';

import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const SKILL_BADGES = [
  {
    name: 'GST Assistant', icon: '📊', earned: true,
    description: 'Completed 3+ GST-related tasks', earnedOn: '2025-01-10',
    progress: 3, required: 3,
  },
  {
    name: 'MSME Specialist', icon: '🏭', earned: true,
    description: 'Assisted 2+ MSME registrations', earnedOn: '2024-12-28',
    progress: 2, required: 2,
  },
  {
    name: 'Scheme Hunter', icon: '🔍', earned: false,
    description: 'Complete 3 scheme research tasks', earnedOn: null,
    progress: 1, required: 3,
  },
  {
    name: 'Expansion Expert', icon: '🗺️', earned: false,
    description: 'Assist 1 interstate expansion', earnedOn: null,
    progress: 0, required: 1,
  },
  {
    name: 'Bahi Khata Pro', icon: '📖', earned: false,
    description: 'Digitize 5 ledgers', earnedOn: null,
    progress: 2, required: 5,
  },
  {
    name: 'TDS Master', icon: '💼', earned: false,
    description: 'Complete 2 TDS-related tasks', earnedOn: null,
    progress: 0, required: 2,
  },
];

export default function StudentSkillsPage() {
  const earned = SKILL_BADGES.filter(b => b.earned);
  const inProgress = SKILL_BADGES.filter(b => !b.earned);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>My Skills & Badges</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>
          {earned.length} badges earned • {inProgress.length} in progress
        </p>
      </div>

      {/* Earned Badges */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5" style={{ color: '#D97706' }} />
          <h2 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Earned Badges</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {earned.map((badge, i) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 text-center"
              style={{
                background: 'white',
                border: '2px solid #D97706',
                boxShadow: '0 0 0 4px rgba(217,119,6,0.08)',
              }}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h3 className="font-bold font-['Sora'] text-sm mb-1" style={{ color: '#D97706' }}>{badge.name}</h3>
              <p className="text-xs mb-2" style={{ color: 'var(--gray-500)' }}>{badge.description}</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#FEF3C7', color: '#D97706' }}>
                Earned {badge.earnedOn}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* In Progress Badges */}
      <div>
        <h2 className="font-bold font-['Sora'] mb-4" style={{ color: 'var(--navy)' }}>In Progress</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {inProgress.map((badge, i) => {
            const pct = badge.required > 0 ? (badge.progress / badge.required) * 100 : 0;
            const remaining = badge.required - badge.progress;
            return (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (earned.length + i) * 0.08 }}
                className="rounded-2xl p-5 text-center"
                style={{ background: 'white', border: '2px solid var(--gray-100)' }}
              >
                <div className="text-4xl mb-2 opacity-40">{badge.icon}</div>
                <h3 className="font-bold font-['Sora'] text-sm mb-1" style={{ color: 'var(--gray-500)' }}>{badge.name}</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--gray-500)' }}>{badge.description}</p>
                <div className="h-2 rounded-full mb-1" style={{ background: 'var(--gray-100)' }}>
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: 'var(--saffron)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: (earned.length + i) * 0.08 + 0.2 }}
                  />
                </div>
                <p className="text-xs" style={{ color: 'var(--gray-500)' }}>
                  {badge.progress}/{badge.required} — {remaining} more task{remaining !== 1 ? 's' : ''} needed
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
