import { ComplianceRule } from '@/types';

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'gst_registration',
    name: 'GST Registration',
    applicability: { minTurnover: 2000000 },
    filingFrequency: 'monthly',
    deadlines: ['20th of following month (GSTR-3B)'],
    penalty: '₹50/day (min ₹10,000)',
    description: 'Mandatory for businesses with turnover > ₹20L (₹10L for NE states)'
  },
  {
    id: 'gst_registration_ne',
    name: 'GST Registration (NE States)',
    applicability: {
      minTurnover: 1000000,
      states: ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim']
    },
    filingFrequency: 'monthly',
    deadlines: ['20th of following month'],
    penalty: '₹50/day (min ₹10,000)',
    description: 'Lower threshold of ₹10L for NE states'
  },
  {
    id: 'tds_deduction',
    name: 'TDS (Tax Deducted at Source)',
    applicability: { minTurnover: 10000000 },
    filingFrequency: 'quarterly',
    deadlines: ['31st July', '31st October', '31st January', '31st May'],
    penalty: '1.5% per month',
    description: 'Deduct TDS on salary, contractor payments, rent above thresholds'
  },
  {
    id: 'pf_registration',
    name: 'Provident Fund (PF)',
    applicability: { minEmployees: 20 },
    filingFrequency: 'monthly',
    deadlines: ['15th of every month'],
    penalty: '₹5,000 + 12% interest',
    description: 'Mandatory for organizations with 20+ employees'
  },
  {
    id: 'esic_registration',
    name: 'ESIC (Employee State Insurance)',
    applicability: { minEmployees: 10 },
    filingFrequency: 'monthly',
    deadlines: ['21st of every month'],
    penalty: '₹5,000 per default',
    description: 'For employees earning < ₹21,000/month'
  },
  {
    id: 'income_tax_itr',
    name: 'Income Tax Return',
    applicability: {},
    filingFrequency: 'annual',
    deadlines: ['31st July (individuals)', '31st October (audit cases)'],
    penalty: '₹5,000 late fee',
    description: 'Annual ITR filing mandatory for all taxable entities'
  },
  {
    id: 'udyam_registration',
    name: 'Udyam Registration',
    applicability: { maxTurnover: 2500000000 },
    filingFrequency: 'annual',
    deadlines: ['Annual update required'],
    penalty: 'Loss of MSME benefits',
    description: 'Free MSME registration, unlocks government schemes'
  },
  {
    id: 'shop_establishment',
    name: 'Shop & Establishment License',
    applicability: { businessTypes: ['retail', 'service', 'trading'] },
    filingFrequency: 'annual',
    deadlines: ['Renewal before expiry date'],
    penalty: '₹200–500 fine',
    description: 'State-specific license for shops and commercial establishments'
  },
  {
    id: 'fssai',
    name: 'FSSAI License',
    applicability: { businessTypes: ['food'] },
    filingFrequency: 'annual',
    deadlines: ['Before license expiry'],
    penalty: '₹2–10 lakh + imprisonment',
    description: 'Mandatory for all food businesses'
  },
  {
    id: 'professional_tax',
    name: 'Professional Tax',
    applicability: {
      states: ['Maharashtra', 'Karnataka', 'West Bengal', 'Tamil Nadu', 'Andhra Pradesh', 'Gujarat', 'Telangana']
    },
    filingFrequency: 'monthly',
    deadlines: ['Last day of month'],
    penalty: '2% per month',
    description: 'State-specific tax on professionals and businesses'
  }
];

export function isApplicable(rule: ComplianceRule, business: { annual_turnover: number; employee_count: number; business_type: string; state: string }): boolean {
  const { applicability } = rule;
  if (applicability.minTurnover && business.annual_turnover < applicability.minTurnover) return false;
  if (applicability.maxTurnover && business.annual_turnover > applicability.maxTurnover) return false;
  if (applicability.minEmployees && business.employee_count < applicability.minEmployees) return false;
  if (applicability.businessTypes && !applicability.businessTypes.includes(business.business_type)) return false;
  if (applicability.states && !applicability.states.includes(business.state)) return false;
  return true;
}

export function calculateComplianceScore(
  business: { annual_turnover: number; employee_count: number; business_type: string; state: string },
  filedIds: string[]
): { score: number; applicable: ComplianceRule[]; pending: ComplianceRule[]; } {
  const applicable = COMPLIANCE_RULES.filter(rule => isApplicable(rule, business));
  const pending = applicable.filter(r => !filedIds.includes(r.id));
  const base = 100;
  const pendingDeduction = pending.length * 12;
  const score = Math.max(0, base - pendingDeduction);
  return { score, applicable, pending };
}
