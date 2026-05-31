import type { PromotionResponse } from "./promotionTypes";

export type PaymentMethod = string;
export type PaymentStatus = string;

export interface InvoiceDetailCreationRequest {
    productId?: string;
    petId?: string;
    quantity: number;
}

export interface InvoiceCreationRequest {
    staffId?: string;
    customerId: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    invoiceDetails: InvoiceDetailCreationRequest[];
}

export interface ReviewDetailRequest {
    productId: string;
    quantity: number;
}

export interface ReviewRequest {
    customerId: string;
    shippingAddress: string;
    details: ReviewDetailRequest[];
}

export interface InvoiceStatusUpdateRequest {
    paymentStatus: PaymentStatus;
}

export interface ReviewDetailResponse {
    productId: string;
    productName: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discountAmount: number;
}

export interface ReviewResponse {
    customerName: string;
    shippingAddress: string;
    totalAmount: number;
    realAmount: number;
    reviewDetails: ReviewDetailResponse[];
}

export interface InvoiceDetailResponse {
    id: string;
    productId?: string;
    productName?: string;
    petId?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discountAmount?: number;
}

export interface InvoiceResponse {
    id: string;
    staffId?: string;
    staffName?: string;
    customerId: string;
    customerName?: string;
    totalAmount: number;
    realAmount: number;
    paymentMethod: PaymentMethod;
    shippingAddress: string;
    promotion?: PromotionResponse;
    status: PaymentStatus;
    createdAt: string;
    invoiceDetails?: InvoiceDetailResponse[];
}
