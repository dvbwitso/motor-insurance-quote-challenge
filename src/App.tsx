import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const QuoteForm = lazy(() => import('./pages/QuoteForm'));
const QuoteResult = lazy(() => import('./pages/QuoteResult'));
const Confirmation = lazy(() => import('./pages/Confirmation'));

// Enhanced loading spinner component with Hobbiton branding
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hobbiton-light-grey to-white dark:from-gray-900 dark:to-gray-800">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-hobbiton-red border-t-transparent rounded-full mx-auto mb-4"
        role="status"
        aria-label="Loading"
      />
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-hobbiton-dark-green dark:text-white mb-2"
      >
        Hobbiton Investment
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 dark:text-gray-300"
      >
        Loading your insurance experience...
      </motion.p>
      <span className="sr-only">Loading application...</span>
    </motion.div>
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add PWA install prompt handling
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show install button or notification
      const installBanner = document.getElementById('pwa-install-banner');
      if (installBanner) {
        installBanner.style.display = 'block';
      }
    });

    // Handle PWA install
    const handleInstallClick = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          }
          deferredPrompt = null;
        });
      }
    };

    // Add event listener to install button if it exists
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.addEventListener('click', handleInstallClick);
    }

    // Cleanup
    return () => {
      if (installButton) {
        installButton.removeEventListener('click', handleInstallClick);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
          >
            {/* PWA Install Banner */}
            <div
              id="pwa-install-banner"
              className="hidden fixed top-0 left-0 right-0 bg-hobbiton-red text-white p-3 text-center z-50 shadow-lg"
            >
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <span className="text-sm">
                  Install our app for a better experience!
                </span>
                <button
                  id="pwa-install-button"
                  className="bg-white text-hobbiton-red px-4 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Install
                </button>
              </div>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quote" element={<QuoteForm />} />
                <Route path="/result" element={<QuoteResult />} />
                <Route path="/confirmation" element={<Confirmation />} />
              </Routes>
            </Suspense>
          </motion.div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;