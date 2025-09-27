import { useState, useCallback } from 'react';
import { InvoiceData, LineItem } from '../types';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
}

const hardcodedLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBmaWxsPSIjM2I4MmY2Ii8+PC9zdmc+';

const initialLineItem: LineItem = {
  id: crypto.randomUUID(),
  name: 'Item Name',
  description: 'Item description',
  quantity: 1,
  price: 100,
  tax: 0,
};

const initialState: InvoiceData = {
  business: {
    name: 'Your Company',
    address: '123 Business St, City, State 12345',
    phone: '(123) 456-7890',
    email: 'contact@yourcompany.com',
    logo: hardcodedLogo,
    signatureName: 'Sujeewa Kariyakarawana',
    signatureTitle: 'Principal Consultant',
  },
  client: {
    name: 'Client Name',
    address: '456 Client Ave, City, State 12345',
    phone: '(987) 654-3210',
    email: 'client@email.com',
  },
  details: {
    number: 'INV-001',
    issueDate: getTodayDate(),
    dueDate: getDueDate(),
  },
  dispatch: {
    clientNameId: 'US Renal Care Inc',
    customerOrder: '339038',
    customerAccount: '65282',
    releaseCode: 'N/A',
    dispatchDate: '7/30/25 9:00',
    dispatchType: 'Hot Hands',
    pmName: 'Ioanna Tsioplakis',
  },
  lineItems: [initialLineItem],
  notes: 'Additional notes and payment instructions.',
};

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<InvoiceData>(initialState);

  const updateField = useCallback(<T extends 'business' | 'client' | 'details' | 'dispatch', K extends keyof InvoiceData[T]>(section: T, field: K, value: InvoiceData[T][K]) => {
    setInvoice(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);
  
  const updateLineItem = useCallback((index: number, field: keyof LineItem, value: string | number) => {
    setInvoice(prev => {
      const newLineItems = [...prev.lineItems];
      const item = { ...newLineItems[index] };
      // FIX: Corrected a TypeScript error by checking the property name (`field`) directly
      // instead of its value's type. This allows TypeScript to correctly infer the type of
      // `item[field]` on the left side of the assignment, resolving the "not assignable to type 'never'" error.
      if (field === 'quantity' || field === 'price' || field === 'tax') {
        item[field] = Number(value) || 0;
      } else {
        item[field] = String(value);
      }
      newLineItems[index] = item;
      return { ...prev, lineItems: newLineItems };
    });
  }, []);

  const addLineItem = useCallback(() => {
    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...initialLineItem, id: crypto.randomUUID(), name: '', description: '' }]
    }));
  }, []);

  const removeLineItem = useCallback((index: number) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  }, []);

  const updateNotes = useCallback((value: string) => {
    setInvoice(prev => ({ ...prev, notes: value }));
  }, []);

  return {
    invoice,
    updateField,
    updateLineItem,
    addLineItem,
    removeLineItem,
    updateNotes,
  };
};