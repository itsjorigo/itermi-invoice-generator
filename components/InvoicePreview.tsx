import React from 'react';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  previewRef: React.RefObject<HTMLDivElement>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, previewRef }) => {
  const subtotal = invoice.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const totalTax = invoice.lineItems.reduce((acc, item) => acc + (item.quantity * item.price * (item.tax / 100)), 0);
  const total = subtotal + totalTax;

  return (
    <div className="p-4 bg-gray-100 min-h-full">
      <div ref={previewRef} className="bg-white p-10 shadow-lg rounded-sm max-w-4xl mx-auto" style={{ fontFamily: 'sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            {invoice.business.logo ? (
              <img src={invoice.business.logo} alt="Company Logo" className="h-20 object-contain" />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{invoice.business.name}</h1>
            )}
             <div className="text-sm text-gray-500 mt-2">
                <p>{invoice.business.address}</p>
                <p>{invoice.business.phone}</p>
                <p>{invoice.business.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-400 uppercase">Invoice</h2>
            <p className="text-sm text-gray-500 mt-2"># {invoice.details.number}</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Billed To</h3>
            <p className="font-bold text-base text-gray-800">{invoice.client.name}</p>
            <p className="text-sm text-gray-500">{invoice.client.address}</p>
            <p className="text-sm text-gray-500">{invoice.client.phone}</p>
            <p className="text-sm text-gray-500">{invoice.client.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">&nbsp;</h3>
            <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-semibold text-gray-500">Client Name #: </span>{invoice.dispatch.clientNameId}</p>
                <p><span className="font-semibold text-gray-500">Customer Order #: </span>{invoice.dispatch.customerOrder}</p>
                <p><span className="font-semibold text-gray-500">Customer Account #: </span>{invoice.dispatch.customerAccount}</p>
                <p><span className="font-semibold text-gray-500">Release Code #: </span>{invoice.dispatch.releaseCode}</p>
                <p><span className="font-semibold text-gray-500">Dispatch Date: </span>{invoice.dispatch.dispatchDate}</p>
                <p><span className="font-semibold text-gray-500">Dispatch Type: </span>{invoice.dispatch.dispatchType}</p>
                <p><span className="font-semibold text-gray-500">PM's Name: </span>{invoice.dispatch.pmName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-500">Issue Date</p>
              <p className="text-sm text-gray-800">{invoice.details.issueDate}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Due Date</p>
              <p className="text-sm text-gray-800">{invoice.details.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="flow-root">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-8">
            <div className="w-full max-w-xs">
                <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium text-gray-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Taxes</span>
                    <span className="text-sm font-medium text-gray-800">{formatCurrency(totalTax)}</span>
                </div>
                <div className="flex justify-between py-3 bg-gray-100 px-4 rounded-md mt-2">
                    <span className="font-bold text-gray-800 text-base">Total</span>
                    <span className="font-bold text-gray-800 text-base">{formatCurrency(total)}</span>
                </div>
            </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-12">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h4>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Signature */}
        <div className="mt-20 pt-10 border-t border-gray-200 text-sm">
            <p className="text-gray-600 mb-10">Thank you for your business!</p>
            <p className="text-gray-800 mb-2">...................................</p>
            <p className="text-gray-800 font-semibold">{invoice.business.signatureName}</p>
            <p className="text-gray-600">{invoice.business.signatureTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;