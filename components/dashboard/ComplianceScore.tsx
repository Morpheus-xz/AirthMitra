'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ComplianceScoreProps {
  score: number;
  size?: number;
}

export default function ComplianceScore({ score, size = 160 }: ComplianceScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  const color = score >= 75 ? '#138808' : score >= 50 ? '#D97706' : '#DC2626';
  const label = score >= 75 ? 'Accha Hai! 👍' : score >= 50 ? 'Thoda Risk ⚠️' : 'Critical! 🚨';
  const bgColor = score >= 75 ? '#E8F5E9' : score >= 50 ? '#FEF3C7' : '#FEE2E2';

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += 2;
      setDisplayScore(Math.min(start, score));
      if (start >= score) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E8E8E0"
            strokeWidth={12}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold font-['Sora']" style={{ fontSize: size * 0.22, color }}>
            {displayScore}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--gray-500)' }}>/100</span>
        </div>
      </div>
      <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: bgColor, color }}>
        {label}
      </div>
    </div>
  );
}
