export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  signatureName: string;
  signatureTitle: string;
}

export interface ClientInfo {
  name:string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceDetails {
  number: string;
  issueDate: string;
  dueDate: string;
}

export interface DispatchInfo {
  clientNameId: string;
  customerOrder: string;
  customerAccount: string;
  releaseCode: string;
  dispatchDate: string;
  dispatchType: string;
  pmName: string;
}

export interface InvoiceData {
  business: BusinessInfo;
  client: ClientInfo;
  details: InvoiceDetails;
  dispatch: DispatchInfo;
  lineItems: LineItem[];
  notes: string;
}

export type InvoiceField = 
  | ['business', keyof BusinessInfo]
  | ['client', keyof ClientInfo]
  | ['details', keyof InvoiceDetails]
  | ['dispatch', keyof DispatchInfo];