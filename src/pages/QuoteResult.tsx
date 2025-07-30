import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfessionalPDFQuote from '../components/ProfessionalPDFQuote';
import ProfessionalCheckout from '../components/ProfessionalCheckout';
import { QuoteFormData, QuoteResult as QuoteResultType, PaymentResult } from '../types';
import { formatCurrency } from '../utils';
import { calculateQuote } from '../services/api';
import { CheckCircle, Shield, ArrowLeft, Star, Clock, Mail } from 'lucide-react';

const QuoteResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'quote' | 'checkout' | 'confirmation'>('quote');
  const [quoteData, setQuoteData] = useState<QuoteResultType | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formData = location.state?.formData as QuoteFormData;

  useEffect(() => {
    if (!formData) {
      navigate('/quote');
      return;
    }

    // Generate professional quote with VAT calculations
    const generateQuote = async () => {
      try {
        setIsLoading(true);
        const result = await calculateQuote(formData);
        setQuoteData(result);
      } catch (error) {
        console.error('Error generating quote:', error);
        navigate('/quote');
      } finally {
        setIsLoading(false);
      }
    };

    generateQuote();
  }, [formData, navigate]);

  const handleCheckout = () => {
    setCurrentStep('checkout');
  };

  const handlePaymentComplete = (result: PaymentResult) => {
    setPaymentResult(result);
    setCurrentStep('confirmation');
  };

  const handleBackToQuote = () => {
    setCurrentStep('quote');
  };

  const handleNewQuote = () => {
    navigate('/quote');
  };

  if (!formData) {
    return null;
  }

  if (isLoading || !quoteData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hobbiton-red mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Generating your professional quote...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="py-8 px-4">
          <ProfessionalCheckout
            formData={formData}
            quoteData={quoteData}
            onBack={handleBackToQuote}
            onPaymentComplete={handlePaymentComplete}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center"
            >
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Your motor insurance policy is now <span className="font-semibold text-green-600">instantly active</span> and ready to protect you on the road.
              </p>

              {/* Policy Active Banner */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                  <span className="font-semibold text-green-800 dark:text-green-300">Policy Active</span>
                </div>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Your coverage is effective immediately. You're fully protected and road-legal.
                </p>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Payment Details
                  </h3>
                  <div>
                    <span className="text-gray-500">Transaction ID:</span>
                    <div className="font-mono font-semibold">{paymentResult?.transactionId}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Method:</span>
                    <div className="font-semibold capitalize">
                      {paymentResult?.paymentMethod === 'airtel' ? 'Airtel Money' :
                       paymentResult?.paymentMethod === 'mtn' ? 'MTN Mobile Money' :
                       paymentResult?.paymentMethod === 'zamtel' ? 'Zamtel Kwacha' : 'Card'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount Paid:</span>
                    <div className="font-semibold text-hobbiton-red">
                      {formatCurrency(paymentResult?.amount || 0)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    Policy Information
                  </h3>
                  <div>
                    <span className="text-gray-500">Policy ID:</span>
                    <div className="font-mono font-semibold">#{quoteData.quoteId}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Coverage Type:</span>
                    <div className="font-semibold capitalize">
                      {(() => {
                        const coverageNames = {
                          basic: 'Third Party Insurance',
                          standard: 'Comprehensive Insurance',
                          premium: 'Premium Plus Insurance'
                        };
                        return coverageNames[quoteData.coverageType] || quoteData.coverageType;
                      })()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Valid Until:</span>
                    <div className="font-semibold">{quoteData.validUntil}</div>
                  </div>
                </div>
              </div>

              {/* Email Confirmation Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-center text-blue-800 dark:text-blue-300">
                  <Mail className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    Policy documents and receipt have been sent to <strong>{formData.email}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <ProfessionalPDFQuote
                  formData={formData}
                  quoteData={quoteData}
                  className="flex-1"
                />
                <button
                  onClick={handleNewQuote}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Get Another Quote
                </button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main quote display


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Your Professional Quote is Ready!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  We've calculated a competitive rate for your vehicle with comprehensive coverage options.
                </p>
              </div>

              {/* Quote Cards */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Main Quote Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-hobbiton-red to-red-600 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Your Quote
                        </h2>
                        <span className="text-sm text-red-100 dark:text-red-200 bg-red-800/30 px-3 py-1 rounded-full">
                          #{quoteData.quoteId}
                        </span>
                      </div>
                      <Shield className="w-8 h-8 text-red-200" />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Premium Breakdown */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-200">Base :</span>
                          <span className="font-semibold text-lg dark:text-white">{formatCurrency(quoteData.basePremium!)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-200">VAT (16%):</span>
                          <span className="font-semibold text-lg dark:text-white">{formatCurrency(quoteData.vat!)}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg px-4">
                          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total :</span>
                          <span className="text-3xl font-bold text-hobbiton-red dark:text-white">{formatCurrency(quoteData.totalPremium!)}</span>
                        </div>
                      </div>

                      {/* Payment Options */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Payment Options:</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Quarterly</div>
                            <div className="font-bold text-lg dark:text-white">{formatCurrency(quoteData.quarterlyPremium)}</div>
                          </div>
                          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-600 dark:text-green-300 mb-1">Annual</div>
                            <div className="font-bold text-lg text-green-800 dark:text-white">{formatCurrency(quoteData.annualPremium)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validity */}
                  <div className="text-sm text-gray-500 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 px-6 py-4">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Valid until: {quoteData.validUntil}
                  </div>
                </motion.div>

                {/* Coverage Details Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Shield className="w-6 h-6 text-blue-600 mr-2" />
                    Coverage Details
                  </h3>

                  {/* Vehicle Info */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-300">Vehicle:</span>
                        <div className="font-semibold capitalize dark:text-white">{formData.vehicleMake} {formData.vehicleModel}</div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-300">Plate Number:</span>
                        <div className="font-semibold dark:text-white">{formData.numberPlate}</div>
                      </div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-300">Year:</span>
                        <div className="font-semibold dark:text-white">{formData.vehicleYear}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-300">Value:</span>
                        <div className="font-semibold dark:text-white">{formatCurrency(formData.vehicleValue)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-300">Coverage:</span>
                        <div className="font-semibold capitalize flex items-center dark:text-white">
                          {(() => {
                            const coverageNames = {
                              basic: 'Third Party Insurance',
                              standard: 'Comprehensive Insurance',
                              premium: 'Premium Plus Insurance'
                            };
                            return coverageNames[quoteData.coverageType] || quoteData.coverageType;
                          })()}
                          {quoteData.coverageType === 'premium' && <Star className="w-4 h-4 text-yellow-500 ml-1" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">What's Included:</h4>
                    <div className="space-y-2">
                      {quoteData.coverageDetails.map((detail, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-white">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-hobbiton-red hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Purchase Policy - Instant Activation
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <ProfessionalPDFQuote
                        formData={formData}
                        quoteData={quoteData}
                        className="w-full justify-center"
                      />
                      
                      <button
                        onClick={() => navigate('/quote')}
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Modify Quote
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuoteResult;
