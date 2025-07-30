import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QuoteResult, QuoteFormData } from '../types';
import { formatCurrency } from '../utils';

interface PDFQuoteDownloadProps {
  quoteData: QuoteResult;
  formData: QuoteFormData;
  className?: string;
}

const PDFQuoteDownload: React.FC<PDFQuoteDownloadProps> = ({
  quoteData,
  formData,
  className = '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Create a temporary div with the quote content for PDF generation
      const pdfContent = document.createElement('div');
      pdfContent.style.width = '210mm';
      pdfContent.style.minHeight = '297mm';
      pdfContent.style.padding = '20mm';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '0';

      const currentDate = new Date().toLocaleDateString('en-ZM', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      pdfContent.innerHTML = `
        <div style="max-width: 170mm; margin: 0 auto;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #DC2626; padding-bottom: 20px;">
            <h1 style="color: #DC2626; font-size: 28px; margin: 0; font-weight: bold;">
              Hobbiton Investment
            </h1>
            <p style="color: #065F46; font-size: 16px; margin: 5px 0 0 0; font-weight: 600;">
              Motor Insurance Quote
            </p>
          </div>

          <!-- Quote Information -->
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #374151; font-size: 20px; margin: 0 0 15px 0;">Quote Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #374151;">Quote ID:</strong><br>
                <span style="color: #6B7280;">${quoteData.quoteId}</span>
              </div>
              <div>
                <strong style="color: #374151;">Date:</strong><br>
                <span style="color: #6B7280;">${currentDate}</span>
              </div>
              <div>
                <strong style="color: #374151;">Coverage Type:</strong><br>
                <span style="color: #6B7280;">${formData.coverageType.charAt(0).toUpperCase() + formData.coverageType.slice(1)}</span>
              </div>
              <div>
                <strong style="color: #374151;">Valid Until:</strong><br>
                <span style="color: #6B7280;">${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZM')}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px;">
              Customer Information
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #374151;">Full Name:</strong><br>
                <span style="color: #6B7280;">${formData.fullName}</span>
              </div>
              <div>
                <strong style="color: #374151;">Email:</strong><br>
                <span style="color: #6B7280;">${formData.email}</span>
              </div>
              <div>
                <strong style="color: #374151;">Phone:</strong><br>
                <span style="color: #6B7280;">${formData.phone}</span>
              </div>
            </div>
          </div>

          <!-- Vehicle Information -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px;">
              Vehicle Information
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #374151;">Make & Model:</strong><br>
                <span style="color: #6B7280;">${formData.vehicleMake} ${formData.vehicleModel}</span>
              </div>
              <div>
                <strong style="color: #374151;">Year:</strong><br>
                <span style="color: #6B7280;">${formData.vehicleYear}</span>
              </div>
              <div>
                <strong style="color: #374151;">Vehicle Value:</strong><br>
                <span style="color: #6B7280;">${formatCurrency(formData.vehicleValue)}</span>
              </div>
            </div>
          </div>

          <!-- Premium Information -->
          <div style="background: linear-gradient(135deg, #DC2626, #B91C1C); color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: white; font-size: 22px; margin: 0 0 20px 0;">Premium Breakdown</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; margin-bottom: 5px;">
                  ${formatCurrency(quoteData.quarterlyPremium)}
                </div>
                <div style="color: rgba(255,255,255,0.8);">Quarterly Premium</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; margin-bottom: 5px;">
                  ${formatCurrency(quoteData.annualPremium)}
                </div>
                <div style="color: rgba(255,255,255,0.8);">Annual Premium</div>
              </div>
            </div>
          </div>

          <!-- Coverage Details -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px;">
              Coverage Details
            </h2>
            <div style="background: #ECFDF5; padding: 15px; border-radius: 8px; border-left: 4px solid #065F46;">
              <p style="color: #374151; margin: 0; line-height: 1.6;">
                ${quoteData.coverageDetails}
              </p>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px;">
              Important Notes
            </h2>
            <ul style="color: #6B7280; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>This quote is valid for 30 days from the date of issue</li>
              <li>Final premium may vary based on additional underwriting requirements</li>
              <li>All premiums are quoted in Zambian Kwacha (ZMW)</li>
              <li>Coverage is subject to policy terms and conditions</li>
              <li>To proceed with this quote, please contact us within the validity period</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="margin-top: 40px; text-align: center; border-top: 2px solid #E5E7EB; padding-top: 20px;">
            <div style="color: #065F46; font-weight: 600; margin-bottom: 10px;">
              Hobbiton Investment - Motor Insurance Division
            </div>
            <div style="color: #6B7280; font-size: 14px; line-height: 1.4;">
              Lusaka, Zambia | Phone: +260-XXX-XXXX | Email: insurance@hobbiton.zm<br>
              Licensed by the Pensions and Insurance Authority (PIA)
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(pdfContent);

      // Generate canvas from the content
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
      });

      // Remove the temporary element
      document.body.removeChild(pdfContent);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new page if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const fileName = `Motor_Insurance_Quote_${quoteData.quoteId}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generatePDF}
      disabled={isGenerating}
      className={`inline-flex items-center gap-3 bg-hobbiton-dark-green hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${className}`}
    >
      <motion.div
        animate={{ rotate: isGenerating ? 360 : 0 }}
        transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: 'linear' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </motion.div>
      
      <span>
        {isGenerating ? 'Generating PDF...' : 'Download Quote PDF'}
      </span>
    </motion.button>
  );
};

export default PDFQuoteDownload;
