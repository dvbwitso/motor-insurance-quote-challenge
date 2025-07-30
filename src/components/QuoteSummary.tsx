
// QuoteSummary displays a summary of the user's insurance quote, including vehicle details, coverage, and pricing.
import { memo } from 'react';
import { QuoteResult, QuoteFormData } from '../types';

interface QuoteSummaryProps {
  formData: QuoteFormData;
  quote: QuoteResult;
}


const QuoteSummary: React.FC<QuoteSummaryProps> = memo(({ formData, quote }) => {
  // Format a number as Zambian Kwacha currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Return a human-readable description for the selected coverage type
  const getCoverageDescription = (coverageType: string) => {
    switch (coverageType) {
      case 'basic':
        return 'Third Party Only - Covers damage to other vehicles and property';
      case 'standard':
        return 'Third Party + Fire & Theft - Includes fire damage and theft protection';
      case 'premium':
        return 'Comprehensive Coverage - Full protection including own damage';
      default:
        return coverageType;
    }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header section with quote ID */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Insurance Quote</h2>
        <p className="text-gray-600">Quote ID: <span className="font-mono text-sm">{quote.quoteId}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Information */}
        <div className="space-y-6">
          {/* Vehicle details card */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Vehicle Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Make & Model:</span>
                <span className="font-medium text-gray-900">
                  {formData.vehicleMake} {formData.vehicleModel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-medium text-gray-900">{formData.vehicleYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Value:</span>
                <span className="font-medium text-gray-900">{formatCurrency(formData.vehicleValue)}</span>
              </div>
            </div>
          </div>

          <div>
            {/* Coverage type card */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.268-3l-.347.684a1 1 0 01-1.343.386L14 10m5.268-3L19 7v3l-.732-.732zM16 17.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
              </svg>
              Coverage Type
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {formData.coverageType}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {getCoverageDescription(formData.coverageType)}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="space-y-6">
          {/* Pricing details card */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Pricing Details
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Quarterly Premium:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(quote.quarterlyPremium)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Annual Premium:</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(quote.annualPremium)}
                    </span>
                    {/* No monthly savings, so this is removed */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Benefits */}
          {/* List of included benefits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What's Included
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                24/7 Claims Support
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Roadside Assistance
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No Hidden Fees
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Easy Online Claims
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Details */}
      {/* Detailed coverage description */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Details</h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-700 text-sm leading-relaxed">{quote.coverageDetails}</p>
        </div>
      </div>
    </div>
  );
});

// Set display name for React DevTools
QuoteSummary.displayName = 'QuoteSummary';

export default QuoteSummary;