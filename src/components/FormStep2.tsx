import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { ZAMBIAN_VEHICLE_MAKES } from '../utils';
import { QuoteFormData } from '../types';

interface FormStep2Props {
  onBack: () => void;
  onSubmit: (data: QuoteFormData) => void;
}

const FormStep2: React.FC<FormStep2Props> = ({ onBack, onSubmit }) => {
  const { watch, setValue, handleSubmit } = useFormContext<QuoteFormData>();
  const formData = watch();
  const [selectedMake, setSelectedMake] = useState(formData.vehicleMake || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fieldKeys = [
    'vehicleMake',
    'vehicleModel',
    'vehicleYear',
    'vehicleValue',
    'numberPlate',
    'whiteBook',
    'usage',
  ] as const;
  type FieldKey = typeof fieldKeys[number];
  const refs: Record<FieldKey, React.RefObject<HTMLDivElement | null>> = {
    vehicleMake: useRef<HTMLDivElement | null>(null),
    vehicleModel: useRef<HTMLDivElement | null>(null),
    vehicleYear: useRef<HTMLDivElement | null>(null),
    vehicleValue: useRef<HTMLDivElement | null>(null),
    numberPlate: useRef<HTMLDivElement | null>(null),
    whiteBook: useRef<HTMLDivElement | null>(null),
    usage: useRef<HTMLDivElement | null>(null),
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const vehicleUsageOptions = [
    { value: 'personal', label: 'Personal Use', description: 'Daily commuting and personal trips' },
    { value: 'business', label: 'Business Use', description: 'Commercial activities and business travel' },
    { value: 'commercial', label: 'Commercial Use', description: 'Taxi, delivery, or transport services' }
  ];

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setValue('vehicleMake', make);
    setValue('vehicleModel', '');
  };

  const selectedMakeData = ZAMBIAN_VEHICLE_MAKES.find(make => make.name === selectedMake);



  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.vehicleMake) newErrors.vehicleMake = 'Please select a vehicle make.';
    if (!formData.vehicleModel) newErrors.vehicleModel = 'Please select a vehicle model.';
    if (!formData.vehicleYear) newErrors.vehicleYear = 'Please select the year of manufacture.';
    if (!formData.vehicleValue || formData.vehicleValue < 1000) newErrors.vehicleValue = 'Enter a valid vehicle value (min ZMW 1,000).';
    if (!formData.numberPlate) newErrors.numberPlate = 'Please enter your number plate.';
    if (!formData.whiteBook) newErrors.whiteBook = 'Please upload your White Book.';
    if (!formData.usage) newErrors.usage = 'Please select the primary usage.';
    return newErrors;
  };

  const isFormValid = !!(
    formData.vehicleMake &&
    formData.vehicleModel &&
    formData.vehicleYear &&
    formData.vehicleValue && formData.vehicleValue >= 1000 &&
    formData.numberPlate &&
    formData.whiteBook &&
    formData.usage
  );

  const onSubmitForm = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0] as FieldKey;
      refs[firstErrorKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    handleSubmit(onSubmit)();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-hobbiton-primary dark:text-white mb-2">
          Vehicle Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your vehicle to get an accurate quote
        </p>
      </div>

      {/* Vehicle Make */}
      <motion.div ref={refs.vehicleMake}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Vehicle Make *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ZAMBIAN_VEHICLE_MAKES.map((make) => (
            <motion.button
              key={make.name}
              type="button"
              onClick={() => handleMakeChange(make.name)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedMake === make.name
                  ? 'border-hobbiton-primary bg-hobbiton-primary text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-hobbiton-primary dark:hover:border-hobbiton-primary bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-sm font-medium">{make.name}</div>
              {make.popular && (
                <div className="text-xs opacity-75">Popular</div>
              )}
            </motion.button>
          ))}
        </div>
        {errors.vehicleMake && <div className="text-red-600 text-xs mt-1">{errors.vehicleMake}</div>}
      </motion.div>

      {/* Vehicle Model */}
      {selectedMakeData && (
        <motion.div ref={refs.vehicleModel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vehicle Model *
          </label>
          <select
            value={formData.vehicleModel}
            onChange={(e) => setValue('vehicleModel', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-hobbiton-primary focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     transition-all duration-200"
            required
          >
            <option value="">Select a model</option>
            {selectedMakeData.models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          {errors.vehicleModel && <div className="text-red-600 text-xs mt-1">{errors.vehicleModel}</div>}
        </motion.div>
      )}


      {/* Vehicle Year, Value, Number Plate, and White Book Upload */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div ref={refs.vehicleYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Year of Manufacture *
          </label>
          <select
            value={formData.vehicleYear || ''}
            onChange={(e) => setValue('vehicleYear', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-hobbiton-primary focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     transition-all duration-200"
            required
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.vehicleYear && <div className="text-red-600 text-xs mt-1">{errors.vehicleYear}</div>}
        </motion.div>

        <motion.div ref={refs.vehicleValue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vehicle Value (ZMW) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              ZMW
            </span>
            <input
              type="number"
              value={formData.vehicleValue || ''}
              onChange={(e) => setValue('vehicleValue', parseFloat(e.target.value) || 0)}
              placeholder="50,000"
              className="w-full pl-16 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-hobbiton-primary focus:border-transparent
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       transition-all duration-200"
              min="1000"
              max="5000000"
              step="1000"
              required
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Current market value of your vehicle
          </p>
          {errors.vehicleValue && <div className="text-red-600 text-xs mt-1">{errors.vehicleValue}</div>}
        </motion.div>
      </div>

      {/* Number Plate */}
      <motion.div ref={refs.numberPlate}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number Plate *
        </label>
        <input
          type="text"
          value={formData.numberPlate || ''}
          onChange={e => setValue('numberPlate', e.target.value.toUpperCase())}
          placeholder="e.g. ALB 1234"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-hobbiton-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          maxLength={12}
          required
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter your Zambian car number plate (e.g. ALB 1234)</p>
        {errors.numberPlate && <div className="text-red-600 text-xs mt-1">{errors.numberPlate}</div>}
      </motion.div>

      {/* White Book Upload */}
      <motion.div ref={refs.whiteBook}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload White Book (Vehicle Registration) *
        </label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={e => setValue('whiteBook', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          required
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accepted: PDF, JPG, PNG. Max 5MB.</p>
        {errors.whiteBook && <div className="text-red-600 text-xs mt-1">{errors.whiteBook}</div>}
      </motion.div>

      {/* Vehicle Usage */}
      <motion.div ref={refs.usage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Primary Usage *
        </label>
        <div className="grid gap-4">
          {vehicleUsageOptions.map((option) => (
            <motion.label
              key={option.value}
              className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                formData.usage === option.value
                  ? 'border-hobbiton-primary bg-hobbiton-primary/5 dark:bg-hobbiton-primary/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-hobbiton-primary/50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                type="radio"
                name="usage"
                value={option.value}
                checked={formData.usage === option.value}
                onChange={(e) => setValue('usage', e.target.value as 'personal' | 'business' | 'commercial')}
                className="mt-1 h-4 w-4 text-hobbiton-primary border-gray-300 focus:ring-hobbiton-primary"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </div>
              </div>
            </motion.label>
          ))}
        </div>
        {errors.usage && <div className="text-red-600 text-xs mt-1">{errors.usage}</div>}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between pt-6"
      >
        <motion.button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Previous
        </motion.button>

        <motion.button
          type="button"
          onClick={onSubmitForm}
          className={`px-6 py-3 border rounded-lg font-medium transition-all duration-200 ${
            isFormValid
              ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
          }`}
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
        >
          Get Quote
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FormStep2;
