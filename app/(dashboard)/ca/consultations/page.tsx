'use client';

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_REQUESTS = [
  {
    id: 'c1', businessName: 'Agarwal Exports', state: 'Gujarat', type: 'GST Advisory',
    message: 'GST registration mandatory hai kya agar export only karte hain?',
    requestedAt: '2025-01-18', status: 'pending',
  },
  {
    id: 'c2', businessName: 'Sharma Dairy', state: 'Haryana', type: 'FSSAI License',
    message: 'Dairy products ke liye FSSAI license kaise apply karein?',
    requestedAt: '2025-01-17', status: 'pending',
  },
  {
    id: 'c3', businessName: 'TechStart Pvt Ltd', state: 'Karnataka', type: 'Startup Compliance',
    message: 'DPIIT Startup registration ke baad kya compliance required hai?',
    requestedAt: '2025-01-15', status: 'accepted',
  },
];

export default function CAConsultationsPage() {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Consultation Requests</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Business owners ke incoming consultation requests</p>
      </div>
      <div className="space-y-4">
        {MOCK_REQUESTS.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5 warm-shadow"
            style={{ background: 'white' }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{req.businessName}</h3>
                <p className="text-xs" style={{ color: 'var(--gray-500)' }}>📍 {req.state} • {req.type} • {req.requestedAt}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{
                background: req.status === 'accepted' ? '#E8F5E9' : '#FEF3C7',
                color: req.status === 'accepted' ? '#138808' : '#D97706',
              }}>
                {req.status === 'accepted' ? 'Accepted' : 'Pending'}
              </span>
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--gray-500)', background: 'var(--gray-50)', padding: '10px 12px', borderRadius: '8px' }}>
              "{req.message}"
            </p>
            {req.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => toast.success('Consultation accept kar li!')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: 'var(--saffron)', color: 'white' }}
                >
                  Accept
                </button>
                <button
                  onClick={() => toast.info('Request decline kar di.')}
                  className="px-4 py-2 rounded-xl text-xs font-medium"
                  style={{ background: 'var(--gray-50)', color: 'var(--gray-500)', border: '1px solid var(--gray-100)' }}
                >
                  Decline
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
