import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';


import CoverageComparison from '../components/CoverageComparison';
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = React.useState<'basic' | 'standard' | 'premium' | null>(null);

  // When a plan is selected, navigate to /quote with state
  const handleCoverageSelect = (plan: 'basic' | 'standard' | 'premium') => {
    setSelectedPlan(plan);
    navigate('/quote', { state: { selectedPlan: plan } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />
      {/* Hero Section */}
      <main className="flex-grow" role="main">
        <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                Get Your Motor Insurance Quote
                <span className="block text-blue-600 dark:text-blue-400 mt-2">In 90 Seconds</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Fast, simple, and tailored insurance solutions with Hobbiton. 
                <span className="block mt-2 text-base sm:text-lg text-gray-500 dark:text-gray-400">
                  Protect your vehicle with comprehensive coverage starting from just ZMW 200/month
                </span>
              </p>
            </motion.div>

            {/* Plan selection UI */}
            <div className="mt-8">
              <CoverageComparison
                onCoverageSelect={handleCoverageSelect}
                selectedCoverage={selectedPlan || undefined}
                className="py-12 bg-gray-50 rounded-xl shadow-sm"
                hideSelectButtons={false}
              />
            </div>

            <p id="cta-description" className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Get instant quotes • No hidden fees • Trusted by 10,000+ customers
            </p>
          </div>
        </section>

        {/* Process Section with Calculator */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
                Simple 4-Step Process
              </h2>
            </motion.div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {[
                  { step: '01', title: 'Choose Coverage', desc: 'Select your protection level' },
                  { step: '02', title: 'Personal Information', desc: 'Provide your personal details' },
                  { step: '03', title: 'Vehicle Information', desc: 'Enter your vehicle details' },
                  { step: '04', title: 'Get Quote', desc: 'Instant quote & activation' },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <hr className="my-8 border-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
       {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Why Choose Hobbiton Insurance?
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Instant Quotes</h3>
                <p className="text-gray-600 dark:text-gray-300">Get your personalized quote in under 2 minutes with our streamlined process.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Coverage</h3>
                <p className="text-gray-600">From basic third-party to full comprehensive coverage, we've got you protected.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Prices</h3>
                <p className="text-gray-600">Best rates in Zambia with transparent pricing and no hidden fees.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;