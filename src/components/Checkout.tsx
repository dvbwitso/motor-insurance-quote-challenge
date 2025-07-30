import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils';
import { QuoteFormData } from '../types';

interface CheckoutProps {
  formData: QuoteFormData;
  selectedPlan: {
    id: 'basic' | 'standard' | 'premium';
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
  };
  onBack: () => void;
  onComplete: (paymentDetails: PaymentDetails) => void;
}

interface PaymentDetails {
  method: 'airtel' | 'mtn' | 'zamtel' | 'card';
  phoneNumber?: string;
  transactionId?: string;
  amount: number;
  frequency: 'monthly' | 'annual';
}

const Checkout: React.FC<CheckoutProps> = ({ formData, selectedPlan, onBack, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'mtn' | 'zamtel' | 'card'>('airtel');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'annual'>('monthly');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const paymentAmount = paymentFrequency === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice;
  const savings = paymentFrequency === 'annual' ? (selectedPlan.monthlyPrice * 12) - selectedPlan.annualPrice : 0;

  const mobileMoneyProviders = [
    {
      id: 'airtel' as const,
      name: 'Airtel Money',
      logo: '📱',
      color: 'bg-red-500',
      prefix: '097, 095',
      description: 'Pay with Airtel Money'
    },
    {
      id: 'mtn' as const,
      name: 'MTN Mobile Money',
      logo: '💳',
      color: 'bg-yellow-500',
      prefix: '096, 076',
      description: 'Pay with MTN MoMo'
    },
    {
      id: 'zamtel' as const,
      name: 'Zamtel Kwacha',
      logo: '💰',
      color: 'bg-green-500',
      prefix: '095, 094',
      description: 'Pay with Zamtel Kwacha'
    }
  ];

  const handlePaymentSubmit = async () => {
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }

    setIsProcessing(true);
    setShowConfirmation(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentDetails: PaymentDetails = {
        method: paymentMethod,
        phoneNumber,
        transactionId: `HIQ${Date.now()}`,
        amount: paymentAmount,
        frequency: paymentFrequency
      };
      
      setIsProcessing(false);
      onComplete(paymentDetails);
    }, 3000);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const zambianPhone = /^(\+260|0)?[789]\d{8}$/;
    return zambianPhone.test(phone);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Purchase
            </h1>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-hobbiton-dark-green font-medium">Quote</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-hobbiton-red font-medium">Payment</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4">
              {/* Plan Details */}
              <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {selectedPlan.name} Coverage
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formData.vehicleMake} {formData.vehicleModel} ({formData.vehicleYear})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-hobbiton-red">
                      {formatCurrency(paymentAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {paymentFrequency === 'monthly' ? '/month' : '/year'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Vehicle Value:</span>
                  <span className="font-medium">{formatCurrency(formData.vehicleValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                  <span className="font-medium capitalize">{formData.usage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Policy Holder:</span>
                  <span className="font-medium">{formData.fullName}</span>
                </div>
              </div>

              {/* Savings Badge */}
              {paymentFrequency === 'annual' && savings > 0 && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">
                        You save {formatCurrency(savings)} with annual payment!
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Payment Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Frequency
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'monthly', label: 'Monthly', price: selectedPlan.monthlyPrice },
                  { value: 'annual', label: 'Annual', price: selectedPlan.annualPrice }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentFrequency === option.value
                        ? 'border-hobbiton-red bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-sm text-hobbiton-red font-semibold">
                        {formatCurrency(option.price)}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={paymentFrequency === option.value}
                      onChange={(e) => setPaymentFrequency(e.target.value as 'monthly' | 'annual')}
                      className="h-4 w-4 text-hobbiton-red border-gray-300 focus:ring-hobbiton-red"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                {mobileMoneyProviders.map((provider) => (
                  <label
                    key={provider.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === provider.id
                        ? 'border-hobbiton-red bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={provider.id}
                      checked={paymentMethod === provider.id}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="h-4 w-4 text-hobbiton-red border-gray-300 focus:ring-hobbiton-red mr-3"
                    />
                    <div className={`w-8 h-8 rounded-full ${provider.color} flex items-center justify-center text-white mr-3`}>
                      {provider.logo}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {provider.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {provider.description} • {provider.prefix}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 0971234567"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-hobbiton-red focus:border-transparent
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                  phoneNumber && !validatePhoneNumber(phoneNumber)
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {phoneNumber && !validatePhoneNumber(phoneNumber) && (
                <p className="text-red-600 text-sm mt-1">
                  Please enter a valid Zambian phone number
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handlePaymentSubmit}
              disabled={!phoneNumber || !validatePhoneNumber(phoneNumber) || isProcessing}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                !phoneNumber || !validatePhoneNumber(phoneNumber) || isProcessing
                  ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-hobbiton-red hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
              }`}
              whileHover={!isProcessing ? { scale: 1.02 } : {}}
              whileTap={!isProcessing ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay ${formatCurrency(paymentAmount)} with ${mobileMoneyProviders.find(p => p.id === paymentMethod)?.name}`
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-hobbiton-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Payment Confirmation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Please check your phone for a payment prompt from {mobileMoneyProviders.find(p => p.id === paymentMethod)?.name}
              </p>
              <div className="text-sm text-gray-500">
                Amount: <span className="font-semibold">{formatCurrency(paymentAmount)}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
