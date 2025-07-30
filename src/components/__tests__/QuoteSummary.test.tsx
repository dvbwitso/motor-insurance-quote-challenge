import { render, screen } from '@testing-library/react';
import QuoteSummary from '../QuoteSummary';
import { QuoteFormData, QuoteResult } from '../../types';

const mockFormData: QuoteFormData = {
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+260123456789',
  vehicleMake: 'Toyota',
  vehicleModel: 'Camry',
  vehicleYear: 2020,
  vehicleValue: 50000,
  coverageType: 'premium'
};

const mockQuote: QuoteResult = {
  quoteId: 'QT-123456',
  monthlyPremium: 500,
  annualPremium: 5500,
  coverageDetails: 'Comprehensive coverage including collision, theft, and fire protection.'
};

describe('QuoteSummary', () => {
  test('renders vehicle information correctly', () => {
    render(<QuoteSummary formData={mockFormData} quote={mockQuote} />);
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText(/K.*50,000/)).toBeInTheDocument();
  });

  test('displays pricing information', () => {
    render(<QuoteSummary formData={mockFormData} quote={mockQuote} />);
    
    expect(screen.getByText(/K.*500/)).toBeInTheDocument(); // Monthly premium
    expect(screen.getByText(/K.*5,500/)).toBeInTheDocument(); // Annual premium
  });

  test('shows quote ID', () => {
    render(<QuoteSummary formData={mockFormData} quote={mockQuote} />);
    
    expect(screen.getByText('QT-123456')).toBeInTheDocument();
  });

  test('displays coverage type description', () => {
    render(<QuoteSummary formData={mockFormData} quote={mockQuote} />);
    
    expect(screen.getByText(/Comprehensive Coverage/)).toBeInTheDocument();
  });

  test('shows coverage details', () => {
    render(<QuoteSummary formData={mockFormData} quote={mockQuote} />);
    
    expect(screen.getByText(mockQuote.coverageDetails)).toBeInTheDocument();
  });

  test('displays included benefits', () => {
    render(<QuoteSummary formData={mockFormData} quote={mockQuote} />);
    
    expect(screen.getByText('24/7 Claims Support')).toBeInTheDocument();
    expect(screen.getByText('Free Roadside Assistance')).toBeInTheDocument();
    expect(screen.getByText('No Hidden Fees')).toBeInTheDocument();
    expect(screen.getByText('Easy Online Claims')).toBeInTheDocument();
  });

  test('calculates annual savings correctly', () => {
    render(<QuoteSummary formData={mockFormData} quote={mockQuote} />);
    
    const expectedSavings = mockQuote.monthlyPremium * 12 - mockQuote.annualPremium;
    expect(screen.getByText(/Save.*K.*500.*annually/)).toBeInTheDocument();
  });

  test('handles different coverage types', () => {
    const basicFormData = { ...mockFormData, coverageType: 'basic' as const };
    render(<QuoteSummary formData={basicFormData} quote={mockQuote} />);
    
    expect(screen.getByText(/Third Party Only/)).toBeInTheDocument();
  });
});
