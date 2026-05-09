'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'business' | 'ca' | 'student'>('business');

  useEffect(() => {
    try {
      const savedRole = (localStorage.getItem('arthmitra_role') as 'business' | 'ca' | 'student') || 'business';
      setRole(savedRole);

      if (savedRole === 'business') {
        const saved = localStorage.getItem('arthmitra_business');
        if (saved) {
          const b = JSON.parse(saved);
          setDisplayName(b.business_name || b.owner_name || 'My Business');
        } else {
          setDisplayName('My Business');
        }
      } else if (savedRole === 'ca') {
        const saved = localStorage.getItem('arthmitra_ca_name');
        setDisplayName(saved || 'CA Professional');
      } else if (savedRole === 'student') {
        const saved = localStorage.getItem('arthmitra_student_name');
        setDisplayName(saved || 'Student Associate');
      }
    } catch {}
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--gray-50)' }}>
      <Sidebar role={role} businessName={displayName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
