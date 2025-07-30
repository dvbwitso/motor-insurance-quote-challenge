import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { QuoteFormData } from '../types';
import { validateZambianPhone } from '../utils';

interface FormStep1Props {
  onNext: () => void;
}

const FormStep1: React.FC<FormStep1Props> = ({ onNext }) => {
  const { register, formState: { errors, isSubmitting }, handleSubmit } = useFormContext<QuoteFormData>();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-hobbiton-red text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm">2</div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Please provide your contact details for your insurance quote</p>
      </motion.div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6" noValidate aria-labelledby="step1-heading">
        <fieldset className="space-y-6">
          <legend className="sr-only">Personal Information Form</legend>

          <motion.div variants={itemVariants}>
            <label htmlFor="nrc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              NRC (National Registration Card) *
            </label>
            <input
              id="nrc"
              type="text"
              {...register('nrc', {
                required: 'NRC is required',
                minLength: { value: 6, message: 'NRC must be at least 6 characters' },
                maxLength: { value: 20, message: 'NRC must be at most 20 characters' },
                pattern: {
                  value: /^[0-9A-Za-z/-]+$/,
                  message: 'NRC should only contain numbers, letters, / and -'
                }
              })}
              className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-hobbiton-red focus:border-hobbiton-red dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm ${
                errors.nrc 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-invalid={errors.nrc ? 'true' : 'false'}
              aria-describedby={errors.nrc ? "nrc-error" : "nrc-help"}
              placeholder="e.g. 123456/78/9"
              autoComplete="off"
              disabled={isSubmitting}
            />
            <div id="nrc-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your Zambian NRC number (e.g. 123456/78/9)
            </div>
            {errors.nrc && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="nrc-error"
                className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center"
                role="alert"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.nrc.message}
              </motion.p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Name should only contain letters and spaces'
                }
              })}
              className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-hobbiton-red focus:border-hobbiton-red dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm ${
                errors.fullName 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={errors.fullName ? "fullName-error" : "fullName-help"}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={isSubmitting}
            />
            <div id="fullName-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your legal name as it appears on your Zambian ID or passport
            </div>
            {errors.fullName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="fullName-error"
                className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center"
                role="alert"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.fullName.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required', 
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                  message: 'Please enter a valid email address' 
                } 
              })}
              className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-hobbiton-red focus:border-hobbiton-red dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm ${
                errors.email 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? "email-error" : "email-help"}
              placeholder="example@email.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
            <div id="email-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              We'll send your quote details and policy documents to this email
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="email-error"
                className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center"
                role="alert"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">🇿🇲</span>
              </div>
              <input
                id="phone"
                type="tel"
                {...register('phone', { 
                  required: 'Phone number is required',
                  validate: (value) => validateZambianPhone(value) || 'Please enter a valid Zambian phone number'
                })}
                className={`mt-1 block w-full pl-12 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-hobbiton-red focus:border-hobbiton-red dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm ${
                  errors.phone 
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                placeholder="+260 XXX XXXXXX or 0XXX XXXXXX"
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </div>
            <div id="phone-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your Zambian mobile number (MTN, Airtel, or Zamtel)
            </div>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="phone-error"
                className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center"
                role="alert"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.phone.message}
              </motion.p>
            )}
          </motion.div>
        </fieldset>

        <motion.div variants={itemVariants} className="pt-6">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-hobbiton-red to-red-600 text-white dark:from-red-700 dark:to-red-900 dark:text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-700 dark:hover:from-red-800 dark:hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            aria-describedby="next-button-help"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                />
                Processing...
              </>
            ) : (
              <>
                Continue to Vehicle Information
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </motion.button>
          <div id="next-button-help" className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Your information is saved automatically as you type
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default FormStep1;
