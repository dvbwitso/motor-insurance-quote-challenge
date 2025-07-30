import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header', () => {
  test('renders company name', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('Hobbiton Insurance')).toBeInTheDocument();
  });

  test('renders navigation link', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('company name link has proper aria-label', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByLabelText('Hobbiton Insurance - Home')).toBeInTheDocument();
  });
});
