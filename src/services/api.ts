import { QuoteFormData, QuoteResult, PaymentResult } from '../types';
import { createDebouncedFunction } from '../utils';
import { v4 as uuidv4 } from 'uuid';

export const calculateQuote = async (data: QuoteFormData): Promise<QuoteResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Enhanced calculation logic with accurate Zambian insurance rates
  const vehicleValue = data.vehicleValue;
  const vehicleYear = data.vehicleYear;
  const usage = data.usage;

  // Calculate vehicle age factor (newer cars more expensive, older cars cheaper)
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicleYear;
  let ageFactor = 1.0;
  if (vehicleAge <= 1) ageFactor = 1.2;      // 20% increase for new cars
  else if (vehicleAge >= 10) ageFactor = 0.9; // 10% discount for old cars

  // Usage factors for Zambian market
  const usageFactors = {
    personal: 1.0,    // Standard personal use
    business: 1.2,    // 20% increase for business use
    commercial: 1.5   // 50% increase for commercial use
  };

  // Accurate Zambian insurance rates (annual percentage of vehicle value)
  const baseRates = {
    basic: 0.015,    // 1.5% for third party only
    standard: 0.035, // 3.5% for comprehensive  
    premium: 0.045   // 4.5% for premium with extras
  };

  const basePremiumAnnual = vehicleValue * baseRates[data.coverageType] * ageFactor * usageFactors[usage];
  const basePremiumQuarterly = basePremiumAnnual / 4;

  // Professional VAT calculation (16% VAT rate in Zambia)
  const vatRate = 0.16;
  const vatAnnual = basePremiumAnnual * vatRate;
  const vatQuarterly = basePremiumQuarterly * vatRate;
  const totalPremiumAnnual = basePremiumAnnual + vatAnnual;
  const totalPremiumQuarterly = basePremiumQuarterly + vatQuarterly;

  // Enhanced coverage details based on type
  const coverageDescriptions = {
    basic: [
      `Third Party liability coverage for your ${data.vehicleMake} ${data.vehicleModel} (${data.vehicleYear})`,
      'Legal minimum requirements as per Zambian Motor Vehicle Insurance Act',
      'Third-party bodily injury and property damage coverage up to ZMW 50,000',
      '24/7 emergency roadside assistance'
    ],
    standard: [
      `Comprehensive coverage for your ${data.vehicleMake} ${data.vehicleModel} (${data.vehicleYear})`,
      'All third-party benefits included',
      'Theft and hijacking protection',
      'Fire and natural disaster coverage',
      'Windscreen replacement',
      'Towing services',
      'Courtesy car for 3 days',
      'Hospital cash benefit'
    ],
    premium: [
      `Premium Plus coverage for your ${data.vehicleMake} ${data.vehicleModel} (${data.vehicleYear})`,
      'All comprehensive benefits included',
      'Extended courtesy car (7 days)',
      'Personal accident cover up to ZMW 100,000',
      'Personal belongings coverage',
      'Key replacement service',
      'Emergency accommodation',
      'Cross-border coverage for SADC countries',
      'Zero excess on glass claims'
    ]
  };

  return {
    quoteId: uuidv4(),
    quarterlyPremium: Number(totalPremiumQuarterly.toFixed(2)),
    annualPremium: Number(totalPremiumAnnual.toFixed(2)),
    coverageType: data.coverageType,
    coverageDetails: coverageDescriptions[data.coverageType],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    // Professional pricing breakdown
    basePremium: Number(basePremiumAnnual.toFixed(2)),
    vat: Number(vatAnnual.toFixed(2)),
    totalPremium: Number(totalPremiumAnnual.toFixed(2)),
    vatRate: vatRate,
  };
};

// Debounced version for real-time preview
export const calculateQuoteDebounced = createDebouncedFunction(calculateQuote, 800);

// Quick quote calculation for preview (faster, less detailed)
export const calculateQuickQuote = async (data: Partial<QuoteFormData>): Promise<Partial<QuoteResult> | null> => {
  if (!data.vehicleValue || !data.coverageType) {
    return null;
  }

  // Use same accurate calculation logic as main quote function
  const vehicleValue = data.vehicleValue;
  const vehicleYear = data.vehicleYear || new Date().getFullYear();
  const usage = data.usage || 'personal';

  // Calculate age factor (newer cars more expensive, older cars cheaper)
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicleYear;
  let ageFactor = 1.0;
  if (vehicleAge <= 1) ageFactor = 1.2;      // 20% increase for new cars
  else if (vehicleAge >= 10) ageFactor = 0.9; // 10% discount for old cars

  // Usage factors
  const usageFactors = {
    personal: 1.0,
    business: 1.2,
    commercial: 1.5
  };

  // Accurate Zambian insurance rates (annual percentage of vehicle value)
  const baseRates = {
    basic: 0.015,    // 1.5% for third party
    standard: 0.035, // 3.5% for comprehensive  
    premium: 0.045   // 4.5% for premium
  };

  const annualPremium = vehicleValue * baseRates[data.coverageType] * ageFactor * usageFactors[usage];
  const quarterlyPremium = annualPremium / 4;

  return {
    quarterlyPremium: Number(quarterlyPremium.toFixed(2)),
    annualPremium: Number(annualPremium.toFixed(2)),
  };
};

// Save quote to history (could be enhanced to use a real backend)
export const saveQuoteToHistory = (quote: QuoteResult, formData: QuoteFormData): void => {
  try {
    const history = JSON.parse(localStorage.getItem('motor_insurance_quote_history') || '[]');
    const newEntry = {
      ...quote,
      formData,
      timestamp: Date.now(),
    };
    
    history.unshift(newEntry);
    
    // Keep only last 10 quotes
    if (history.length > 10) {
      history.splice(10);
    }
    
    localStorage.setItem('motor_insurance_quote_history', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving quote to history:', error);
  }
};

// Get quote history
export const getQuoteHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('motor_insurance_quote_history') || '[]');
  } catch (error) {
    console.error('Error loading quote history:', error);
    return [];
  }
};

// Professional payment processing
export const processPayment = async (
  quoteData: QuoteResult,
  formData: QuoteFormData,
  paymentMethod: string,
  phoneNumber: string,
  paymentFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual'
): Promise<PaymentResult> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  let paymentAmount = 0;
  if (paymentFrequency === 'quarterly') {
    paymentAmount = quoteData.quarterlyPremium;
  } else if (paymentFrequency === 'annual') {
    paymentAmount = quoteData.annualPremium;
  } else {
    throw new Error('Unsupported payment frequency. Only quarterly and annual payments are allowed.');
  }

  const paymentResult: PaymentResult = {
    transactionId: uuidv4(),
    receiptId: `RCP-${uuidv4().slice(0, 8).toUpperCase()}`,
    paymentMethod,
    amount: paymentAmount,
    status: 'success', // Simulate successful payment
    timestamp: new Date().toISOString(),
    emailSent: false,
  };

  try {
    // Send email receipt
    await sendEmailReceipt(formData.email, paymentResult, quoteData, formData, paymentFrequency);
    paymentResult.emailSent = true;

    // Save payment to history
    savePaymentToHistory(paymentResult, quoteData, formData);

    return paymentResult;
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      ...paymentResult,
      status: 'failed',
      emailSent: false,
    };
  }
};

// Email receipt service (simulated)
export const sendEmailReceipt = async (
  email: string,
  payment: PaymentResult,
  quote: QuoteResult,
  formData: QuoteFormData,
  frequency: string
): Promise<boolean> => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real application, this would integrate with an email service like SendGrid, AWS SES, etc.
  console.log(`📧 Email receipt sent to ${email}:`, {
    receiptId: payment.receiptId,
    transactionId: payment.transactionId,
    amount: payment.amount,
    quoteId: quote.quoteId,
    coverage: quote.coverageType,
    frequency,
    activationTime: 'Immediate - Coverage is now active',
  });

  return true;
};

// Save payment to history
export const savePaymentToHistory = (
  payment: PaymentResult,
  quote: QuoteResult,
  formData: QuoteFormData
): void => {
  try {
    const paymentHistory = JSON.parse(localStorage.getItem('motor_insurance_payment_history') || '[]');
    const newEntry = {
      ...payment,
      quote,
      formData,
      timestamp: Date.now(),
    };
    
    paymentHistory.unshift(newEntry);
    
    // Keep only last 20 payments
    if (paymentHistory.length > 20) {
      paymentHistory.splice(20);
    }
    
    localStorage.setItem('motor_insurance_payment_history', JSON.stringify(paymentHistory));
  } catch (error) {
    console.error('Error saving payment to history:', error);
  }
};

// Get payment history
export const getPaymentHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('motor_insurance_payment_history') || '[]');
  } catch (error) {
    console.error('Error loading payment history:', error);
    return [];
  }
};