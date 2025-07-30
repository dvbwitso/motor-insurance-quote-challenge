import React, { useState, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FormStep1 from '../components/FormStep1';
import FormStep2 from '../components/FormStep2';
import Header from '../components/Header';
import Footer from '../components/Footer';

import QuotePreviewCard from '../components/QuotePreviewCard';
import { QuoteFormData } from '../types';
import { saveFormData, loadFormData, clearFormData } from '../utils';
import { useFocusTrap } from '../hooks/useFocusTrap';


const QuoteForm: React.FC = () => {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan as 'basic' | 'standard' | 'premium' | undefined;
  const methods = useForm<QuoteFormData>({ 
    mode: 'onBlur',
    defaultValues: {
      coverageType: selectedPlan || 'standard' // Use selected plan from navigation or default
    }
  });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const focusTrapRef = useFocusTrap({ active: true });

  const { watch, setValue } = methods;
  const watchedFields = watch();

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      Object.entries(savedData.data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          setValue(key as keyof QuoteFormData, value);
        }
      });
      setStep(savedData.step);
      // If a plan was selected from navigation, override saved plan
      if (selectedPlan) {
        setValue('coverageType', selectedPlan);
      }
    } else if (selectedPlan) {
      setValue('coverageType', selectedPlan);
    }
  }, [setValue, selectedPlan]);

  // Save form data on changes (debounced through the utility)
  useEffect(() => {
    const subscription = methods.watch((data) => {
      const nonEmptyData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
      );
      if (Object.keys(nonEmptyData).length > 0) {
        saveFormData(nonEmptyData, step);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, step]);

  const handleNext = useCallback(() => {
    setStep(2);
  }, []);

  const handleBack = useCallback(() => {
    setStep(1);
  }, []);



  const handleSubmit = useCallback((data: QuoteFormData) => {
    clearFormData(); // Clear saved data since we're submitting
    navigate('/result', { state: { formData: data } });
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-hobbiton-light-grey to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header />
      <main 
        className="flex-grow container mx-auto px-4 py-8" 
        role="main"
        ref={focusTrapRef}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Motor Insurance Quote
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Get a personalized motor insurance quote tailored for Zambian drivers in just 2 simple steps
            </p>
            
            {/* Progress indicator */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1 ? 'bg-hobbiton-red text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Personal Info</span>
              </div>
              <div className={`w-16 h-1 rounded-full ${
                step >= 2 ? 'bg-hobbiton-red' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2 ? 'bg-hobbiton-red text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Info</span>
              </div>
            </motion.div>
          </motion.div>


          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                <FormProvider {...methods}>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FormStep1 onNext={handleNext} />
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FormStep2 onBack={handleBack} onSubmit={handleSubmit} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormProvider>
              </div>
            </motion.div>

            {/* Quote Preview Sidebar */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <QuotePreviewCard 
                  formData={watchedFields}
                  className="animate-fade-in"
                />
                
                {/* Helpful Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-hobbiton-dark-green text-white rounded-xl p-6"
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Pro Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li>• Newer vehicles typically get better rates</li>
                    <li>• Comprehensive coverage offers better protection</li>
                    <li>• Your quote is saved automatically</li>
                    <li>• All quotes are valid for 30 days</li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>


        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default QuoteForm;