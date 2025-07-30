import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils';
import { QuoteFormData, QuoteResult, PaymentResult } from '../types';
import { processPayment } from '../services/api';
import { Shield, CheckCircle, Clock, Mail, Smartphone, ArrowLeft } from 'lucide-react';

interface ProfessionalCheckoutProps {
  formData: QuoteFormData;
  quoteData: QuoteResult;
  onBack: () => void;
  onPaymentComplete: (paymentResult: PaymentResult) => void;
}

const ProfessionalCheckout: React.FC<ProfessionalCheckoutProps> = ({ 
  formData, 
  quoteData, 
  onBack, 
  onPaymentComplete 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'mtn' | 'zamtel'>('airtel');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'quarterly' | 'semi-annual' | 'annual'>('monthly');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  // Calculate payment amounts based on frequency
  const getPaymentAmount = () => {
    switch (paymentFrequency) {
      case 'quarterly':
        return quoteData.quarterlyPremium;
      case 'annual':
        return quoteData.annualPremium;
      default:
        return 0;
    }
  };

  const getSavings = () => 0;

  const mobileMoneyProviders = [
    {
      id: 'airtel' as const,
      name: 'Airtel Money',
      icon: '📱',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      prefix: '097, 095',
      description: 'Instant payment with Airtel Money'
    },
    {
      id: 'mtn' as const,
      name: 'MTN Mobile Money',
      icon: '💳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      prefix: '096, 076',
      description: 'Secure payment with MTN MoMo'
    },
    {
      id: 'zamtel' as const,
      name: 'Zamtel Kwacha',
      icon: '💰',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      prefix: '095, 094',
      description: 'Pay with Zamtel Kwacha'
    }
  ];

  const frequencyOptions = [
    { id: 'monthly' as const, label: 'Monthly', discount: '0%' },
    { id: 'quarterly' as const, label: 'Quarterly', discount: '5%' },
    { id: 'semi-annual' as const, label: 'Semi-Annual', discount: '8%' },
    { id: 'annual' as const, label: 'Annual', discount: '15%' }
  ];

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\\s+/g, '');
    const zambian = /^(\\+260|260|0)?(09[4-7]|076)\\d{7}$/;
    return zambian.test(cleanPhone);
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      alert('Please enter a valid Zambian mobile number');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      const result = await processPayment(
        quoteData,
        formData,
        paymentMethod,
        phoneNumber,
        paymentFrequency
      );

      setPaymentResult(result);
      
      if (result.status === 'success') {
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentComplete(result);
        }, 3000);
      } else {
        alert('Payment failed. Please try again.');
        setPaymentStep('details');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setPaymentStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Smartphone className="w-8 h-8 text-blue-600" />
            </motion.div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-4">
            Please check your phone for the payment prompt and enter your PIN
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Amount:</strong> {formatCurrency(getPaymentAmount())}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Provider:</strong> {mobileMoneyProviders.find(p => p.id === paymentMethod)?.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong> {phoneNumber}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Processing secure payment...
          </div>
        </motion.div>
      </div>
    );
  }

  if (paymentStep === 'success' && paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your motor insurance is now <strong>active immediately</strong>
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Policy Activation Details
            </h4>
            
            <div className="space-y-2 text-sm">
              <p><strong>Policy ID:</strong> {quoteData.quoteId}</p>
              <p><strong>Receipt ID:</strong> {paymentResult.receiptId}</p>
              <p><strong>Transaction ID:</strong> {paymentResult.transactionId}</p>
              <p><strong>Amount Paid:</strong> {formatCurrency(paymentResult.amount)}</p>
              <p><strong>Coverage:</strong> {quoteData.coverageType.charAt(0).toUpperCase() + quoteData.coverageType.slice(1)}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Active Now</span></p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Email Confirmation</span>
            </div>
            <p className="text-sm text-blue-700">
              {paymentResult.emailSent 
                ? `Receipt and policy documents sent to ${formData.email}`
                : 'Email confirmation will be sent shortly'
              }
            </p>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>✅ Your vehicle is now insured and coverage is active</p>
            <p>✅ Digital policy card available in your email</p>
            <p>✅ 24/7 claims support available</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
              <p className="text-gray-600">Secure payment for your motor insurance</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg p-6 grid md:grid-cols-3 gap-8">
          {/* Payment Details - Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Payment Frequency */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Frequency</h3>
              <div className="grid grid-cols-2 gap-3">
                {frequencyOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setPaymentFrequency(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      paymentFrequency === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-green-600">{option.discount} savings</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                {mobileMoneyProviders.map((provider) => (
                  <motion.button
                    key={provider.id}
                    onClick={() => setPaymentMethod(provider.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === provider.id
                        ? `${provider.borderColor} bg-gray-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${provider.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                        {provider.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{provider.name}</div>
                        <div className="text-sm text-gray-600">{provider.description}</div>
                        <div className="text-sm text-gray-500">Supported: {provider.prefix}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 0977123456"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your {mobileMoneyProviders.find(p => p.id === paymentMethod)?.name} number
              </p>
            </div>
          </div>

          {/* Summary - Right Column */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Base Premium ({paymentFrequency})</span>
                <span>{formatCurrency(getPaymentAmount() / 1.16)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (16%)</span>
                <span>{formatCurrency((getPaymentAmount() / 1.16) * 0.16)}</span>
              </div>
              {getSavings() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Annual Savings</span>
                  <span>-{formatCurrency(getSavings())}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>{formatCurrency(getPaymentAmount())}</span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handlePayment}
              disabled={!phoneNumber || !validatePhoneNumber(phoneNumber) || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              whileHover={{ scale: validatePhoneNumber(phoneNumber) ? 1.02 : 1 }}
              whileTap={{ scale: validatePhoneNumber(phoneNumber) ? 0.98 : 1 }}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(getPaymentAmount())}`}
            </motion.button>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>✅ Secure payment processing</p>
              <p>✅ Instant policy activation</p>
              <p>✅ Email receipt and documents</p>
              <p>✅ 24/7 customer support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCheckout;
