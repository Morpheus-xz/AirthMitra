'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle, TrendingUp, BookOpen, Users, Map, Globe,
  ArrowRight, Star, Shield, Zap, Award, Building2,
  GraduationCap, Briefcase, ChevronRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const { lang, setLang } = useLanguage();

  const FEATURES = [
    { icon: Shield, titleKey: 'feat1Title', descKey: 'feat1Desc', color: 'text-saffron', bg: 'bg-saffron-light' },
    { icon: Award, titleKey: 'feat2Title', descKey: 'feat2Desc', color: 'text-india-green', bg: 'bg-[#E8F5E9]' },
    { icon: BookOpen, titleKey: 'feat3Title', descKey: 'feat3Desc', color: 'text-gold', bg: 'bg-[#FFF8E1]' },
    { icon: Users, titleKey: 'feat4Title', descKey: 'feat4Desc', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Map, titleKey: 'feat5Title', descKey: 'feat5Desc', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Globe, titleKey: 'feat6Title', descKey: 'feat6Desc', color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  const PAIN_POINTS = [
    { emoji: '😰', titleKey: 'pain1Title', descKey: 'pain1Desc' },
    { emoji: '😤', titleKey: 'pain2Title', descKey: 'pain2Desc' },
    { emoji: '📓', titleKey: 'pain3Title', descKey: 'pain3Desc' },
    { emoji: '💸', titleKey: 'pain4Title', descKey: 'pain4Desc' },
  ];

  const TESTIMONIALS = [
    { name: 'Ramesh Patel', business: 'Textile Manufacturer, Surat', textKey: 't1Text', rating: 5, avatar: 'RP' },
    { name: 'Priti Kumari', business: 'Kirana Store Owner, Patna', textKey: 't2Text', rating: 5, avatar: 'PK' },
    { name: 'Mohammed Salim', business: 'Food Processing, Hyderabad', textKey: 't3Text', rating: 5, avatar: 'MS' },
  ];

  const HOW_IT_WORKS = [
    { step: '01', titleKey: 'how1Title', descKey: 'how1Desc', icon: Building2 },
    { step: '02', titleKey: 'how2Title', descKey: 'how2Desc', icon: Sparkles },
    { step: '03', titleKey: 'how3Title', descKey: 'how3Desc', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--white)' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(250,250,250,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--gray-100)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center">
              <span className="text-white font-bold text-sm font-['Sora']">अ</span>
            </div>
            <div>
              <span className="font-bold text-lg font-['Sora']" style={{ color: 'var(--navy)' }}>ArthMitra</span>
              <span className="text-xs ml-1" style={{ color: 'var(--saffron)' }}>AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--gray-500)' }}>
            <a href="#features" className="hover:text-saffron transition-colors">{t('navFeatures', lang)}</a>
            <a href="#how" className="hover:text-saffron transition-colors">{t('navHowItWorks', lang)}</a>
            <a href="#testimonials" className="hover:text-saffron transition-colors">{t('navSuccessStories', lang)}</a>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--gray-200)' }}>
              <button
                onClick={() => setLang('en')}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: lang === 'en' ? 'var(--saffron)' : 'white',
                  color: lang === 'en' ? 'white' : 'var(--gray-500)',
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: lang === 'hi' ? 'var(--saffron)' : 'white',
                  color: lang === 'hi' ? 'white' : 'var(--gray-500)',
                }}
              >
                हिं
              </button>
            </div>
            <Link href="/onboarding">
              <Button style={{ background: 'var(--saffron)', color: 'white' }} className="hover:opacity-90 font-['Sora'] font-semibold text-sm px-4 py-2 rounded-lg">
                {t('startForFree', lang)}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 hero-pattern" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge className="mb-4 text-xs font-semibold px-3 py-1" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)', border: 'none' }}>
                  🇮🇳 Made for Bharat MSMEs
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--navy)' }}>
                  {t('heroLine1', lang)}{' '}
                  <span style={{ color: 'var(--saffron)' }}>{t('heroLine2', lang)}</span>{' '}
                  <br />
                  <span style={{ color: 'var(--india-green)' }}>{t('heroLine3', lang)}</span>
                </h1>
                <p className="text-lg sm:text-xl mb-6" style={{ color: 'var(--gray-500)', lineHeight: 1.7 }}>
                  {t('heroSubtitle', lang)}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/onboarding">
                    <Button size="lg" className="w-full sm:w-auto font-['Sora'] font-bold text-base px-8 py-6 rounded-xl" style={{ background: 'var(--saffron)', color: 'white' }}>
                      {t('scanBusiness', lang)}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/business">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto font-['Sora'] text-base px-8 py-6 rounded-xl" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
                      {t('viewDemo', lang)}
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--gray-500)' }}>
                  <div className="flex items-center gap-1"><CheckCircle className="h-4 w-4" style={{ color: 'var(--india-green)' }} /> {t('freeToStart', lang)}</div>
                  <div className="flex items-center gap-1"><CheckCircle className="h-4 w-4" style={{ color: 'var(--india-green)' }} /> {t('noCreditCard', lang)}</div>
                  <div className="flex items-center gap-1"><CheckCircle className="h-4 w-4" style={{ color: 'var(--india-green)' }} /> {t('hindiSupport', lang)}</div>
                </div>
              </motion.div>
            </div>

            {/* Dashboard Preview */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <div className="rounded-2xl overflow-hidden warm-shadow" style={{ background: 'var(--navy)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center">
                      <span className="text-white font-bold text-xs">अ</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm font-['Sora']">Ramesh Textiles</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Manufacturing • Gujarat</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {[
                    { label: t('complianceScore', lang), value: '78/100', color: '#FFB300', icon: '📊' },
                    { label: t('eligibleSchemes', lang), value: '7', color: '#138808', icon: '🏛️' },
                    { label: t('activeDeadlines', lang), value: '3', color: '#FF6B00', icon: '⏰' },
                    { label: t('pendingActions', lang), value: '4', color: '#DC2626', icon: '⚡' },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="text-lg mb-1">{stat.icon}</div>
                      <div className="font-bold font-['Sora']" style={{ color: stat.color, fontSize: '1.25rem' }}>{stat.value}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255, 107, 0, 0.1)', border: '1px solid rgba(255,107,0,0.2)' }}>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">🤖</span>
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--saffron)' }}>AI Alert</div>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          {lang === 'hi'
                            ? 'आपकी GST फाइलिंग 20 नवंबर को देय है — 5 दिन बाकी हैं। CGTMSE लोन के लिए भी आवेदन कर सकते हैं।'
                            : 'Your GST filing is due on 20 Nov — 5 days remaining. You can also apply for a CGTMSE loan. Shall I help?'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-3 -right-3 rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1" style={{ background: 'var(--india-green)', color: 'white' }}>
                <Zap className="h-3 w-3" /> AI Powered
              </motion.div>
              <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute -bottom-3 -left-3 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                🇮🇳 Bharat First
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: 'var(--navy)' }} className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10L+', labelKey: 'statsLabel1', icon: '🏭' },
            { value: '500+', labelKey: 'statsLabel2', icon: '🏛️' },
            { value: '₹2L', labelKey: 'statsLabel3', icon: '💰' },
            { value: '3', labelKey: 'statsLabel4', icon: '🗣️' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-bold font-['Sora']" style={{ color: 'var(--gold)' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{t(stat.labelKey as Parameters<typeof t>[0], lang)}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pain Points */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--gray-50)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-['Sora']" style={{ color: 'var(--navy)' }}>
              {t('painPointsTitle', lang)}
            </h2>
            <p style={{ color: 'var(--gray-500)' }}>{t('painPointsSubtitle', lang)}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAIN_POINTS.map((pain, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="rounded-2xl p-6 warm-shadow" style={{ background: 'white' }}>
                <div className="text-4xl mb-3">{pain.emoji}</div>
                <h3 className="font-bold mb-2 font-['Sora']" style={{ color: 'var(--navy)' }}>{t(pain.titleKey as Parameters<typeof t>[0], lang)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>{t(pain.descKey as Parameters<typeof t>[0], lang)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-['Sora']" style={{ color: 'var(--navy)' }}>
              {t('featuresTitle', lang)}
            </h2>
            <p style={{ color: 'var(--gray-500)' }}>{t('featuresSubtitle', lang)}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredFeature(i)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="rounded-2xl p-6 warm-shadow warm-shadow-hover transition-all duration-300 cursor-pointer"
                style={{ background: 'white', transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)' }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2 font-['Sora']" style={{ color: 'var(--navy)' }}>{t(feature.titleKey as Parameters<typeof t>[0], lang)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>{t(feature.descKey as Parameters<typeof t>[0], lang)}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--saffron)' }}>
                  {t('learnHow', lang)} <ChevronRight className="h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-16 px-4 sm:px-6" style={{ background: 'var(--gray-50)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-['Sora']" style={{ color: 'var(--navy)' }}>
              {t('howTitle', lang)}
            </h2>
            <p style={{ color: 'var(--gray-500)' }}>{t('howSubtitle', lang)}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} viewport={{ once: true }} className="relative">
                <div className="rounded-2xl p-8 warm-shadow text-center" style={{ background: 'white' }}>
                  <div className="text-5xl font-bold mb-4 font-['Sora']" style={{ color: 'var(--saffron-light)', WebkitTextStroke: '2px var(--saffron)' }}>
                    {step.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--saffron)' }}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 font-['Sora']" style={{ color: 'var(--navy)' }}>{t(step.titleKey as Parameters<typeof t>[0], lang)}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>{t(step.descKey as Parameters<typeof t>[0], lang)}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10" style={{ transform: 'translateY(-50%)' }}>
                    <ArrowRight className="h-8 w-8" style={{ color: 'var(--saffron)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-['Sora']" style={{ color: 'var(--navy)' }}>
              {t('testimonialsTitle', lang)}
            </h2>
            <p style={{ color: 'var(--gray-500)' }}>{t('testimonialsSubtitle', lang)}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="rounded-2xl p-6 warm-shadow" style={{ background: 'white' }}>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" style={{ color: 'var(--gold)' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--gray-500)' }}>"{t(testimonial.textKey as Parameters<typeof t>[0], lang)}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: 'var(--saffron)' }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{testimonial.name}</div>
                    <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{testimonial.business}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center" style={{ background: 'var(--navy)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-['Sora'] text-white">
            {t('ctaTitle', lang)}<span style={{ color: 'var(--gold)' }}>{t('ctaHighlight', lang)}</span>
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t('ctaSubtitle', lang)}
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="font-['Sora'] font-bold text-lg px-10 py-6 rounded-xl" style={{ background: 'var(--saffron)', color: 'white' }}>
              {t('scanBusiness', lang)}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <div className="mt-6 flex items-center justify-center gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span>✓ {t('noCreditCard', lang)}</span>
            <span>✓ {t('hindiSupport', lang)}</span>
            <span>✓ 2 min setup</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm" style={{ background: '#070E18', color: 'rgba(255,255,255,0.4)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-saffron flex items-center justify-center">
            <span className="text-white font-bold text-xs">अ</span>
          </div>
          <span className="font-semibold text-white font-['Sora']">ArthMitra AI</span>
        </div>
        <p>{t('footerTagline', lang)}</p>
      </footer>
    </div>
  );
}
