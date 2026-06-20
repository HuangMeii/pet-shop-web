import axios from "axios";

const PAYMENT_BASE_URL = "http://localhost:3000/api/payment";

export interface CreatePaymentLinkRequest {
  amount: number;
  description?: string;
  orderId?: string;
  items?: { name: string; quantity: number; price: number }[];
}

export interface PaymentLinkResponse {
  orderCode: string;
  checkoutUrl: string;
  qrCode?: string;
  status?: string;
}

export const createPaymentLink = async (
  request: CreatePaymentLinkRequest
): Promise<PaymentLinkResponse> => {
  const res = await axios.post<PaymentLinkResponse>(
    `${PAYMENT_BASE_URL}/create`,
    request
  );
  return res.data;
};

export const getPaymentStatus = async (
  orderId: string
): Promise<{ status: string }> => {
  const res = await axios.get<{ status: string }>(
    `${PAYMENT_BASE_URL}/status/${orderId}`
  );
  return res.data;
};

export const cancelPayment = async (orderId: string): Promise<unknown> => {
  const res = await axios.post(`${PAYMENT_BASE_URL}/cancel/${orderId}`);
  return res.data;
};
