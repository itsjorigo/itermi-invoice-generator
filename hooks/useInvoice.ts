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

const hardcodedLogo = 'https://itermi.com/wp-content/uploads/2022/09/Itermi_main_logo.svg';


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
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: hardcodedLogo,
    signatureName: '',
    signatureTitle: '',
  },
  client: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  details: {
    number: 'INV-001',
    issueDate: getTodayDate(),
    dueDate: getDueDate(),
  },
  dispatch: {
    clientNameId: '',
    customerOrder: '',
    customerAccount: '',
    releaseCode: '',
    dispatchDate: '',
    dispatchType: '',
    pmName: '',
  },
  lineItems: [initialLineItem],
  notes: '.',
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