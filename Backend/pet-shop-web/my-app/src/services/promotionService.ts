import { apiClient } from "../utils/apiClient";
import type {
    PromotionResponse,
    PromotionCreationRequest,
} from "../types/promotionTypes";
import type { ApiResponse } from "../types/apiResponse";
import { API_CONFIG } from "../config/apiConfig";

export const createPromotion = async (
    request: PromotionCreationRequest
): Promise<PromotionResponse> => {
    const res = await apiClient.post<ApiResponse<PromotionResponse>>(
        API_CONFIG.ENDPOINTS.PROMOTION.CREATE,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create promotion failed");
    }
    return apiRes.data;
};

export const getAllPromotions = async (): Promise<PromotionResponse[]> => {
    const res = await apiClient.get<ApiResponse<PromotionResponse[]>>(
        API_CONFIG.ENDPOINTS.PROMOTION.GET_ALL
    );
    return res.data?.data ?? [];
};

export const getPromotionById = async (
    id: string
): Promise<PromotionResponse> => {
    const res = await apiClient.get<ApiResponse<PromotionResponse>>(
        API_CONFIG.ENDPOINTS.PROMOTION.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get promotion failed");
    }
    return apiRes.data;
};

export const deletePromotion = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PROMOTION.DELETE(id));
};
