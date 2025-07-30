export interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  nrc: string; // National Registration Card
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  coverageType: 'basic' | 'standard' | 'premium';
  vehicleValue: number;
  usage: 'personal' | 'business' | 'commercial';
  numberPlate: string; // Zambian car number plate
  whiteBook: File | null; // Vehicle registration document upload
}

export interface QuoteResult {
  quoteId: string;
  quarterlyPremium: number;
  annualPremium: number;
  coverageType: 'basic' | 'standard' | 'premium';
  coverageDetails: string[];
  validUntil: string;
  // Professional pricing breakdown
  basePremium: number;
  vat: number;
  totalPremium: number;
  vatRate: number;
}

export interface PaymentResult {
  transactionId: string;
  receiptId: string;
  paymentMethod: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  emailSent: boolean;
}

export interface CoverageOption {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  monthlyPrice: number;
  features: string[];
  recommended?: boolean;
  badge?: string;
}

export interface QuotePreview {
  quarterlyPremium: number;
  annualPremium: number;
  isLoading: boolean;
}

export interface ZambianVehicleMake {
  id: string;
  name: string;
  models: string[];
  popular?: boolean;
}

export interface Theme {
  isDark: boolean;
}

export interface FormPersistence {
  data: Partial<QuoteFormData>;
  timestamp: number;
  step: number;
}