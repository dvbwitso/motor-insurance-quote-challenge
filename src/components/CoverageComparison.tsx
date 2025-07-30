import React from 'react';
import { motion } from 'framer-motion';
import { COVERAGE_OPTIONS, formatCurrency } from '../utils';
import { CoverageOption } from '../types';

interface CoverageComparisonProps {
  onCoverageSelect?: (coverage: 'basic' | 'standard' | 'premium') => void;
  selectedCoverage?: 'basic' | 'standard' | 'premium';
  vehicleValue?: number;
  vehicleAge?: number;
  usage?: string;
  className?: string;
  hideSelectButtons?: boolean;
}

const CoverageComparison: React.FC<CoverageComparisonProps> = ({
  onCoverageSelect,
  selectedCoverage,
  vehicleValue = 50000,
  vehicleAge = 5,
  usage = 'personal',
  className = '',
  hideSelectButtons = false,
}) => {
  // Accurate insurance premium calculations based on Zambian market rates
  const calculatePremium = (coverageType: 'basic' | 'standard' | 'premium'): number => {
    // Base rates as percentage of vehicle value (annual)
    const baseRates = {
      basic: 0.015,    // 1.5% for third party
      standard: 0.035, // 3.5% for comprehensive  
      premium: 0.045   // 4.5% for premium
    };

    // Age factor (newer cars cost more to insure)
    const ageFactor = vehicleAge <= 2 ? 1.2 : vehicleAge <= 5 ? 1.0 : vehicleAge <= 10 ? 0.9 : 0.8;
    
    // Usage factor
    const usageFactors = {
      personal: 1.0,
      business: 1.3,
      commercial: 1.8
    };

    const basePremium = vehicleValue * baseRates[coverageType];
    const adjustedPremium = basePremium * ageFactor * (usageFactors[usage as keyof typeof usageFactors] || 1.0);
    
    return Math.round(adjustedPremium);
  };

  const updatedOptions: CoverageOption[] = COVERAGE_OPTIONS.map(option => ({
    ...option,
    price: calculatePremium(option.id),
    monthlyPrice: calculatePremium(option.id) / 12,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -8, scale: 1.02 },
  };

  return (
    <div className={`coverage-comparison ${className}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Choose Your Coverage
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 text-sm"
          >
            Select the plan that fits your needs and budget
          </motion.p>
        </div>

        {/* Coverage Cards - Simplified */}
        <div className="grid md:grid-cols-3 gap-6">
          {updatedOptions.map((option, index) => (
            <motion.div
              key={option.id}
              variants={cardVariants}
              whileHover="hover"
              onClick={() => onCoverageSelect?.(option.id)}
              className={`relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border-2 shadow-md dark:shadow-lg transition-all duration-200 cursor-pointer ${
                selectedCoverage === option.id
                  ? 'border-hobbiton-red ring-2 ring-hobbiton-red/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-hobbiton-red/50'
              } ${option.recommended ? 'ring-1 ring-hobbiton-dark-green' : ''}`}
            >
              {/* Badge */}
              {option.badge && (
                <div className={`absolute -top-2 left-4 px-2 py-1 rounded text-xs font-medium z-10 ${
                  option.recommended
                    ? 'bg-hobbiton-dark-green text-white'
                    : 'bg-hobbiton-red text-white'
                }`}>
                  {option.badge}
                </div>
              )}

              <div className="flex flex-col flex-1 p-5">
                {/* Plan Name & Price */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {option.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold text-hobbiton-red">
                      {formatCurrency(Math.round(option.monthlyPrice))}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatCurrency(option.price)} annually
                  </div>
                </div>

                {/* Key Features - Simplified */}
                <div className="space-y-2 mb-4 flex-1">
                  {option.features.slice(0, 4).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                  {option.features.length > 4 && (
                    <div className="text-xs text-gray-500 mt-2">
                      +{option.features.length - 4} more benefits
                    </div>
                  )}
                </div>

                {/* Select Button */}
                {!hideSelectButtons && (
                  <div className="mt-auto pt-2">
                    <button
                      className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 shadow-sm ${
                        selectedCoverage === option.id
                          ? 'bg-hobbiton-red text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-hobbiton-red hover:text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCoverageSelect?.(option.id);
                      }}
                    >
                      {selectedCoverage === option.id ? '✓ Selected' : 'Select Plan'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coverage Comparison Summary - Minimal */}
        {selectedCoverage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Your Selected Plan: {updatedOptions.find(opt => opt.id === selectedCoverage)?.name}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Monthly Premium</span>
                <div className="font-semibold text-hobbiton-red">
                  {formatCurrency(Math.round(updatedOptions.find(opt => opt.id === selectedCoverage)?.monthlyPrice || 0))}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Annual Premium</span>
                <div className="font-semibold">
                  {formatCurrency(updatedOptions.find(opt => opt.id === selectedCoverage)?.price || 0)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Coverage Type</span>
                <div className="font-semibold capitalize">{selectedCoverage}</div>
              </div>
              <div>
                <span className="text-gray-500">Vehicle Value</span>
                <div className="font-semibold">{formatCurrency(vehicleValue)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CoverageComparison;
