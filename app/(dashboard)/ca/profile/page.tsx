'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Briefcase, MapPin, Phone, Mail, Edit2, Save } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_PROFILE = {
  name: 'CA Priya Sharma',
  designation: 'Chartered Accountant',
  membershipNo: 'ICAI-2018-045821',
  experience: '6 years',
  specializations: ['GST', 'Income Tax', 'MSME Compliance', 'Startup Advisory'],
  states: ['Gujarat', 'Maharashtra', 'Rajasthan'],
  languages: ['Hindi', 'English', 'Gujarati'],
  rating: 4.8,
  totalClients: 47,
  tasksCompleted: 312,
  email: 'priya.sharma@caservices.in',
  phone: '+91 98765 43210',
  city: 'Ahmedabad, Gujarat',
  bio: 'Experienced CA specializing in MSME compliance and GST advisory. Helping small businesses navigate India\'s regulatory landscape since 2018.',
};

export default function CAProfilePage() {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(MOCK_PROFILE.bio);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>My Profile</h1>
        <button
          onClick={() => {
            if (editing) toast.success('Profile updated!');
            setEditing(!editing);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: editing ? '#138808' : 'var(--saffron)', color: 'white' }}
        >
          {editing ? <><Save className="h-4 w-4" /> Save</> : <><Edit2 className="h-4 w-4" /> Edit</>}
        </button>
      </div>

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6 warm-shadow mb-4" style={{ background: 'white' }}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white flex-shrink-0" style={{ background: 'var(--navy)' }}>
            {MOCK_PROFILE.name.split(' ').slice(-1)[0][0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{MOCK_PROFILE.name}</h2>
            <p className="text-sm font-medium" style={{ color: 'var(--saffron)' }}>{MOCK_PROFILE.designation}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>Membership: {MOCK_PROFILE.membershipNo}</p>
            <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--gray-500)' }}>
              <MapPin className="h-3 w-3" /> {MOCK_PROFILE.city}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-xl font-bold font-['Sora']" style={{ color: '#D97706' }}>⭐ {MOCK_PROFILE.rating}</div>
            <p className="text-xs" style={{ color: 'var(--gray-500)' }}>Rating</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Active Clients', value: MOCK_PROFILE.totalClients, color: 'var(--saffron)', bg: 'var(--saffron-light)' },
          { label: 'Tasks Done', value: MOCK_PROFILE.tasksCompleted, color: '#138808', bg: '#E8F5E9' },
          { label: 'Experience', value: MOCK_PROFILE.experience, color: 'var(--navy)', bg: 'var(--navy-50)' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-4 text-center warm-shadow" style={{ background: 'white' }}>
            <div className="text-xl font-bold font-['Sora']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Details */}
      <div className="rounded-2xl p-5 warm-shadow mb-4" style={{ background: 'white' }}>
        <h3 className="font-bold mb-4 font-['Sora']" style={{ color: 'var(--navy)' }}>Contact & Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2" style={{ color: 'var(--gray-500)' }}>
            <Mail className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--saffron)' }} />
            {MOCK_PROFILE.email}
          </div>
          <div className="flex items-center gap-2" style={{ color: 'var(--gray-500)' }}>
            <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--saffron)' }} />
            {MOCK_PROFILE.phone}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>Specializations:</span>
            {MOCK_PROFILE.specializations.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}>{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>States:</span>
            {MOCK_PROFILE.states.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}>{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>Languages:</span>
            {MOCK_PROFILE.languages.map(l => (
              <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#138808' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-2xl p-5 warm-shadow" style={{ background: 'white' }}>
        <h3 className="font-bold mb-3 font-['Sora']" style={{ color: 'var(--navy)' }}>Bio</h3>
        {editing ? (
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #FF6B00',
              borderRadius: '8px', fontSize: '14px', color: '#0D1B2A', outline: 'none', resize: 'vertical',
            }}
          />
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>{bio}</p>
        )}
      </div>
    </div>
  );
}
