import { apiClient } from "../utils/apiClient";
import type {
    PurchaseResponse,
    PurchaseCreationRequest,
} from "../types/purchaseTypes";
import type { ApiResponse } from "../types/apiResponse";
import { API_CONFIG } from "../config/apiConfig";

export const createPurchase = async (
    request: PurchaseCreationRequest
): Promise<PurchaseResponse> => {
    const res = await apiClient.post<ApiResponse<PurchaseResponse>>(
        API_CONFIG.ENDPOINTS.PURCHASE.CREATE,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create purchase failed");
    }
    return apiRes.data;
};

export const getAllPurchases = async (): Promise<PurchaseResponse[]> => {
    const res = await apiClient.get<ApiResponse<PurchaseResponse[]>>(
        API_CONFIG.ENDPOINTS.PURCHASE.GET_ALL
    );
    return res.data?.data ?? [];
};

export const getPurchaseById = async (id: string): Promise<PurchaseResponse> => {
    const res = await apiClient.get<ApiResponse<PurchaseResponse>>(
        API_CONFIG.ENDPOINTS.PURCHASE.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get purchase failed");
    }
    return apiRes.data;
};

export const deletePurchase = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PURCHASE.DELETE(id));
};
