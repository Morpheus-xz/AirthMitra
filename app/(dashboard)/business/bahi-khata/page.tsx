'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, FileText, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, History, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BahiKhataEntry } from '@/types';
import jsPDF from 'jspdf';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

function formatCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function downloadBahiKhataPDF(entries: BahiKhataEntry[], analytics: Analytics, businessName: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 107, 0);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ArthMitra AI', 14, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Bahi Khata — OCR Analysis Report', 14, 21);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 21, { align: 'right' });

  doc.setTextColor(13, 27, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(businessName || 'Business Ledger', 14, 40);

  doc.setFillColor(245, 245, 240);
  doc.roundedRect(14, 46, pageWidth - 28, 38, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(19, 136, 8);
  doc.text('SUMMARY', 20, 56);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(13, 27, 42);
  const col1X = 20, col2X = 90, col3X = 155;
  doc.text('Total Sales:', col1X, 65);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${analytics.totalSales.toLocaleString('en-IN')}`, col1X, 72);

  doc.setFont('helvetica', 'normal');
  doc.text('Total Expenses:', col2X, 65);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(`Rs. ${analytics.totalExpenses.toLocaleString('en-IN')}`, col2X, 72);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(13, 27, 42);
  doc.text('Credit Given:', col3X, 65);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`Rs. ${analytics.udhaGiven.toLocaleString('en-IN')}`, col3X, 72);

  let yPos = 96;
  if (analytics.totalSales >= 1500000) {
    doc.setFillColor(255, 237, 213);
    doc.roundedRect(14, yPos, pageWidth - 28, 14, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(180, 60, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('GST ALERT:', 20, yPos + 9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Turnover Rs.${analytics.totalSales.toLocaleString('en-IN')} — nearing GST threshold. Prepare for registration.`, 58, yPos + 9);
    yPos += 22;
  }

  yPos += 6;
  doc.setFillColor(13, 27, 42);
  doc.rect(14, yPos, pageWidth - 28, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', 18, yPos + 7);
  doc.text('Type', 46, yPos + 7);
  doc.text('Party', 76, yPos + 7);
  doc.text('Amount (Rs.)', 130, yPos + 7);
  doc.text('Description', 168, yPos + 7);
  yPos += 10;

  const typeColors: Record<string, [number, number, number]> = {
    sale: [19, 136, 8],
    purchase: [220, 38, 38],
    expense: [220, 38, 38],
    udhaar_given: [217, 119, 6],
    udhaar_received: [59, 130, 246],
    payment: [107, 114, 128],
  };

  entries.forEach((entry, i) => {
    if (yPos > 270) { doc.addPage(); yPos = 20; }
    const bg: [number, number, number] = i % 2 === 0 ? [255, 255, 255] : [248, 248, 244];
    doc.setFillColor(...bg);
    doc.rect(14, yPos, pageWidth - 28, 9, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(13, 27, 42);
    doc.text(entry.date || '-', 18, yPos + 6);

    const color = typeColors[entry.type || ''] || [13, 27, 42];
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text((entry.type || '').replace('_', ' ').toUpperCase(), 46, yPos + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(13, 27, 42);
    doc.text(entry.party || '-', 76, yPos + 6);
    doc.text(entry.amount ? entry.amount.toLocaleString('en-IN') : '-', 130, yPos + 6);

    const desc = entry.description || '-';
    doc.text(desc.length > 22 ? desc.substring(0, 22) + '...' : desc, 168, yPos + 6);
    yPos += 9;
  });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text("ArthMitra AI — India's Business Companion | arthmitra.in", 14, 290);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - 14, 290, { align: 'right' });
  }

  doc.save(`ArthMitra_BahiKhata_${new Date().toISOString().split('T')[0]}.pdf`);
}

const ENTRY_TYPE_CONFIG = {
  sale: { label: 'Sale', bg: '#E8F5E9', color: '#138808', emoji: '💰' },
  purchase: { label: 'Purchase', bg: '#FEE2E2', color: '#DC2626', emoji: '🛒' },
  expense: { label: 'Expense', bg: '#FEE2E2', color: '#DC2626', emoji: '💸' },
  udhaar_given: { label: 'Credit Given', bg: '#FEF3C7', color: '#D97706', emoji: '📤' },
  udhaar_received: { label: 'Credit Received', bg: '#EDE9FE', color: '#7C3AED', emoji: '📥' },
  payment: { label: 'Payment', bg: '#DBEAFE', color: '#1D4ED8', emoji: '✅' },
};

interface Analytics {
  totalSales: number;
  totalExpenses: number;
  udhaGiven: number;
  udharReceived: number;
  netProfit: number;
  runningTurnover: number;
}

export default function BahiKhataPage() {
  const { lang } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [entries, setEntries] = useState<BahiKhataEntry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [aiAlert, setAiAlert] = useState('');
  const [history, setHistory] = useState<{ date: string; entries: number; turnover: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('arthmitra_bahi_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setEntries([]);
    setAnalytics(null);
    setAiAlert('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('image/')) handleFile(dropped);
    else toast.error(t('onlyImageFiles', lang));
  }, [handleFile, lang]);

  async function processImage() {
    if (!file) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/ai/ocr', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.entries) {
        setEntries(data.entries);
        setAnalytics(data.analytics);
        setAiAlert(data.aiAlert);

        const newHistory = [
          { date: new Date().toLocaleDateString('en-IN'), entries: data.entries.length, turnover: data.analytics.totalSales },
          ...history.slice(0, 4),
        ];
        setHistory(newHistory);
        localStorage.setItem('arthmitra_bahi_history', JSON.stringify(newHistory));
        toast.success(`${data.entries.length} ${t('transactionsExtracted', lang)}`);
      }
    } catch {
      toast.error(t('imageProcessError', lang));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{t('bahiKhataPageTitle', lang)}</h1>
        <p className="text-sm" style={{ color: 'var(--gray-500)' }}>{t('bahiKhataPageSubtitle', lang)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div>
          <div
            className="relative rounded-2xl border-2 border-dashed transition-all duration-200"
            style={{
              borderColor: isDragging ? 'var(--saffron)' : preview ? 'var(--india-green)' : 'var(--gray-200)',
              background: isDragging ? 'var(--saffron-light)' : preview ? '#E8F5E9' : 'white',
              minHeight: 280,
            }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="p-4">
                <img src={preview} alt="Ledger" className="w-full rounded-xl object-cover" style={{ maxHeight: 240 }} />
                <button
                  onClick={() => { setFile(null); setPreview(null); setEntries([]); setAnalytics(null); }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold"
                  style={{ color: 'var(--danger)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--saffron-light)' }}>
                  <Camera className="h-8 w-8" style={{ color: 'var(--saffron)' }} />
                </div>
                <h3 className="font-bold text-lg mb-1 font-['Sora']" style={{ color: 'var(--navy)' }}>
                  {t('uploadYourLedger', lang)}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--gray-500)' }}>
                  {t('allFormatsSupported', lang)}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: 'var(--saffron)', color: 'white' }}
                  className="rounded-xl font-semibold"
                >
                  <Upload className="h-4 w-4 mr-2" /> {t('uploadPhoto', lang)}
                </Button>
                <p className="text-xs mt-3" style={{ color: 'var(--gray-500)' }}>{t('dropHere', lang)}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {file && !entries.length && (
            <Button
              onClick={processImage}
              disabled={processing}
              className="w-full mt-4 py-4 rounded-xl font-bold text-base font-['Sora']"
              style={{ background: 'var(--saffron)', color: 'white' }}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-5 h-5 rounded-full border-2 border-t-transparent border-white"
                  />
                  {t('analyzingLedger', lang)}
                </span>
              ) : (
                t('analyzeWithAI', lang)
              )}
            </Button>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-4 rounded-2xl p-4 warm-shadow" style={{ background: 'white' }}>
              <div className="flex items-center gap-2 mb-3">
                <History className="h-4 w-4" style={{ color: 'var(--gray-500)' }} />
                <h4 className="font-semibold text-sm font-['Sora']" style={{ color: 'var(--navy)' }}>{t('uploadHistory', lang)}</h4>
              </div>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                    <span style={{ color: 'var(--gray-500)' }}>{h.date}</span>
                    <span style={{ color: 'var(--navy)' }}>{h.entries} {t('entriesLabel', lang)}</span>
                    <span className="font-semibold" style={{ color: 'var(--india-green)' }}>{formatCurrency(h.turnover)} {t('turnoverLabel', lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {analytics && (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { labelKey: 'totalSales', value: analytics.totalSales, icon: TrendingUp, color: 'var(--india-green)', bg: '#E8F5E9' },
                  { labelKey: 'totalExpenses', value: analytics.totalExpenses, icon: TrendingDown, color: 'var(--danger)', bg: '#FEE2E2' },
                  { labelKey: 'udhaGiven', value: analytics.udhaGiven, icon: FileText, color: 'var(--gold)', bg: '#FEF3C7' },
                  { labelKey: 'netProfit', value: analytics.netProfit, icon: TrendingUp, color: analytics.netProfit >= 0 ? 'var(--india-green)' : 'var(--danger)', bg: analytics.netProfit >= 0 ? '#E8F5E9' : '#FEE2E2' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl p-4 warm-shadow"
                    style={{ background: 'white' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: stat.bg }}>
                      <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                    <div className="text-xl font-bold font-['Sora'] break-all" style={{ color: stat.color }}>{formatCurrency(stat.value)}</div>
                    <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{t(stat.labelKey as Parameters<typeof t>[0], lang)}</div>
                  </motion.div>
                ))}
              </div>

              {/* AI Alert */}
              {aiAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4"
                  style={{ background: 'var(--saffron-light)', border: '1px solid var(--saffron)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <div className="font-bold text-sm mb-1 font-['Sora']" style={{ color: 'var(--saffron)' }}>{t('aiAlertLabel', lang)}</div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)' }}>{aiAlert}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Transactions Table */}
              <div className="rounded-2xl overflow-hidden warm-shadow" style={{ background: 'white' }}>
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--gray-100)' }}>
                  <h3 className="font-bold font-['Sora']" style={{ color: 'var(--navy)' }}>{t('extractedTransactions', lang)}</h3>
                  <Badge style={{ background: 'var(--saffron-light)', color: 'var(--saffron)', border: 'none' }}>{entries.length} {t('entriesLabel', lang)}</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: 'var(--gray-50)' }}>
                        {['Date', 'Type', 'Party', 'Amount', 'Description'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-semibold" style={{ color: 'var(--gray-500)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, i) => {
                        const typeCfg = ENTRY_TYPE_CONFIG[entry.type as keyof typeof ENTRY_TYPE_CONFIG] || { label: entry.type || 'Other', bg: 'var(--gray-50)', color: 'var(--gray-500)', emoji: '📝' };
                        return (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b"
                            style={{ borderColor: 'var(--gray-100)' }}
                          >
                            <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--navy)' }}>{entry.date || '—'}</td>
                            <td className="px-3 py-2.5">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: typeCfg.bg, color: typeCfg.color }}>
                                {typeCfg.emoji} {typeCfg.label}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--navy)' }}>{entry.party || '—'}</td>
                            <td className="px-3 py-2.5 text-xs font-semibold" style={{ color: ['sale', 'payment'].includes(entry.type || '') ? 'var(--india-green)' : 'var(--danger)' }}>
                              {entry.amount ? formatCurrency(entry.amount) : '—'}
                            </td>
                            <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--gray-500)' }}>{entry.description || '—'}</td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 flex gap-3 flex-wrap">
                  <Button size="sm" className="rounded-xl text-xs" style={{ background: 'var(--india-green)', color: 'white' }}>
                    {t('saveToRecords', lang)}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs" style={{ borderColor: 'var(--gray-100)' }}>
                    {t('exportCSV', lang)}
                  </Button>
                  {entries.length > 0 && analytics && (
                    <Button
                      size="sm"
                      className="rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      style={{ background: '#138808', color: 'white' }}
                      onClick={() => {
                        const business = localStorage.getItem('arthmitra_business');
                        const name = business ? JSON.parse(business).business_name : 'My Business';
                        downloadBahiKhataPDF(entries, analytics, name);
                      }}
                    >
                      <Download className="h-3 w-3" /> {t('downloadPDF', lang)}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {!analytics && !processing && (
            <div className="rounded-2xl p-8 text-center" style={{ background: 'white', border: '2px dashed var(--gray-200)' }}>
              <div className="text-5xl mb-3">📖</div>
              <h3 className="font-bold font-['Sora'] mb-2" style={{ color: 'var(--navy)' }}>{t('analysisReady', lang)}</h3>
              <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
                {t('analysisReadyDesc', lang)}<br />
                <strong>{t('whatExtracted', lang)}</strong> {t('extractionDetails', lang)}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                {['Handwritten ledgers', 'Printed invoices', 'Notebook pages'].map(label => (
                  <div key={label} className="rounded-lg p-2" style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }}>
                    ✓ {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
