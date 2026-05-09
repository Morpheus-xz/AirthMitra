'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, BarChart3, FileText, ArrowRight, ArrowLeft, Check, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

const INDUSTRIES: Record<string, string[]> = {
  manufacturing: ['Textiles', 'Food Processing', 'Auto Parts', 'Chemicals', 'Electronics', 'Metals & Steel', 'Plastics', 'Paper', 'Other'],
  service: ['IT Services', 'Healthcare', 'Education', 'Consulting', 'Finance', 'Transport', 'Hospitality', 'Other'],
  trading: ['Wholesale', 'Import/Export', 'Distribution', 'Other'],
  retail: ['Kirana/Grocery', 'Pharmacy', 'Electronics', 'Clothing', 'Hardware', 'Other'],
  food: ['Restaurant', 'Catering', 'Bakery', 'Food Processing', 'Dairy', 'Other'],
  other: ['Agriculture', 'Construction', 'Mining', 'Other'],
};

const TURNOVER_OPTIONS = [
  { label: 'Less than ₹5 Lakh', value: 400000 },
  { label: '₹5 Lakh – ₹20 Lakh', value: 1200000 },
  { label: '₹20 Lakh – ₹1 Crore', value: 6000000 },
  { label: '₹1 Crore – ₹10 Crore', value: 50000000 },
  { label: 'More than ₹10 Crore', value: 200000000 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const [role, setRole] = useState<'business' | 'ca' | 'student' | null>(null);
  const [personName, setPersonName] = useState('');
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    business_name: '',
    owner_name: '',
    state: '',
    district: '',
    business_type: '',
    industry: '',
    annual_turnover: 6000000,
    employee_count: 10,
    gst_registered: false,
    gst_number: '',
    udyam_number: '',
    pan: '',
    ownership_type: 'proprietorship',
    is_startup: false,
    language: 'en',
  });

  const STEPS = [
    { icon: Building2, titleKey: 'step0Title', subKey: 'step0Sub' },
    { icon: BarChart3, titleKey: 'step1Title', subKey: 'step1Sub' },
    { icon: FileText, titleKey: 'step2Title', subKey: 'step2Sub' },
    { icon: Check, titleKey: 'step3Title', subKey: 'step3Sub' },
  ];

  function update(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function saveAndRedirect() {
    try {
      localStorage.setItem('arthmitra_business', JSON.stringify(form));
      localStorage.setItem('arthmitra_role', role || 'business');
      toast.success('Profile saved! Dashboard is ready.');

      const redirectMap = { business: '/business', ca: '/ca', student: '/student' };
      setTimeout(() => router.push(redirectMap[role || 'business']), 800);
    } catch {
      toast.error(t('saveFailed', lang));
    }
  }

  const dropdownStyle = {
    width: '100%',
    padding: '10px 14px',
    paddingRight: '36px',
    backgroundColor: '#FFFFFF',
    color: '#0D1B2A',
    border: '1.5px solid #E8E8E0',
    borderRadius: '8px',
    fontSize: '14px',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 12px center',
    cursor: 'pointer',
    outline: 'none',
  };

  // Role Selection
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gray-50)' }}>
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center">
                <span className="text-white font-bold">अ</span>
              </div>
              <span className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>ArthMitra AI</span>
              {/* Language toggle */}
              <div className="flex items-center rounded-lg overflow-hidden border ml-4" style={{ borderColor: 'var(--gray-200)' }}>
                <button onClick={() => setLang('en')} className="px-3 py-1 text-xs font-bold transition-all" style={{ background: lang === 'en' ? 'var(--saffron)' : 'white', color: lang === 'en' ? 'white' : 'var(--gray-500)' }}>EN</button>
                <button onClick={() => setLang('hi')} className="px-3 py-1 text-xs font-bold transition-all" style={{ background: lang === 'hi' ? 'var(--saffron)' : 'white', color: lang === 'hi' ? 'white' : 'var(--gray-500)' }}>हिं</button>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 font-['Sora']" style={{ color: 'var(--navy)' }}>{t('whoAreYou', lang)}</h1>
            <p style={{ color: 'var(--gray-500)' }}>{t('selectRole', lang)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { role: 'business' as const, icon: Building2, emoji: '🏪', titleKey: 'bizOwnerTitle', subKey: 'bizOwnerSub', descKey: 'bizOwnerDesc', color: 'var(--saffron)', bg: 'var(--saffron-light)' },
              { role: 'ca' as const, icon: Briefcase, emoji: '👔', titleKey: 'caTitle', subKey: 'caSub', descKey: 'caDesc', color: 'var(--india-green)', bg: '#E8F5E9' },
              { role: 'student' as const, icon: GraduationCap, emoji: '🎓', titleKey: 'studentTitle', subKey: 'studentSub', descKey: 'studentDesc', color: 'var(--navy)', bg: 'var(--navy-50)' },
            ].map(({ role: r, emoji, titleKey, subKey, descKey, color, bg, icon: Icon }) => (
              <motion.button
                key={r}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setRole(r)}
                className="text-left rounded-2xl p-6 warm-shadow transition-all duration-200 border-2"
                style={{ background: 'white', borderColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="font-bold text-lg mb-0.5 font-['Sora']" style={{ color: 'var(--navy)' }}>{t(titleKey as Parameters<typeof t>[0], lang)}</h3>
                <p className="text-xs mb-2 font-medium" style={{ color }}>{t(subKey as Parameters<typeof t>[0], lang)}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>{t(descKey as Parameters<typeof t>[0], lang)}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color }}>
                  {t('selectBtn', lang)} <ArrowRight className="h-4 w-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CA or Student quick setup
  if (role !== 'business') {
    const nameLabel = role === 'ca'
      ? (lang === 'hi' ? 'आपका नाम (CA / वकील) *' : 'Your Name (CA / Lawyer) *')
      : (lang === 'hi' ? 'आपका नाम (छात्र) *' : 'Your Name (Student) *');
    const namePH = role === 'ca'
      ? (lang === 'hi' ? 'जैसे, CA प्रिया शर्मा' : 'e.g., CA Priya Sharma')
      : (lang === 'hi' ? 'जैसे, अमित वर्मा' : 'e.g., Amit Verma');

    function handleQuickSetup() {
      const name = personName.trim();
      if (!name) {
        toast.error(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें!' : 'Please enter your name!');
        return;
      }
      localStorage.setItem('arthmitra_role', role!);
      if (role === 'ca') {
        localStorage.setItem('arthmitra_ca_name', name);
      } else {
        localStorage.setItem('arthmitra_student_name', name);
      }
      router.push(role === 'ca' ? '/ca' : '/student');
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gray-50)' }}>
        <div className="w-full max-w-md bg-white rounded-2xl p-8 warm-shadow">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{role === 'ca' ? '👔' : '🎓'}</div>
            <h2 className="text-2xl font-bold mb-1 font-['Sora']" style={{ color: 'var(--navy)' }}>
              {role === 'ca' ? t('caDashTitle', lang) : t('studentDashTitle', lang)}
            </h2>
            <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
              {role === 'ca' ? t('caDashDesc', lang) : t('studentDashDesc', lang)}
            </p>
          </div>
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>
              {nameLabel}
            </Label>
            <Input
              value={personName}
              onChange={e => setPersonName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuickSetup()}
              placeholder={namePH}
              className="rounded-xl"
              autoFocus
            />
          </div>
          <Button
            onClick={handleQuickSetup}
            className="w-full font-['Sora'] font-bold"
            style={{ background: 'var(--navy)', color: 'white' }}
          >
            {t('openDashboard', lang)} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <button
            onClick={() => setRole(null)}
            className="w-full mt-3 text-xs text-center"
            style={{ color: 'var(--gray-500)' }}
          >
            ← {lang === 'hi' ? 'भूमिका बदलें' : 'Change role'}
          </button>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gray-50)' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center">
              <span className="text-white font-bold text-sm">अ</span>
            </div>
            <span className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>ArthMitra</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--gray-200)' }}>
              <button onClick={() => setLang('en')} className="px-3 py-1 text-xs font-bold transition-all" style={{ background: lang === 'en' ? 'var(--saffron)' : 'white', color: lang === 'en' ? 'white' : 'var(--gray-500)' }}>EN</button>
              <button onClick={() => setLang('hi')} className="px-3 py-1 text-xs font-bold transition-all" style={{ background: lang === 'hi' ? 'var(--saffron)' : 'white', color: lang === 'hi' ? 'white' : 'var(--gray-500)' }}>हिं</button>
            </div>
            <span className="text-sm" style={{ color: 'var(--gray-500)' }}>
              {t('stepIndicator', lang).replace('{step}', String(step + 1)).replace('{total}', String(STEPS.length))}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full mb-6" style={{ background: 'var(--gray-100)' }}>
          <motion.div className="h-2 rounded-full" style={{ background: 'var(--saffron)' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{ background: i < step ? 'var(--india-green)' : i === step ? 'var(--saffron)' : 'var(--gray-100)', color: i <= step ? 'white' : 'var(--gray-500)' }}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs hidden sm:block" style={{ color: i === step ? 'var(--saffron)' : 'var(--gray-500)' }}>
                {t(s.titleKey as Parameters<typeof t>[0], lang)}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 warm-shadow mb-6"
          >
            <h2 className="text-2xl font-bold mb-1 font-['Sora']" style={{ color: 'var(--navy)' }}>
              {t(STEPS[step].titleKey as Parameters<typeof t>[0], lang)}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--gray-500)' }}>{t(STEPS[step].subKey as Parameters<typeof t>[0], lang)}</p>

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>{t('bizNameLabel', lang)}</Label>
                  <Input value={form.business_name} onChange={e => update('business_name', e.target.value)} placeholder={t('bizNamePH', lang)} className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>{t('ownerNameLabel', lang)}</Label>
                  <Input value={form.owner_name} onChange={e => update('owner_name', e.target.value)} placeholder={t('ownerNamePH', lang)} className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>{t('stateLabel', lang)}</Label>
                  <select
                    value={form.state}
                    onChange={e => update('state', e.target.value)}
                    required
                    style={{ ...dropdownStyle, color: form.state ? '#0D1B2A' : '#9CA3AF' }}
                    onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E8E8E0'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="" disabled style={{ color: '#9CA3AF' }}>{t('statePH', lang)}</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s} style={{ color: '#0D1B2A', backgroundColor: '#FFFFFF' }}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>{t('districtLabel', lang)}</Label>
                  <Input value={form.district} onChange={e => update('district', e.target.value)} placeholder={t('districtPH', lang)} className="rounded-xl" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>{t('bizTypeLabel', lang)}</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['manufacturing', 'service', 'trading', 'retail', 'food', 'other'].map(type => (
                      <button
                        key={type}
                        onClick={() => { update('business_type', type); update('industry', ''); }}
                        className="px-3 py-2 rounded-xl text-sm font-medium capitalize border-2 transition-all"
                        style={{
                          borderColor: form.business_type === type ? 'var(--saffron)' : 'var(--gray-100)',
                          background: form.business_type === type ? 'var(--saffron-light)' : 'white',
                          color: form.business_type === type ? 'var(--saffron)' : 'var(--gray-500)',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {form.business_type && (
                  <div>
                    <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>{t('industryLabelOB', lang)}</Label>
                    <select
                      value={form.industry}
                      onChange={e => update('industry', e.target.value)}
                      style={{ ...dropdownStyle, color: form.industry ? '#0D1B2A' : '#9CA3AF' }}
                      onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#E8E8E0'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="" disabled style={{ color: '#9CA3AF', backgroundColor: '#FFFFFF' }}>{t('industryPH', lang)}</option>
                      {(INDUSTRIES[form.business_type] || []).map(ind => (
                        <option key={ind} value={ind} style={{ color: '#0D1B2A', backgroundColor: '#FFFFFF' }}>{ind}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>{t('annualTurnoverLabel', lang)}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TURNOVER_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update('annual_turnover', opt.value)}
                        className="px-3 py-2 rounded-xl text-sm border-2 transition-all text-left"
                        style={{
                          borderColor: form.annual_turnover === opt.value ? 'var(--saffron)' : 'var(--gray-100)',
                          background: form.annual_turnover === opt.value ? 'var(--saffron-light)' : 'white',
                          color: form.annual_turnover === opt.value ? 'var(--saffron)' : 'var(--gray-500)',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>
                    {t('empCountLabel', lang)} <span style={{ color: 'var(--saffron)' }}>{form.employee_count}</span>
                  </Label>
                  <input type="range" min={0} max={500} value={form.employee_count} onChange={e => update('employee_count', parseInt(e.target.value))} className="w-full accent-orange-500" />
                  <div className="flex justify-between text-xs" style={{ color: 'var(--gray-500)' }}>
                    <span>0</span><span>250</span><span>500+</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>{t('gstLabel', lang)}</Label>
                  <div className="flex gap-3">
                    {[{ labelKey: 'gstYes', value: true }, { labelKey: 'gstNo', value: false }].map(opt => (
                      <button
                        key={String(opt.value)}
                        onClick={() => update('gst_registered', opt.value)}
                        className="flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all"
                        style={{
                          borderColor: form.gst_registered === opt.value ? 'var(--saffron)' : 'var(--gray-100)',
                          background: form.gst_registered === opt.value ? 'var(--saffron-light)' : 'white',
                          color: form.gst_registered === opt.value ? 'var(--saffron)' : 'var(--gray-500)',
                        }}
                      >
                        {t(opt.labelKey as Parameters<typeof t>[0], lang)}
                      </button>
                    ))}
                  </div>
                  {form.gst_registered && (
                    <Input value={form.gst_number} onChange={e => update('gst_number', e.target.value.toUpperCase())} placeholder={t('gstPH', lang)} className="mt-2 rounded-xl font-mono" maxLength={15} />
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-1 block" style={{ color: 'var(--navy)' }}>{t('udyamLabel', lang)}</Label>
                  <Input value={form.udyam_number} onChange={e => update('udyam_number', e.target.value.toUpperCase())} placeholder={t('udyamPH', lang)} className="rounded-xl font-mono" />
                  <p className="text-xs mt-1" style={{ color: 'var(--gray-500)' }}>{t('udyamHint', lang)}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>{t('ownershipLabel', lang)}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Proprietorship', value: 'proprietorship' },
                      { label: 'Partnership', value: 'partnership' },
                      { label: 'Pvt Ltd', value: 'pvt_ltd' },
                      { label: 'LLP', value: 'llp' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update('ownership_type', opt.value)}
                        className="py-2 rounded-xl text-sm border-2 transition-all"
                        style={{
                          borderColor: form.ownership_type === opt.value ? 'var(--saffron)' : 'var(--gray-100)',
                          background: form.ownership_type === opt.value ? 'var(--saffron-light)' : 'white',
                          color: form.ownership_type === opt.value ? 'var(--saffron)' : 'var(--gray-500)',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--navy)' }}>{t('isStartupLabel', lang)}</Label>
                  <div className="flex gap-3">
                    {[{ labelKey: 'yesBtn', value: true }, { labelKey: 'noBtn', value: false }].map(opt => (
                      <button
                        key={String(opt.value)}
                        onClick={() => update('is_startup', opt.value)}
                        className="flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all"
                        style={{
                          borderColor: form.is_startup === opt.value ? 'var(--saffron)' : 'var(--gray-100)',
                          background: form.is_startup === opt.value ? 'var(--saffron-light)' : 'white',
                          color: form.is_startup === opt.value ? 'var(--saffron)' : 'var(--gray-500)',
                        }}
                      >
                        {t(opt.labelKey as Parameters<typeof t>[0], lang)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#E8F5E9' }}
                >
                  <Check className="h-10 w-10" style={{ color: 'var(--india-green)' }} />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 font-['Sora']" style={{ color: 'var(--navy)' }}>
                  {t('bizReadyTitle', lang).replace('{name}', form.business_name || 'Your Business')}
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--gray-500)' }}>
                  {t('aiReadyDesc', lang)}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { emoji: '✅', labelKey: 'compCheck' },
                    { emoji: '🏛️', labelKey: 'schemesMatchLabel' },
                    { emoji: '🤖', labelKey: 'aiReadyLabel' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="rounded-xl p-3 text-center" style={{ background: 'var(--gray-50)' }}>
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{t(item.labelKey as Parameters<typeof t>[0], lang)}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('backBtn', lang)}
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => {
                if (step === 0 && !form.business_name) { toast.error(t('bizNameRequired', lang)); return; }
                if (step === 0 && !form.state) { toast.error(t('stateRequired', lang)); return; }
                if (step === 1 && !form.business_type) { toast.error(t('bizTypeRequired', lang)); return; }
                setStep(s => s + 1);
              }}
              className="flex-1 rounded-xl font-['Sora'] font-semibold"
              style={{ background: 'var(--saffron)', color: 'white' }}
            >
              {t('continueBtn', lang)} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={saveAndRedirect}
              className="flex-1 rounded-xl font-['Sora'] font-bold text-base"
              style={{ background: 'var(--india-green)', color: 'white' }}
            >
              {t('openDashBtn', lang)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
