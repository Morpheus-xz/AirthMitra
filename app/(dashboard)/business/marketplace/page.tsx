'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, Search, MapPin, MessageSquare, Clock, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { MOCK_EXPERTS } from '@/lib/experts-data';
import { Expert } from '@/types';

const TYPE_CONFIG = {
  ca: { label: 'CA', color: '#1D4ED8', bg: '#DBEAFE', emoji: '📊' },
  lawyer: { label: 'Lawyer', color: '#7C3AED', bg: '#EDE9FE', emoji: '⚖️' },
  student: { label: 'Student', color: '#059669', bg: '#D1FAE5', emoji: '📚' },
};

const CONSULTATION_TYPES = ['GST Help', 'TDS Filing', 'Scheme Application', 'Expansion Planning', 'FSSAI License', 'Company Registration', 'Other'];

interface BookingModal {
  expert: Expert;
}

export default function MarketplacePage() {
  const [experts, setExperts] = useState<Expert[]>(MOCK_EXPERTS);
  const [filterType, setFilterType] = useState('all');
  const [filterState, setFilterState] = useState('');
  const [maxRate, setMaxRate] = useState([2000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModal, setBookingModal] = useState<BookingModal | null>(null);
  const [consultationType, setConsultationType] = useState('');
  const [consultationNote, setConsultationNote] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const allStates = [...new Set(MOCK_EXPERTS.flatMap(e => e.states))].sort();

  const filtered = experts.filter(e => {
    const typeMatch = filterType === 'all' || e.type === filterType;
    const stateMatch = !filterState || e.states.includes(filterState);
    const rateMatch = e.consultationFee <= maxRate[0];
    const searchMatch = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && stateMatch && rateMatch && searchMatch && e.available;
  });

  function handleBook() {
    if (!consultationType) { toast.error('Consultation type select karo!'); return; }
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setBookingModal(null);
      setConsultationType('');
      setConsultationNote('');
      toast.success(`✅ Consultation booked with ${bookingModal?.expert.name}! Confirmation email bhej diya.`);
    }, 2000);
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>👥 Expert Network</h1>
        <p className="text-sm" style={{ color: 'var(--gray-500)' }}>CA, lawyers, aur CA students — affordable consultation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-4 warm-shadow sticky top-4" style={{ background: 'white' }}>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
              <h3 className="font-bold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>Filters</h3>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--gray-500)' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Expert dhundo..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border"
                style={{ borderColor: 'var(--gray-100)', outline: 'none' }}
              />
            </div>

            {/* Type filter */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--gray-500)' }}>EXPERT TYPE</div>
              <div className="space-y-1">
                {['all', 'ca', 'lawyer', 'student'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize"
                    style={{
                      background: filterType === type ? 'var(--saffron-light)' : 'transparent',
                      color: filterType === type ? 'var(--saffron)' : 'var(--gray-500)',
                    }}
                  >
                    {type === 'all' ? '🔍 All Experts' : type === 'ca' ? '📊 CA / Chartered Accountant' : type === 'lawyer' ? '⚖️ Lawyer' : '📚 CA Student'}
                  </button>
                ))}
              </div>
            </div>

            {/* State filter */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--gray-500)' }}>STATE EXPERTISE</div>
              <select
                value={filterState}
                onChange={e => setFilterState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border"
                style={{ borderColor: 'var(--gray-100)', outline: 'none', color: 'var(--navy)' }}
              >
                <option value="">Sab states</option>
                {allStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Price filter */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2 flex justify-between" style={{ color: 'var(--gray-500)' }}>
                <span>MAX CONSULTATION FEE</span>
                <span style={{ color: 'var(--saffron)' }}>₹{maxRate[0]}</span>
              </div>
              <Slider
                value={maxRate}
                onValueChange={(v) => setMaxRate(Array.isArray(v) ? v : [v])}
                min={100}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--gray-500)' }}>
                <span>₹100</span><span>₹2000</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs rounded-xl"
              onClick={() => { setFilterType('all'); setFilterState(''); setMaxRate([2000]); setSearchQuery(''); }}
              style={{ borderColor: 'var(--gray-100)', color: 'var(--gray-500)' }}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Expert Cards */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
              <strong style={{ color: 'var(--navy)' }}>{filtered.length}</strong> experts available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((expert, i) => {
              const typeCfg = TYPE_CONFIG[expert.type as keyof typeof TYPE_CONFIG];
              return (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl p-5 warm-shadow warm-shadow-hover transition-all duration-200"
                  style={{ background: 'white' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0" style={{ background: 'var(--navy)' }}>
                      {expert.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{expert.name}</h3>
                        {expert.available && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ background: '#E8F5E9', color: 'var(--india-green)' }}>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Available
                          </span>
                        )}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>{expert.qualification}</div>
                      {typeCfg && (
                        <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: typeCfg.bg, color: typeCfg.color }}>
                          {typeCfg.emoji} {typeCfg.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5" style={{ fill: j < Math.floor(expert.rating) ? 'var(--gold)' : 'transparent', color: 'var(--gold)' }} />
                    ))}
                    <span className="text-xs font-semibold ml-1" style={{ color: 'var(--navy)' }}>{expert.rating}</span>
                    <span className="text-xs" style={{ color: 'var(--gray-500)' }}>({expert.totalConsultations} consults)</span>
                  </div>

                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--gray-500)' }}>{expert.bio}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {expert.states.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5" style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}>
                        <MapPin className="h-2.5 w-2.5" /> {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {expert.languages.map(lang => (
                      <span key={lang} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}>
                        🗣️ {lang}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--gray-100)' }}>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--gray-500)' }}>Consultation fee</div>
                      <div className="font-bold" style={{ color: 'var(--saffron)' }}>₹{expert.consultationFee}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs rounded-xl"
                        style={{ borderColor: 'var(--gray-100)', color: 'var(--gray-500)' }}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs rounded-xl font-semibold"
                        style={{ background: 'var(--saffron)', color: 'white' }}
                        onClick={() => setBookingModal({ expert })}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 rounded-2xl" style={{ background: 'white' }}>
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-semibold" style={{ color: 'var(--navy)' }}>Koi expert nahi mila</p>
              <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Filters reset karo</p>
              <Button className="mt-4" variant="outline" onClick={() => { setFilterType('all'); setFilterState(''); setMaxRate([2000]); }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={e => e.target === e.currentTarget && setBookingModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: 'white' }}
            >
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--gray-100)' }}>
                <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Consultation Book Karo</h3>
                <button onClick={() => setBookingModal(null)} style={{ color: 'var(--gray-500)' }}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: 'var(--gray-50)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: 'var(--navy)' }}>
                    {bookingModal.expert.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{bookingModal.expert.name}</div>
                    <div className="text-xs" style={{ color: 'var(--gray-500)' }}>Fee: ₹{bookingModal.expert.consultationFee}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>Consultation Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CONSULTATION_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setConsultationType(type)}
                        className="px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all text-left"
                        style={{
                          borderColor: consultationType === type ? 'var(--saffron)' : 'var(--gray-100)',
                          background: consultationType === type ? 'var(--saffron-light)' : 'white',
                          color: consultationType === type ? 'var(--saffron)' : 'var(--gray-500)',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>Message (Optional)</label>
                  <textarea
                    value={consultationNote}
                    onChange={e => setConsultationNote(e.target.value)}
                    placeholder="Apni problem ya sawaal briefly likho..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border resize-none"
                    style={{ borderColor: 'var(--gray-100)', outline: 'none' }}
                  />
                </div>

                <div className="p-3 rounded-xl mb-4 flex items-center justify-between" style={{ background: 'var(--gray-50)' }}>
                  <span className="text-sm" style={{ color: 'var(--gray-500)' }}>Total Amount</span>
                  <span className="font-bold font-['Sora']" style={{ color: 'var(--saffron)' }}>₹{bookingModal.expert.consultationFee}</span>
                </div>

                <Button
                  onClick={handleBook}
                  disabled={bookingLoading}
                  className="w-full py-3 rounded-xl font-bold font-['Sora']"
                  style={{ background: 'var(--saffron)', color: 'white' }}
                >
                  {bookingLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 rounded-full border-2 border-t-transparent border-white" />
                      Payment processing...
                    </span>
                  ) : (
                    `Pay ₹${bookingModal.expert.consultationFee} & Book`
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
