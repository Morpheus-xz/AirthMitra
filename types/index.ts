export interface BusinessProfile {
  id?: string;
  profile_id?: string;
  business_name: string;
  business_type: 'manufacturing' | 'service' | 'trading' | 'retail' | 'food' | 'other';
  industry: string;
  state: string;
  district?: string;
  annual_turnover: number;
  employee_count: number;
  gst_registered: boolean;
  gst_number?: string;
  udyam_number?: string;
  pan?: string;
  ownership_type: 'proprietorship' | 'partnership' | 'pvt_ltd' | 'llp' | 'other';
  is_startup: boolean;
}

export interface ComplianceRecord {
  id?: string;
  business_id?: string;
  compliance_type: string;
  status: 'pending' | 'filed' | 'overdue' | 'na';
  due_date?: string;
  filed_date?: string;
  notes?: string;
}

export interface BahiKhataEntry {
  date: string | null;
  type: 'sale' | 'purchase' | 'expense' | 'udhaar_given' | 'udhaar_received' | 'payment' | null;
  party: string | null;
  amount: number;
  description: string | null;
}

export interface Expert {
  id: string;
  name: string;
  type: 'ca' | 'lawyer' | 'student';
  qualification: string;
  experience: number;
  states: string[];
  industries: string[];
  languages: string[];
  hourlyRate: number;
  consultationFee: number;
  rating: number;
  totalConsultations: number;
  bio: string;
  available: boolean;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  applicability: {
    minTurnover?: number;
    maxTurnover?: number;
    minEmployees?: number;
    businessTypes?: string[];
    states?: string[];
  };
  filingFrequency: 'monthly' | 'quarterly' | 'annual';
  deadlines: string[];
  penalty: string;
  description: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  ministry: string;
  category: 'loan' | 'subsidy' | 'registration' | 'incentive' | 'training';
  shortDescription: string;
  fullDescription: string;
  benefit: string;
  eligibility: {
    businessTypes?: string[];
    states?: string[];
    maxTurnover?: number;
    minTurnover?: number;
    maxEmployees?: number;
    ownershipTypes?: string[];
    isStartup?: boolean;
    requiresUdyam?: boolean;
  };
  applicationUrl: string;
  applicationProcess: string[];
  documentsRequired: string[];
}

export type UserRole = 'business' | 'ca' | 'student';

export interface UserProfile {
  id?: string;
  clerk_id: string;
  role: UserRole;
  name?: string;
  email?: string;
  phone?: string;
  language: string;
}
