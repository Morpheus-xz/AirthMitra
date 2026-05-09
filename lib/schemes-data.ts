import { GovernmentScheme } from '@/types';

export const SCHEMES: GovernmentScheme[] = [
  {
    id: 'mudra_shishu',
    name: 'MUDRA Loan — Shishu',
    ministry: 'Ministry of Finance',
    category: 'loan',
    shortDescription: 'Loan up to ₹50,000 for micro enterprises',
    fullDescription: 'Pradhan Mantri MUDRA Yojana provides collateral-free loans to micro and small enterprises through banks, MFIs, and NBFCs.',
    benefit: 'Loan up to ₹50,000 at low interest. No collateral required.',
    eligibility: { maxTurnover: 10000000, businessTypes: ['manufacturing', 'service', 'trading', 'retail'] },
    applicationUrl: 'https://www.mudra.org.in',
    applicationProcess: ['Visit any bank/NBFC', 'Fill MUDRA loan application', 'Submit documents', 'Get disbursement in 7-10 days'],
    documentsRequired: ['Aadhaar', 'PAN', 'Business address proof', 'Last 6 months bank statement']
  },
  {
    id: 'mudra_kishor',
    name: 'MUDRA Loan — Kishor',
    ministry: 'Ministry of Finance',
    category: 'loan',
    shortDescription: 'Loan ₹50,000 to ₹5 lakh for growing businesses',
    fullDescription: 'Mid-tier MUDRA loan for businesses that have crossed basic setup and need growth capital.',
    benefit: 'Loan ₹50,000–₹5 lakh. Subsidized interest rates.',
    eligibility: { maxTurnover: 50000000 },
    applicationUrl: 'https://www.mudra.org.in',
    applicationProcess: ['Approach bank with business plan', 'Submit 2-year ITR', 'Await credit assessment', 'Disbursement within 15 days'],
    documentsRequired: ['Aadhaar', 'PAN', 'ITR last 2 years', 'Bank statements', 'Business registration']
  },
  {
    id: 'pmegp',
    name: 'PMEGP — PM Employment Generation Programme',
    ministry: 'Ministry of MSME',
    category: 'subsidy',
    shortDescription: '15–35% subsidy on project cost up to ₹50 lakh',
    fullDescription: 'Government provides margin money subsidy to set up new micro enterprises in manufacturing and service sectors.',
    benefit: '15% subsidy (urban) / 25% subsidy (rural). Up to ₹50L manufacturing, ₹20L service.',
    eligibility: { maxTurnover: 0, ownershipTypes: ['proprietorship', 'partnership'] },
    applicationUrl: 'https://www.kviconline.gov.in/pmegpeportal',
    applicationProcess: ['Apply on KVIC portal', 'Submit project report', 'Interview with District Task Force', 'Bank sanction', 'Training', 'Subsidy released'],
    documentsRequired: ['Aadhaar', 'PAN', '8th pass certificate (min)', 'Project report', 'Caste certificate (if applicable)']
  },
  {
    id: 'credit_guarantee',
    name: 'CGTMSE — Credit Guarantee Fund',
    ministry: 'Ministry of MSME',
    category: 'loan',
    shortDescription: 'Collateral-free loans up to ₹2 crore for MSMEs',
    fullDescription: 'Credit Guarantee Fund Trust for Micro and Small Enterprises enables collateral-free lending to MSMEs.',
    benefit: 'Loans up to ₹2 crore without any collateral or third-party guarantee.',
    eligibility: { requiresUdyam: true, maxTurnover: 2500000000 },
    applicationUrl: 'https://cgtmse.in',
    applicationProcess: ['Apply through member lending institution (bank)', 'Bank assesses viability', 'CGTMSE covers 75-85% credit risk'],
    documentsRequired: ['Udyam certificate', 'Business financials', 'Project report', 'Bank statements']
  },
  {
    id: 'startup_india',
    name: 'Startup India — DPIIT Recognition',
    ministry: 'DPIIT, Ministry of Commerce',
    category: 'registration',
    shortDescription: 'Tax exemptions + fast-track exits for startups',
    fullDescription: 'DPIIT recognition gives startups tax holidays, self-certification compliance, and fast-track IP registration.',
    benefit: '3-year income tax exemption. 80% rebate on patent fees. Self-certify 6 labour laws.',
    eligibility: { isStartup: true, maxTurnover: 1000000000 },
    applicationUrl: 'https://www.startupindia.gov.in',
    applicationProcess: ['Register on Startup India portal', 'Apply for DPIIT recognition', 'Get certificate within 2-3 weeks', 'Apply for tax exemptions separately'],
    documentsRequired: ['Company incorporation cert', 'PAN', 'Directors details', 'Pitch deck/business description']
  },
  {
    id: 'msme_technology_upgrade',
    name: 'CLCS-TUS — Technology Upgradation Scheme',
    ministry: 'Ministry of MSME',
    category: 'subsidy',
    shortDescription: '15% capital subsidy for technology upgradation',
    fullDescription: 'Capital Linked Credit Subsidy for technology upgradation in micro and small manufacturing units.',
    benefit: '15% upfront capital subsidy (max ₹15 lakh) on institutional credit for technology upgradation.',
    eligibility: { businessTypes: ['manufacturing'], requiresUdyam: true },
    applicationUrl: 'https://msme.gov.in',
    applicationProcess: ['Apply through nodal banks', 'Submit technology upgradation plan', 'Bank forwards to SIDBI/NABARD', 'Subsidy credited to loan account'],
    documentsRequired: ['Udyam certificate', 'Loan application', 'Quotation for machinery', 'Project report']
  },
  {
    id: 'gem_portal',
    name: 'GeM — Government eMarketplace',
    ministry: 'Ministry of Commerce',
    category: 'incentive',
    shortDescription: 'Sell directly to government departments',
    fullDescription: 'GeM portal enables MSMEs to sell products/services directly to central and state government departments without middlemen.',
    benefit: 'Direct access to government procurement. No tender fees. Quick payment cycle (10 days).',
    eligibility: { requiresUdyam: true },
    applicationUrl: 'https://gem.gov.in',
    applicationProcess: ['Register on GeM as seller', 'List products/services', 'Get verified', 'Start receiving orders'],
    documentsRequired: ['Udyam certificate', 'Bank details', 'PAN', 'GST (if applicable)']
  },
  {
    id: 'assam_industrial_policy',
    name: 'Assam Industrial & Investment Policy 2024',
    ministry: 'Govt of Assam',
    category: 'incentive',
    shortDescription: 'Capital subsidy + tax incentives for Assam businesses',
    fullDescription: 'Assam offers capital investment subsidy, SGST reimbursement, and stamp duty waiver to attract manufacturing investment.',
    benefit: 'Up to 30% capital subsidy. 100% SGST reimbursement for 7 years. Stamp duty waiver.',
    eligibility: { states: ['Assam'], businessTypes: ['manufacturing'] },
    applicationUrl: 'https://industries.assam.gov.in',
    applicationProcess: ['Apply on Assam Industries portal', 'Submit investment proposal', 'District Industries Centre review', 'State approval'],
    documentsRequired: ['Project report', 'Land documents', 'Udyam certificate', 'Bank sanction letter']
  },
  {
    id: 'gujarat_msme_assistance',
    name: 'Gujarat MSME Assistance Scheme',
    ministry: 'Govt of Gujarat',
    category: 'subsidy',
    shortDescription: 'Interest subsidy + power tariff concession for Gujarat MSMEs',
    fullDescription: 'Gujarat offers interest subsidy on term loans and concession on power tariff for MSMEs registered in the state.',
    benefit: '6-7% interest subsidy. Power tariff concession for manufacturing units.',
    eligibility: { states: ['Gujarat'], businessTypes: ['manufacturing', 'service'] },
    applicationUrl: 'https://ic.gujarat.gov.in',
    applicationProcess: ['Apply through District Industries Commissioner', 'Submit loan details', 'Verification', 'Subsidy disbursed annually'],
    documentsRequired: ['Udyam certificate', 'Loan sanction letter', 'Power bills', 'ITR']
  },
  {
    id: 'one_district_one_product',
    name: 'ODOP — One District One Product',
    ministry: 'Ministry of Commerce + States',
    category: 'incentive',
    shortDescription: 'Branding + market access for local specialty products',
    fullDescription: 'ODOP promotes unique products from each district, providing branding, packaging, market access and export support.',
    benefit: 'Free branding support. Subsidized packaging. GeM priority listing. Export assistance.',
    eligibility: { requiresUdyam: true },
    applicationUrl: 'https://odop.in',
    applicationProcess: ['Check your district product on ODOP portal', 'Register as ODOP artisan/producer', 'Apply for benefits'],
    documentsRequired: ['Udyam certificate', 'Product photos', 'Bank details', 'Address proof']
  }
];

export function matchSchemes(business: {
  business_type: string;
  state: string;
  annual_turnover: number;
  employee_count?: number;
  ownership_type?: string;
  is_startup?: boolean;
  udyam_number?: string;
}): GovernmentScheme[] {
  return SCHEMES.filter(scheme => {
    const e = scheme.eligibility;
    if (e.businessTypes && !e.businessTypes.includes(business.business_type)) return false;
    if (e.states && !e.states.includes(business.state)) return false;
    if (e.maxTurnover !== undefined && e.maxTurnover > 0 && business.annual_turnover > e.maxTurnover) return false;
    if (e.minTurnover && business.annual_turnover < e.minTurnover) return false;
    if (e.isStartup && !business.is_startup) return false;
    if (e.requiresUdyam && !business.udyam_number) return false;
    return true;
  });
}
