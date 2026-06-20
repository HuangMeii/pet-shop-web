export interface PromotionDetailCreationRequest {
    productId: string;
}

export interface PromotionCreationRequest {
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
    maxDiscountValue?: number;
    startDate: string;
    endDate: string;
    promotionDetails: PromotionDetailCreationRequest[];
}

export interface PromotionDetailResponse {
    id: string;
    productId: string;
    productName?: string;
}

export interface PromotionResponse {
    id: string;
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
    maxDiscountValue?: number;
    startDate: string;
    endDate: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    promotionDetails?: PromotionDetailResponse[];
}
