import React from 'react';
import { InvoiceData } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface InvoiceFormProps {
  invoice: InvoiceData;
  updateField: (section: 'business' | 'client' | 'details' | 'dispatch', field: any, value: any) => void;
  updateLineItem: (index: number, field: any, value: any) => void;
  addLineItem: () => void;
  removeLineItem: (index: number) => void;
  updateNotes: (value: string) => void;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      {...props}
    />
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  updateField,
  updateLineItem,
  addLineItem,
  removeLineItem,
  updateNotes,
}) => {
  return (
    <div className="p-4">
      <Section title="Your Information">
        <InputField
          label="Company Name"
          value={invoice.business.name}
          onChange={(e) => updateField('business', 'name', e.target.value)}
        />
        <InputField
          label="Address"
          value={invoice.business.address}
          onChange={(e) => updateField('business', 'address', e.target.value)}
        />
        <InputField
          label="Phone"
          value={invoice.business.phone}
          onChange={(e) => updateField('business', 'phone', e.target.value)}
        />
        <InputField
          label="Email"
          type="email"
          value={invoice.business.email}
          onChange={(e) => updateField('business', 'email', e.target.value)}
        />
        <InputField
          label="Signature Name"
          value={invoice.business.signatureName}
          onChange={(e) => updateField('business', 'signatureName', e.target.value)}
        />
        <InputField
          label="Signature Title"
          value={invoice.business.signatureTitle}
          onChange={(e) => updateField('business', 'signatureTitle', e.target.value)}
        />
      </Section>

      <Section title="Client Information">
        <InputField
          label="Client Name"
          value={invoice.client.name}
          onChange={(e) => updateField('client', 'name', e.target.value)}
        />
        <InputField
          label="Client Address"
          value={invoice.client.address}
          onChange={(e) => updateField('client', 'address', e.target.value)}
        />
        <InputField
          label="Client Phone"
          value={invoice.client.phone}
          onChange={(e) => updateField('client', 'phone', e.target.value)}
        />
        <InputField
          label="Client Email"
          type="email"
          value={invoice.client.email}
          onChange={(e) => updateField('client', 'email', e.target.value)}
        />
      </Section>

      <Section title="Dispatch Details">
        <InputField
          label="Client Name #"
          value={invoice.dispatch.clientNameId}
          onChange={(e) => updateField('dispatch', 'clientNameId', e.target.value)}
        />
        <InputField
          label="Customer Order #"
          value={invoice.dispatch.customerOrder}
          onChange={(e) => updateField('dispatch', 'customerOrder', e.target.value)}
        />
        <InputField
          label="Customer Account #"
          value={invoice.dispatch.customerAccount}
          onChange={(e) => updateField('dispatch', 'customerAccount', e.target.value)}
        />
        <InputField
          label="Release Code #"
          value={invoice.dispatch.releaseCode}
          onChange={(e) => updateField('dispatch', 'releaseCode', e.target.value)}
        />
        <InputField
          label="Dispatch Date"
          value={invoice.dispatch.dispatchDate}
          onChange={(e) => updateField('dispatch', 'dispatchDate', e.target.value)}
        />
        <InputField
          label="Dispatch Type"
          value={invoice.dispatch.dispatchType}
          onChange={(e) => updateField('dispatch', 'dispatchType', e.target.value)}
        />
        <InputField
          label="PM's Name"
          value={invoice.dispatch.pmName}
          onChange={(e) => updateField('dispatch', 'pmName', e.target.value)}
        />
      </Section>

      <Section title="Invoice Details">
        <InputField
          label="Invoice Number"
          value={invoice.details.number}
          onChange={(e) => updateField('details', 'number', e.target.value)}
        />
        <div></div> {/* Spacer */}
        <InputField
          label="Issue Date"
          type="date"
          value={invoice.details.issueDate}
          onChange={(e) => updateField('details', 'issueDate', e.target.value)}
        />
        <InputField
          label="Due Date"
          type="date"
          value={invoice.details.dueDate}
          onChange={(e) => updateField('details', 'dueDate', e.target.value)}
        />
      </Section>

      <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Line Items</h3>
        <div className="space-y-4">
          {invoice.lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center border p-2 rounded-md">
              <div className="col-span-12 md:col-span-3">
                 <input placeholder="Item Name" className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary focus:border-primary" value={item.name} onChange={(e) => updateLineItem(index, 'name', e.target.value)} />
              </div>
              <div className="col-span-12 md:col-span-4">
                <input placeholder="Description" className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary focus:border-primary" value={item.description} onChange={(e) => updateLineItem(index, 'description', e.target.value)} />
              </div>
              <div className="col-span-4 md:col-span-1">
                <input type="number" placeholder="Qty" className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary focus:border-primary" value={item.quantity} onChange={(e) => updateLineItem(index, 'quantity', e.target.value)} />
              </div>
              <div className="col-span-4 md:col-span-2">
                <input type="number" placeholder="Price" className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary focus:border-primary" value={item.price} onChange={(e) => updateLineItem(index, 'price', e.target.value)} />
              </div>
              <div className="col-span-3 md:col-span-1">
                <input type="number" placeholder="Tax %" className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary focus:border-primary" value={item.tax} onChange={(e) => updateLineItem(index, 'tax', e.target.value)} />
              </div>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => removeLineItem(index)} className="text-red-500 hover:text-red-700">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addLineItem} className="mt-4 flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Add Item
        </button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Notes</h3>
        <textarea
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            rows={4}
            value={invoice.notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Any additional notes..."
        ></textarea>
      </div>
    </div>
  );
};

export default InvoiceForm;