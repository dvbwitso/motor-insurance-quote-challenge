import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  test('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 Hobbiton Technologies Limited/)).toBeInTheDocument();
  });

  test('has proper role attribute', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('is responsive', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('p-4');
  });

  test('renders privacy policy link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /privacy policy/i });
    expect(link).toBeInTheDocument();
  });
});
