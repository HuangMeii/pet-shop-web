export type PaymentStatus = string;

export interface PurchaseDetailCreationRequest {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface PurchaseCreationRequest {
    staffId: string;
    supplierId: string;
    purchaseDetails: PurchaseDetailCreationRequest[];
}

export interface PurchaseDetailResponse {
    id: string;
    productId: string;
    productName?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface PurchaseResponseStaff {
    id: string;
    user?: { id: string; username?: string };
    shift: number;
}

export interface PurchaseResponseSupplier {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: string;
}

export interface PurchaseResponse {
    id: string;
    staff?: PurchaseResponseStaff;
    supplier?: PurchaseResponseSupplier;
    totalAmount: number;
    status: PaymentStatus;
    purchaseDetails?: PurchaseDetailResponse[];
    createdAt: string;
}
