import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import FormStep1 from '../FormStep1';
import { QuoteFormData } from '../../types';

const FormStep1Wrapper = ({ onNext }: { onNext: () => void }) => {
  const methods = useForm<QuoteFormData>();
  return (
    <FormProvider {...methods}>
      <FormStep1 onNext={onNext} />
    </FormProvider>
  );
};

describe('FormStep1', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
  });

  test('renders all form fields', () => {
    render(<FormStep1Wrapper onNext={mockOnNext} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<FormStep1Wrapper onNext={mockOnNext} />);
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<FormStep1Wrapper onNext={mockOnNext} />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', () => {
    render(<FormStep1Wrapper onNext={mockOnNext} />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('noValidate');
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
    
    // Check ARIA attributes
    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput).toHaveAttribute('aria-describedby');
  });

  test('successfully submits with valid data', async () => {
    render(<FormStep1Wrapper onNext={mockOnNext} />);
    
    // Fill out the form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(phoneInput, '+260123456789');
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalled();
    });
  });
});
