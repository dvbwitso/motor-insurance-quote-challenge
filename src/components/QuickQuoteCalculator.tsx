import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Car, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils';

interface QuickQuoteCalculatorProps {
  className?: string;
}

const QuickQuoteCalculator: React.FC<QuickQuoteCalculatorProps> = ({ className = '' }) => {
  const [vehicleValue, setVehicleValue] = useState<number>(50000);
  const currentYear = new Date().getFullYear();
  const [vehicleYear, setVehicleYear] = useState<number>(currentYear - 5);
  const [coverageType, setCoverageType] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [usage, setUsage] = useState<'personal' | 'business' | 'commercial'>('personal');
  const [estimatedPremium, setEstimatedPremium] = useState<number>(0);

  const calculateEstimate = () => {
    // Base rates
    const baseRates = {
      basic: 0.015,    // 1.5%
      standard: 0.035, // 3.5%
      premium: 0.045   // 4.5%
    };

    const usageFactors = {
      personal: 1.0,
      business: 1.2,
      commercial: 1.5
    };

    // Year factor: newer cars pay more, older cars pay less
    // 0-3 years old: +10%, 4-8 years: no change, 9-15 years: -10%, 16+ years: -20%
    const age = currentYear - vehicleYear;
    let yearFactor = 1.0;
    if (age <= 3) yearFactor = 1.1;
    else if (age >= 9 && age <= 15) yearFactor = 0.9;
    else if (age > 15) yearFactor = 0.8;

    const basePremium = vehicleValue * baseRates[coverageType] * usageFactors[usage] * yearFactor;
    const vatAmount = basePremium * 0.16; // 16% VAT
    const totalAnnual = basePremium + vatAmount;
    const monthlyPremium = totalAnnual / 12;

    setEstimatedPremium(monthlyPremium);
  };

  useEffect(() => {
    calculateEstimate();
  }, [vehicleValue, coverageType, usage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <Calculator className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Quick Quote Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Vehicle Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Value (ZMW)
          </label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              value={vehicleValue}
              onChange={(e) => setVehicleValue(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="50000"
              min="1000"
              max="1000000"
            />
          </div>
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={vehicleValue}
            onChange={(e) => setVehicleValue(Number(e.target.value))}
            className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        {/* Vehicle Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Model Year
          </label>
          <input
            type="number"
            value={vehicleYear}
            onChange={(e) => setVehicleYear(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={currentYear - 40}
            max={currentYear}
            placeholder={(currentYear - 5).toString()}
          />
        </div>

        {/* Coverage Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coverage Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'basic', label: 'Basic', desc: '1.5%' },
              { id: 'standard', label: 'Standard', desc: '3.5%' },
              { id: 'premium', label: 'Premium', desc: '4.5%' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setCoverageType(option.id as typeof coverageType)}
                className={`p-3 text-center border rounded-lg transition-colors ${
                  coverageType === option.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Usage Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usage Type
          </label>
          <select
            value={usage}
            onChange={(e) => setUsage(e.target.value as typeof usage)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="personal">Personal Use</option>
            <option value="business">Business Use (+20%)</option>
            <option value="commercial">Commercial Use (+50%)</option>
          </select>
        </div>

        {/* Result */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Estimated Monthly Premium</div>
              <div className="text-2xl font-bold text-blue-600 flex items-center">
                <DollarSign className="w-5 h-5 mr-1" />
                {formatCurrency(estimatedPremium)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Annual: {formatCurrency(estimatedPremium * 12)} (incl. 16% VAT)
              </div>
            </div>
            <div className="text-right">
              <motion.div
                key={estimatedPremium}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                QUOTE
              </motion.div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-3">
            * This is an estimate. Get an accurate quote with our full application.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Get Accurate Quote
          className="w-full bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-900 py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors font-medium"
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickQuoteCalculator;
