import React, { memo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DarkModeToggle from './DarkModeToggle';


const Header: React.FC = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  // Close on route change (optional, for SPA navigation)
  // useEffect(() => {
  //   setMobileOpen(false);
  // }, [location.pathname]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-hobbiton-red to-red-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg transition-all duration-300"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                <Link 
                  to="/" 
                  className="hover:text-white/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg px-2 py-1"
                  aria-label="Hobbiton Investment - Motor Insurance Home"
                >
                  Hobbiton Investment
                </Link>
              </h1>
              <p className="text-white/80 text-sm hidden sm:block">Motor Insurance Solutions</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg px-3 py-2 font-medium"
                tabIndex={0}
              >
                Home
              </Link>
              <Link 
                to="/quote" 
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg px-3 py-2 font-medium"
                tabIndex={0}
              >
                Get Quote
              </Link>
            </nav>

            <DarkModeToggle />

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile navigation */}
        <motion.div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`md:hidden mt-4 pt-4 border-t border-white/20 ${mobileOpen ? '' : 'hidden'}`}
          initial={false}
          animate={mobileOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col gap-2">
            <Link 
              to="/" 
              className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg px-3 py-2 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/quote" 
              className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg px-3 py-2 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Get Quote
            </Link>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
});

Header.displayName = 'Header';

export default Header;