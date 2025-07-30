import { debounce } from 'lodash';
import { FormPersistence, QuoteFormData } from '../types';

// Local Storage Keys
export const STORAGE_KEYS = {
  FORM_DATA: 'motor_insurance_form_data',
  THEME: 'motor_insurance_theme',
  QUOTE_HISTORY: 'motor_insurance_quote_history',
} as const;

// Zambian Vehicle Makes and Models
export const ZAMBIAN_VEHICLE_MAKES = [
  {
    id: 'toyota',
    name: 'Toyota',
    models: ['Corolla', 'Camry', 'RAV4', 'Prado', 'Hilux', 'Fortuner', 'Vitz', 'Axio'],
    popular: true,
  },
  {
    id: 'mazda',
    name: 'Mazda',
    models: ['Demio', 'Axela', 'Atenza', 'CX-5', 'BT-50'],
    popular: true,
  },
  {
    id: 'nissan',
    name: 'Nissan',
    models: ['March', 'Note', 'Sunny', 'X-Trail', 'Navara', 'Patrol'],
    popular: true,
  },
  {
    id: 'honda',
    name: 'Honda',
    models: ['Fit', 'Civic', 'Accord', 'CR-V', 'HR-V'],
    popular: true,
  },
  {
    id: 'subaru',
    name: 'Subaru',
    models: ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV'],
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi',
    models: ['Colt', 'Lancer', 'Pajero', 'L200', 'ASX'],
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    models: ['i10', 'i20', 'Elantra', 'Tucson', 'Santa Fe'],
  },
  {
    id: 'kia',
    name: 'Kia',
    models: ['Picanto', 'Rio', 'Cerato', 'Sportage', 'Sorento'],
  },
  {
    id: 'ford',
    name: 'Ford',
    models: ['Fiesta', 'Focus', 'EcoSport', 'Ranger', 'Everest'],
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    models: ['Polo', 'Golf', 'Jetta', 'Tiguan', 'Amarok'],
  },
];

// Coverage Options with Zambian context
export const COVERAGE_OPTIONS = [
  {
    id: 'basic' as const,
    name: 'Third Party',
    price: 0,
    monthlyPrice: 0,
    features: [
      'Third-party liability coverage',
      'Legal minimum requirement in Zambia',
      'Property damage up to ZMW 50,000',
      'Bodily injury coverage',
      '24/7 emergency assistance',
    ],
    badge: 'Legal Minimum',
  },
  {
    id: 'standard' as const,
    name: 'Comprehensive',
    price: 0,
    monthlyPrice: 0,
    features: [
      'All Third Party benefits',
      'Theft and hijacking coverage',
      'Fire and natural disasters',
      'Windscreen and glass coverage',
      'Towing and recovery services',
      'Courtesy car (3 days)',
      'Hospital cash benefit',
    ],
    recommended: true,
    badge: 'Most Popular',
  },
  {
    id: 'premium' as const,
    name: 'Premium Plus',
    price: 0,
    monthlyPrice: 0,
    features: [
      'All Comprehensive benefits',
      'Extended courtesy car (7 days)',
      'Personal accident cover',
      'Personal belongings cover',
      'Key replacement coverage',
      'Emergency accommodation',
      'Cross-border coverage (SADC)',
      'No excess on glass claims',
    ],
    badge: 'Best Value',
  },
];

// Currency formatting utility with configurable locale and currency
export const formatCurrency = (
  amount: number,
  currency: string = 'ZMW',
  locale: string = 'en-ZM',
  minimumFractionDigits: number = 2
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(amount);
};

// Form Persistence Utilities
export const saveFormData = (data: Partial<QuoteFormData>, step: number = 1): void => {
  const persistence: FormPersistence = {
    data,
    timestamp: Date.now(),
    step,
  };
  localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(persistence));
};

export const loadFormData = (): FormPersistence | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    if (!stored) return null;
    
    const persistence: FormPersistence = JSON.parse(stored);
    
    // Check if data is less than 24 hours old
    const isRecent = Date.now() - persistence.timestamp < 24 * 60 * 60 * 1000;
    
    return isRecent ? persistence : null;
  } catch {
    return null;
  }
};

export const clearFormData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
};

// Theme utilities
export const getStoredTheme = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    return stored ? JSON.parse(stored) : false;
  } catch {
    return false;
  }
};

export const setStoredTheme = (isDark: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
};

// Debounced function factory
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500
) => {
  return debounce(func, delay);
};

// Validation utilities
export const validateZambianPhone = (phone: string): boolean => {
  // Zambian phone number validation (starts with +260, 0, or direct numbers)
  const phoneRegex = /^(\+260|0)?[9|7][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Accessibility utilities
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// PDF Generation utilities
export const generateQuotePDF = async (quoteData: any): Promise<void> => {
  // This will be implemented in the PDF component
  console.log('PDF generation for:', quoteData);
};

// Error boundary utilities
export const logError = (error: Error, errorInfo: any): void => {
  console.error('Error Boundary caught an error:', error, errorInfo);
  // In production, you might want to send this to an error reporting service
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void): void => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds.`);
};

const utils = {
  STORAGE_KEYS,
  ZAMBIAN_VEHICLE_MAKES,
  COVERAGE_OPTIONS,
  formatCurrency,
  saveFormData,
  loadFormData,
  clearFormData,
  getStoredTheme,
  setStoredTheme,
  createDebouncedFunction,
  validateZambianPhone,
  generateId,
  generateQuotePDF,
  logError,
  measurePerformance,
};

export default utils;
