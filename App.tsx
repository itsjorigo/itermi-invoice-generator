import React, { useRef, useState, useCallback } from 'react';
import { useInvoice } from './hooks/useInvoice';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import Header from './components/Header';
import DownloadIcon from './components/icons/DownloadIcon';

// Declare global variables from CDN for TypeScript
declare const html2canvas: any;
declare const jspdf: any;

const App: React.FC = () => {
  const { 
    invoice, 
    updateField, 
    updateLineItem, 
    addLineItem, 
    removeLineItem, 
    updateNotes 
  } = useInvoice();

  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!invoice.business.name) newErrors.businessName = "Company name is required.";
    if (!invoice.client.name) newErrors.clientName = "Client name is required.";
    if (!invoice.details.number) newErrors.invoiceNumber = "Invoice number is required.";
    if (invoice.lineItems.length === 0) newErrors.lineItems = "At least one line item is required.";
    
    invoice.lineItems.forEach((item, index) => {
      if (!item.name) newErrors[`itemName${index}`] = `Item name for row ${index + 1} is required.`;
      if (item.quantity <= 0) newErrors[`itemQty${index}`] = `Quantity for row ${index + 1} must be positive.`;
      if (item.price <= 0) newErrors[`itemPrice${index}`] = `Price for row ${index + 1} must be positive.`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [invoice]);


  const handleDownloadPDF = async () => {
    if (!validateForm()) {
        alert("Please fill out all required fields before generating the PDF.");
        return;
    }

    if (!previewRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, 
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      
      const imgWidth = pdfWidth;
      const imgHeight = imgWidth / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`Invoice-${invoice.details.number}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
                <>
                    <DownloadIcon className="w-5 h-5 mr-2"/>
                    Download PDF
                </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-150px)]">
          <div className="lg:overflow-y-auto lg:pr-4">
            <InvoiceForm
              invoice={invoice}
              updateField={updateField}
              updateLineItem={updateLineItem}
              addLineItem={addLineItem}
              removeLineItem={removeLineItem}
              updateNotes={updateNotes}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg lg:overflow-y-auto">
            <InvoicePreview invoice={invoice} previewRef={previewRef} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;