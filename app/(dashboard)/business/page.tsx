'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Award, Clock, Zap, TrendingUp, BookOpen, Map, Users,
  MessageSquare, Bell, ChevronRight, AlertCircle, CheckCircle2,
  Smartphone, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ComplianceScore from '@/components/dashboard/ComplianceScore';
import SchemeCard from '@/components/dashboard/SchemeCard';
import AIChat from '@/components/dashboard/AIChat';
import { BusinessProfile, ComplianceRule, GovernmentScheme } from '@/types';

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const QUICK_ACTIONS = [
  { label: 'Upload Bahi Khata', icon: BookOpen, href: '/business/bahi-khata', color: 'var(--gold)' },
  { label: 'Find Expert', icon: Users, href: '/business/marketplace', color: 'var(--india-green)' },
  { label: 'Check Expansion', icon: Map, href: '/business/expansion', color: '#7C3AED' },
  { label: 'AI Dost Chat', icon: MessageSquare, href: '/business/ai-dost', color: 'var(--saffron)' },
];

export default function BusinessDashboard() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [complianceData, setComplianceData] = useState<{
    score: number;
    pending: ComplianceRule[];
    applicable: ComplianceRule[];
    upcomingDeadlines: { rule: string; deadline: string; status: string; penalty: string }[];
    aiExplanation: string;
  } | null>(null);
  const [schemes, setSchemes] = useState<(GovernmentScheme & { aiExplanation?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arthmitra_business');
      if (saved) {
        const b = JSON.parse(saved) as BusinessProfile;
        setBusiness(b);
        loadData(b);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  async function loadData(b: BusinessProfile) {
    try {
      const [compRes, schRes] = await Promise.all([
        fetch('/api/ai/compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business: b, filedIds: b.gst_registered ? ['gst_registration'] : [] }),
        }),
        fetch('/api/ai/schemes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business: b }),
        }),
      ]);

      const [comp, sch] = await Promise.all([compRes.json(), schRes.json()]);
      setComplianceData(comp);
      setSchemes(sch.matched?.slice(0, 3) || []);
    } catch {
      // Use defaults
      setComplianceData({
        score: 72,
        pending: [],
        applicable: [],
        upcomingDeadlines: [
          { rule: 'GSTR-3B Filing', deadline: '20th November', status: 'pending', penalty: '₹50/day' },
          { rule: 'TDS Quarterly Return', deadline: '31st January', status: 'pending', penalty: '1.5%/month' },
          { rule: 'Income Tax Return', deadline: '31st July', status: 'filed', penalty: '₹5,000' },
        ],
        aiExplanation: 'Aapka compliance score 72 hai — thoda improvement chahiye. GST aur TDS pe dhyan do.',
      });
    } finally {
      setLoading(false);
    }
  }

  const score = complianceData?.score ?? 72;
  const pendingCount = complianceData?.pending?.length ?? 3;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-t-transparent"
          style={{ borderColor: 'var(--saffron)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-6xl">🏪</div>
        <h2 className="text-xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Business Profile Setup Nahi Hai</h2>
        <Link href="/onboarding">
          <Button style={{ background: 'var(--saffron)', color: 'white' }}>Setup Karo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-sm" style={{ color: 'var(--gray-500)' }}>Namaste! 🙏</p>
          <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{business.business_name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge className="text-xs capitalize" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)', border: 'none' }}>
              {business.business_type}
            </Badge>
            <Badge className="text-xs" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)', border: 'none' }}>
              📍 {business.state}
            </Badge>
            {business.gst_registered && (
              <Badge className="text-xs" style={{ background: '#E8F5E9', color: 'var(--india-green)', border: 'none' }}>
                ✅ GST Registered
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => setShowWhatsapp(!showWhatsapp)}
            style={{ borderColor: 'var(--gray-100)' }}
          >
            <Bell className="h-3.5 w-3.5 mr-1" />
            Reminders
          </Button>
          <Link href="/onboarding">
            <Button variant="outline" size="sm" className="rounded-xl text-xs" style={{ borderColor: 'var(--gray-100)' }}>
              Edit Profile
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Compliance Score',
            value: `${score}/100`,
            icon: Shield,
            color: score >= 75 ? 'var(--india-green)' : score >= 50 ? 'var(--warning)' : 'var(--danger)',
            bg: score >= 75 ? '#E8F5E9' : score >= 50 ? '#FEF3C7' : '#FEE2E2',
            desc: score >= 75 ? 'Good Health' : score >= 50 ? 'Needs Attention' : 'Critical',
          },
          {
            label: 'Active Deadlines',
            value: complianceData?.upcomingDeadlines?.filter(d => d.status === 'pending').length ?? 3,
            icon: Clock,
            color: 'var(--saffron)',
            bg: 'var(--saffron-light)',
            desc: 'This month',
          },
          {
            label: 'Eligible Schemes',
            value: schemes.length || 5,
            icon: Award,
            color: 'var(--india-green)',
            bg: '#E8F5E9',
            desc: 'Apply now',
          },
          {
            label: 'Pending Actions',
            value: pendingCount,
            icon: Zap,
            color: 'var(--danger)',
            bg: '#FEE2E2',
            desc: 'Urgent',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={CARD_VARIANTS}
            className="rounded-2xl p-4 warm-shadow"
            style={{ background: 'white' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: stat.bg, color: stat.color }}>
                {stat.desc}
              </span>
            </div>
            <div className="text-2xl font-bold font-['Sora']" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Compliance Score + Timeline */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={CARD_VARIANTS}
          className="lg:col-span-1 rounded-2xl p-6 warm-shadow"
          style={{ background: 'white' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Compliance Health</h3>
            <Link href="/business/compliance">
              <Button variant="ghost" size="sm" className="text-xs rounded-xl" style={{ color: 'var(--saffron)' }}>
                Details <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center mb-4">
            <ComplianceScore score={score} />
          </div>

          {complianceData?.aiExplanation && (
            <div className="rounded-xl p-3 mt-3" style={{ background: 'var(--saffron-50)' }}>
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">🤖</span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--navy)' }}>
                  {complianceData.aiExplanation}
                </p>
              </div>
            </div>
          )}

          {/* Mini timeline */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold" style={{ color: 'var(--gray-500)' }}>UPCOMING DEADLINES</h4>
            {(complianceData?.upcomingDeadlines || []).slice(0, 3).map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: d.status === 'filed' ? 'var(--india-green)' : 'var(--saffron)',
                }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: 'var(--navy)' }}>{d.rule}</div>
                  <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{d.deadline}</div>
                </div>
                <Badge className="text-xs flex-shrink-0" style={{
                  background: d.status === 'filed' ? '#E8F5E9' : 'var(--saffron-light)',
                  color: d.status === 'filed' ? 'var(--india-green)' : 'var(--saffron)',
                  border: 'none',
                }}>
                  {d.status === 'filed' ? '✅' : '⏳'}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Schemes */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={CARD_VARIANTS}
          className="lg:col-span-1 rounded-2xl p-6 warm-shadow"
          style={{ background: 'white' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>Top Eligible Schemes</h3>
            <Link href="/business/schemes">
              <Button variant="ghost" size="sm" className="text-xs rounded-xl" style={{ color: 'var(--saffron)' }}>
                All Schemes <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {schemes.length > 0 ? schemes.slice(0, 3).map((scheme, i) => (
              <SchemeCard key={i} scheme={scheme} compact />
            )) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🏛️</div>
                <p className="text-sm" style={{ color: 'var(--gray-500)' }}>Schemes load ho rahe hain...</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Chat Widget */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={CARD_VARIANTS}
          className="lg:col-span-1 rounded-2xl overflow-hidden warm-shadow"
          style={{ background: 'white' }}
        >
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--gray-100)' }}>
            <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>AI Dost</h3>
            <Link href="/business/ai-dost">
              <Button variant="ghost" size="sm" className="text-xs rounded-xl" style={{ color: 'var(--saffron)' }}>
                Full Chat <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <AIChat businessProfile={business} compact />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div custom={7} initial="hidden" animate="visible" variants={CARD_VARIANTS} className="mb-6">
        <h3 className="font-bold mb-3 font-['Sora']" style={{ color: 'var(--navy)' }}>Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <Link key={i} href={action.href}>
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl p-4 warm-shadow text-center cursor-pointer"
                style={{ background: 'white' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${action.color}18` }}>
                  <action.icon className="h-5 w-5" style={{ color: action.color }} />
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--navy)' }}>{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* WhatsApp Mockup */}
      {showWhatsapp && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl overflow-hidden"
          style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        >
          <div className="p-3 flex items-center gap-2" style={{ background: '#075E54' }}>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: '#075E54' }}>अ</span>
            </div>
            <div>
              <div className="text-white text-xs font-bold">ArthMitra AI Bot</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Business Dost</div>
            </div>
            <button onClick={() => setShowWhatsapp(false)} className="ml-auto text-white text-lg leading-none">×</button>
          </div>
          <div className="p-3 space-y-2" style={{ background: '#ECE5DD' }}>
            {[
              '🔴 GST filing kal due hai (20 Nov). File karo abhi!',
              '💡 Aap MUDRA Loan ke eligible hain! ₹5L tak mil sakta hai.',
              '✅ Aapka compliance score 72 hai. 28 points improve karne ke tips:',
            ].map((msg, i) => (
              <div key={i} className="rounded-lg p-2.5 text-xs leading-relaxed" style={{ background: 'white', borderRadius: '0 8px 8px 8px' }}>
                {msg}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--gray-100)' }}>
            <span className="text-xs" style={{ color: 'var(--gray-500)' }}>WhatsApp Reminders</span>
            <button
              onClick={() => {
                setWhatsappEnabled(!whatsappEnabled);
                toast.success(whatsappEnabled ? 'Reminders band kar diye!' : '✅ WhatsApp reminders shuru ho gaye!');
              }}
              className="w-10 h-5 rounded-full transition-all relative"
              style={{ background: whatsappEnabled ? '#075E54' : 'var(--gray-200)' }}
            >
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: whatsappEnabled ? '22px' : '2px' }} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
