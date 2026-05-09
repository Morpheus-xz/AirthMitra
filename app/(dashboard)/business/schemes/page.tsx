'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SchemeCard from '@/components/dashboard/SchemeCard';
import { BusinessProfile, GovernmentScheme } from '@/types';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

export default function SchemesPage() {
  const { lang } = useLanguage();
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [matchedSchemes, setMatchedSchemes] = useState<(GovernmentScheme & { aiExplanation?: string; priority?: string })[]>([]);
  const [almostEligible, setAlmostEligible] = useState<(GovernmentScheme & { gapReason?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('arthmitra_business');
    if (saved) {
      const b = JSON.parse(saved);
      setBusiness(b);
      loadSchemes(b);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadSchemes(b: BusinessProfile) {
    try {
      const res = await fetch('/api/ai/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: b }),
      });
      const data = await res.json();
      setMatchedSchemes(data.matched || []);
      setAlmostEligible(data.almostEligible || []);
    } catch {
      toast.error(t('schemesLoadError', lang));
    } finally {
      setLoading(false);
    }
  }

  const categories = ['all', 'loan', 'subsidy', 'registration', 'incentive'];

  const filtered = matchedSchemes.filter(s => {
    const categoryMatch = activeCategory === 'all' || s.category === activeCategory;
    const searchMatch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-10 h-10 rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--india-green)', borderTopColor: 'transparent' }} />
        <p style={{ color: 'var(--gray-500)' }}>{t('loadingSchemes', lang)}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{t('schemesPageTitle', lang)}</h1>
          <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
            <span className="font-bold" style={{ color: 'var(--india-green)' }}>{matchedSchemes.length} </span>
            {t('schemesPageSubtitle', lang).replace('{count}', '')}
          </p>
        </div>
        <Badge className="text-sm px-3 py-1" style={{ background: '#E8F5E9', color: 'var(--india-green)', border: 'none' }}>
          🏛️ {matchedSchemes.length} eligible
        </Badge>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--gray-500)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchSchemes', lang)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border"
            style={{ borderColor: 'var(--gray-100)', outline: 'none' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={{
                background: activeCategory === cat ? 'var(--saffron)' : 'white',
                color: activeCategory === cat ? 'white' : 'var(--gray-500)',
                border: `1px solid ${activeCategory === cat ? 'var(--saffron)' : 'var(--gray-100)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Schemes */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'white' }}>
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-semibold" style={{ color: 'var(--navy)' }}>{t('noSchemesFound', lang)}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>{t('changeFilters', lang)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filtered.map((scheme, i) => (
            <motion.div key={scheme.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SchemeCard scheme={scheme} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Almost Eligible */}
      {almostEligible.length > 0 && (
        <div className="rounded-2xl p-6 warm-shadow" style={{ background: 'white' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5" style={{ color: 'var(--gold)' }} />
            <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{t('almostEligibleTitle', lang)}</h3>
            <Badge className="text-xs" style={{ background: 'var(--gold-light)', color: 'var(--gold)', border: 'none' }}>{t('almostEligibleBadge', lang)}</Badge>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--gray-500)' }}>{t('almostEligibleSubtitle', lang)}</p>
          <div className="space-y-3">
            {almostEligible.map((scheme, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FEF3C7' }}>
                  <Award className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <div className="font-semibold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{scheme.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>{scheme.shortDescription}</div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: 'var(--gold)' }}>
                    ⚡ Gap: {scheme.gapReason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
