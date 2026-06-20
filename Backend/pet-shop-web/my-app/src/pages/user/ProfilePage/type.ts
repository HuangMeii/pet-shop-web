
export interface Address {
  id: string;
  label: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface AddressFormData {
  id: string;
  name: string;
  phone: string;
  location: string;
  address: string;
  type: "house" | "office";
}

export interface Invoice {
  id: string;
  date: string;
  status: "Paid" | "Pending" | "Cancelled";
  totalAmount: number;
  items: number;
}