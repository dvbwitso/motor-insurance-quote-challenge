import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuoteSummary from '../components/QuoteSummary';
import { QuoteFormData, QuoteResult } from '../types';

const Confirmation: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.formData || !state?.quote) {
    navigate('/quote');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Quote Confirmed</h1>
        <QuoteSummary formData={state.formData as QuoteFormData} quote={state.quote as QuoteResult} />
        <p className="text-center mt-4">
          Thank you for choosing Hobbiton Insurance! We’ll contact you at {state.formData.email} to finalize your policy.
        </p>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confirmation;