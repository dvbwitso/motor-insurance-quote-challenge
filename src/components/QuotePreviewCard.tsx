import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, createDebouncedFunction } from '../utils';
import { QuoteFormData, QuotePreview } from '../types';
import { calculateQuickQuote } from '../services/api';

interface QuotePreviewCardProps {
  formData: Partial<QuoteFormData>;
  className?: string;
}

const QuotePreviewCard: React.FC<QuotePreviewCardProps> = ({ formData, className = '' }) => {
  const [preview, setPreview] = useState<QuotePreview>({
        quarterlyPremium: 0,
    annualPremium: 0,
    isLoading: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  // Debounced quote calculation
  const debouncedCalculateQuote = createDebouncedFunction(async (data: Partial<QuoteFormData>) => {
    if (!data.vehicleValue || !data.coverageType) {
      setPreview(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setPreview(prev => ({ ...prev, isLoading: true }));
      
      const result = await calculateQuickQuote(data);
      
      if (result) {
                setPreview({
                    quarterlyPremium: result.quarterlyPremium || 0,
          annualPremium: result.annualPremium || 0,
          isLoading: false,
        });
        
        setIsVisible(true);
      } else {
        setPreview(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Preview calculation error:', error);
      setPreview(prev => ({ ...prev, isLoading: false }));
    }
  }, 500); // Reduced debounce time for faster preview

  useEffect(() => {
    debouncedCalculateQuote(formData);
  }, [formData, debouncedCalculateQuote]);

  const hasRequiredData = formData.vehicleValue && formData.coverageType && formData.vehicleYear;

  if (!hasRequiredData && !preview.isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {(isVisible || preview.isLoading) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`quote-preview-card ${className}`}
        >
          <div className="bg-gradient-to-br from-hobbiton-red to-red-600 text-white rounded-xl shadow-xl p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: preview.isLoading ? 360 : 0 }}
                  transition={{ duration: 1, repeat: preview.isLoading ? Infinity : 0, ease: 'linear' }}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-semibold">Instant Quote Preview</h3>
              </div>

              <AnimatePresence mode="wait">
                {preview.isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse">
                        <div className="h-4 bg-white/30 rounded w-20"></div>
                      </div>
                      <span className="text-white/70">Calculating...</span>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-8 bg-white/30 rounded w-32"></div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-2"
                  >
                    <div className="flex items-baseline gap-2">
                      <motion.span
                    key={preview.quarterlyPremium}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold"
                      >
                    {formatCurrency(preview.quarterlyPremium)}
                      </motion.span>
                      <span className="text-white/80">per quarter</span>
                    </div>
                    
                    <div className="text-sm text-white/70">
                      {formatCurrency(preview.annualPremium)} annually
                    </div>

                    {formData.coverageType && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mt-3"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {formData.coverageType.charAt(0).toUpperCase() + formData.coverageType.slice(1)} Coverage
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-white/20"
              >
                <p className="text-xs text-white/60">
                  * This is an estimated quote. Final premium may vary based on additional factors.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuotePreviewCard;
