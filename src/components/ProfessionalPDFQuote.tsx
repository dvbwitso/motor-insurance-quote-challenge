import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { QuoteResult, QuoteFormData } from '../types';
import { Download, FileText } from 'lucide-react';

interface ProfessionalPDFQuoteProps {
  quoteData: QuoteResult;
  formData: QuoteFormData;
  className?: string;
}

const ProfessionalPDFQuote: React.FC<ProfessionalPDFQuoteProps> = ({
  quoteData,
  formData,
  className = '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProfessionalPDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      
      let yPosition = margin;

      // Professional header with company info
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HOBBITON INVESTMENT', margin, 15);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Motor Insurance Services | Licensed by PIMA Zambia', margin, 20);
      
      yPosition = 35;

      // Quote title, ID, and date
      pdf.setTextColor(0, 0, 0);
      // Ensure correct mapping for plan name
      let planName = '';
      switch (quoteData.coverageType) {
        case 'basic':
          planName = 'Third Party Insurance';
          break;
        case 'standard':
          planName = 'Standard Comprehensive Insurance';
          break;
        case 'premium':
          planName = 'Comprehensive Insurance with Extras';
          break;
        default:
          planName = quoteData.coverageType;
      }

      // Plan Name (bold, larger)
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text(planName, margin, yPosition);
      yPosition += 7;

      // Quote ID and Date
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
      pdf.text(`Quote ID: ${quoteData.quoteId.slice(0, 8)}`, margin, yPosition);
      pdf.text(`Date: ${dateStr}`, margin + 70, yPosition);
      yPosition += 7;

      // Plate Number (smaller, normal)
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Plate Number: ${formData.numberPlate}`, margin, yPosition);
      yPosition += 8;

      // Section: Personal Details
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Personal Details', margin, yPosition);
      yPosition += 6;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${formData.fullName || '-'}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Phone: ${formData.phone || '-'}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Email: ${formData.email || '-'}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`NRC: ${formData.nrc || '-'}`, margin, yPosition);
      yPosition += 8;

      // Section: Vehicle Details
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Vehicle Details', margin, yPosition);
      yPosition += 6;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Make: ${formData.vehicleMake}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Model: ${formData.vehicleModel}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Year: ${formData.vehicleYear}`, margin, yPosition);
      yPosition += 8;

      // Section: Coverage Details
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Coverage Details', margin, yPosition);
      yPosition += 6;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      quoteData.coverageDetails.forEach((detail) => {
        if (yPosition > 220) return; // Prevent overflow
        pdf.text(`• ${detail}`, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Professional Pricing Table
      // Table header
      pdf.setFillColor(0, 0, 0);
      pdf.rect(margin, yPosition, contentWidth, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Breakdown', margin + 5, yPosition + 7);
      yPosition += 13;

      // Table rows (example: breakdown of premium, VAT, total)
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      // You can adjust these values as per your quoteData structure
      const { basePremium, vat, totalPremium } = quoteData;
      pdf.text('Base Premium:', margin + 5, yPosition);
      pdf.text(`${basePremium ? basePremium.toLocaleString('en-US', { style: 'currency', currency: 'ZMW' }) : '-'}`, margin + 60, yPosition);
      yPosition += 6;
      pdf.text('VAT (16%):', margin + 5, yPosition);
      pdf.text(`${vat ? vat.toLocaleString('en-US', { style: 'currency', currency: 'ZMW' }) : '-'}`, margin + 60, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Premium:', margin + 5, yPosition);
      pdf.text(`${totalPremium ? totalPremium.toLocaleString('en-US', { style: 'currency', currency: 'ZMW' }) : '-'}`, margin + 60, yPosition);
      pdf.setFont('helvetica', 'normal');
      yPosition += 10;

      // Notes section
      pdf.setFontSize(9);
      const notes = [
        '• Coverage becomes active immediately upon payment confirmation',
        '• Policy documents will be sent to your registered email address',
        '• Premium includes 16% VAT as per Zambian tax regulations',
        '• This quote is valid for 30 days from the date of issue',
        '• For claims and support, contact us 24/7 at +260-XXX-XXXX',
        '• Licensed and regulated by PIMA (Pension and Insurance Authority) Zambia'
      ];
      notes.forEach((note, index) => {
        pdf.text(note, margin + 5, yPosition + (index * 5));
      });
      yPosition += notes.length * 5 + 5;



      // Footer
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Hobbiton Investment Ltd. | Lusaka, Zambia | info@hobbitoninvestment.zm | www.hobbitoninvestment.zm', 
               margin, pageHeight - 8);

      // Save the PDF
      pdf.save(`Motor-Insurance-Quote-${quoteData.quoteId.slice(0, 8)}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      onClick={generateProfessionalPDF}
      disabled={isGenerating}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 
        bg-gray-900 hover:bg-gray-800 text-white
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        border border-gray-700 hover:border-gray-600
        ${className}
      `}
      whileHover={{ scale: isGenerating ? 1 : 1.02 }}
      whileTap={{ scale: isGenerating ? 1 : 0.98 }}
    >
      {isGenerating ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      <span>
        {isGenerating ? 'Generating PDF...' : 'Download Quote'}
      </span>
      <FileText className="w-4 h-4 opacity-70" />
    </motion.button>
  );
};

export default ProfessionalPDFQuote;
