'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GovernmentScheme } from '@/types';
import SchemeInfoModal from './SchemeInfoModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  loan: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Loan' },
  subsidy: { bg: '#D1FAE5', text: '#065F46', label: 'Subsidy' },
  registration: { bg: '#FEF3C7', text: '#92400E', label: 'Registration' },
  incentive: { bg: '#EDE9FE', text: '#5B21B6', label: 'Incentive' },
  training: { bg: '#FCE7F3', text: '#9D174D', label: 'Training' },
};

interface SchemeCardProps {
  scheme: GovernmentScheme & { aiExplanation?: string; priority?: string };
  compact?: boolean;
}

export default function SchemeCard({ scheme, compact = false }: SchemeCardProps) {
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const cat = CATEGORY_COLORS[scheme.category] || CATEGORY_COLORS.incentive;

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl overflow-hidden warm-shadow transition-all duration-200"
        style={{ background: 'white', border: '1px solid var(--gray-100)' }}
      >
        {/* Left color stripe */}
        <div className="flex">
          <div className="w-1 flex-shrink-0" style={{ background: cat.text }} />
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: cat.bg, color: cat.text }}>
                    {cat.label}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--gray-500)' }}>{scheme.ministry}</span>
                </div>
                <h3 className="font-bold font-['Sora'] text-sm leading-tight" style={{ color: 'var(--navy)' }}>
                  {scheme.name}
                </h3>
              </div>
              {/* Info icon */}
              <button
                onClick={() => setInfoOpen(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
                style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}
                title="Learn more about this scheme"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl px-3 py-2 mb-3" style={{ background: '#E8F5E9' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--india-green)' }}>
                💰 {scheme.benefit}
              </p>
            </div>

            {scheme.aiExplanation && !compact && (
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles className="h-3 w-3" style={{ color: 'var(--saffron)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--saffron)' }}>AI Analysis</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--gray-500)' }}>
                  {scheme.aiExplanation}
                </p>
              </div>
            )}

            {expanded && !compact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-3"
              >
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--gray-500)' }}>
                  {scheme.fullDescription}
                </p>
                <div className="mb-2">
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--navy)' }}>Documents Required:</div>
                  <div className="flex flex-wrap gap-1">
                    {scheme.documentsRequired.map((doc, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}>
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              <a href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" className="w-full text-xs font-semibold rounded-lg" style={{ background: 'var(--saffron)', color: 'white' }}>
                  {t('applyNow', lang)} <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </a>
              {!compact && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs rounded-lg"
                  style={{ borderColor: 'var(--gray-100)', color: 'var(--gray-500)' }}
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <SchemeInfoModal scheme={scheme} open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
