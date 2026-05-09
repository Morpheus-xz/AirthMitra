'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Shield, Award, BookOpen, Map, Users,
  MessageSquare, ChevronLeft, ChevronRight, LogOut,
  Building2, GraduationCap, Briefcase, Settings, FileText
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface NavItem {
  icon: React.ElementType;
  labelKey: string;
  labelEN?: string;
  labelHI?: string;
  href: string;
  badge?: string;
  badgeColor?: string;
}

const BUSINESS_NAV: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'dashboard', href: '/business' },
  { icon: Shield, labelKey: 'compliance', href: '/business/compliance', badge: '3', badgeColor: '#FF6B00' },
  { icon: Award, labelKey: 'schemes', href: '/business/schemes', badge: '7', badgeColor: '#138808' },
  { icon: BookOpen, labelKey: 'bahiKhata', href: '/business/bahi-khata' },
  { icon: Map, labelKey: 'expansion', href: '/business/expansion' },
  { icon: Users, labelKey: 'experts', href: '/business/marketplace' },
  { icon: MessageSquare, labelKey: 'aiDost', href: '/business/ai-dost' },
];

const CA_NAV: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'dashboard', href: '/ca' },
  { icon: Users, labelKey: 'clients', href: '/ca/clients' },
  { icon: Briefcase, labelKey: 'tasks', href: '/ca/tasks' },
  { icon: FileText, labelKey: 'bookConsultation', labelEN: 'Consultations', labelHI: 'परामर्श', href: '/ca/consultations' },
  { icon: MessageSquare, labelKey: 'aiDost', href: '/ca/ai-assistant' },
  { icon: Shield, labelKey: 'profile', href: '/ca/profile' },
];

const STUDENT_NAV: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'dashboard', href: '/student' },
  { icon: Briefcase, labelKey: 'tasks', href: '/student/tasks' },
  { icon: Award, labelKey: 'earnings', href: '/student/earnings' },
  { icon: GraduationCap, labelKey: 'profile', labelEN: 'My Skills', labelHI: 'मेरे कौशल', href: '/student/skills' },
  { icon: Users, labelKey: 'profile', href: '/student/profile' },
];

interface SidebarProps {
  role?: 'business' | 'ca' | 'student';
  businessName?: string;
}

export default function Sidebar({ role = 'business', businessName = 'My Business' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();

  const navItems = role === 'business' ? BUSINESS_NAV : role === 'ca' ? CA_NAV : STUDENT_NAV;
  const roleLabel = role === 'business'
    ? (lang === 'hi' ? 'व्यापार मालिक' : 'Business Owner')
    : role === 'ca'
      ? (lang === 'hi' ? 'CA / विशेषज्ञ' : 'CA / Expert')
      : (lang === 'hi' ? 'छात्र सहयोगी' : 'Student Associate');
  const roleIcon = role === 'business' ? Building2 : role === 'ca' ? Briefcase : GraduationCap;
  const RoleIcon = roleIcon;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-screen sticky top-0 overflow-hidden z-30"
      style={{ background: 'var(--navy)', minWidth: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', minHeight: 64 }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--saffron)' }}>
                <span className="text-white font-bold text-sm">अ</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm font-['Sora']">ArthMitra</div>
                <div className="text-xs font-semibold" style={{ color: 'var(--saffron)' }}>AI</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto" style={{ background: 'var(--saffron)' }}>
            <span className="text-white font-bold text-sm">अ</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Business info */}
      <div className="px-3 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255, 107, 0, 0.2)' }}>
            <RoleIcon className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="text-white text-xs font-semibold font-['Sora'] truncate" style={{ maxWidth: 140 }}>{businessName}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{roleLabel}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/ca' && item.href !== '/student' && item.href !== '/business' && pathname.startsWith(item.href + '/'));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                style={{
                  background: isActive ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--saffron)' : '2px solid transparent',
                }}
              >
                <div className="relative flex-shrink-0">
                  <Icon
                    className="h-5 w-5 transition-colors"
                    style={{ color: isActive ? 'var(--saffron)' : 'rgba(255,255,255,0.5)' }}
                  />
                  {item.badge && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ background: item.badgeColor || 'var(--saffron)', fontSize: '0.6rem' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium transition-colors"
                      style={{ color: isActive ? 'var(--saffron)' : 'rgba(255,255,255,0.7)' }}
                    >
                      {lang === 'hi' && item.labelHI ? item.labelHI : lang === 'en' && item.labelEN ? item.labelEN : t(item.labelKey as Parameters<typeof t>[0], lang)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: language + settings + logout */}
      <div className="p-2 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* Language Toggle */}
        <div className="flex items-center px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 w-full justify-center"
              >
                <button
                  onClick={() => setLang('en')}
                  className="flex-1 py-1 rounded-md text-xs font-bold transition-all"
                  style={{
                    background: lang === 'en' ? 'var(--saffron)' : 'transparent',
                    color: lang === 'en' ? 'white' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  EN
                </button>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>|</span>
                <button
                  onClick={() => setLang('hi')}
                  className="flex-1 py-1 rounded-md text-xs font-bold transition-all"
                  style={{
                    background: lang === 'hi' ? 'var(--saffron)' : 'transparent',
                    color: lang === 'hi' ? 'white' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  हिं
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="w-full text-center text-xs font-bold py-1"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
          )}
        </div>

        <Link href="/onboarding">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Settings className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs">
                  {t('settings', lang)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
        <Link href="/">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-red-500/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs">
                  {t('signOut', lang)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
