import type { InventoryResponse } from "../types/inventoryTypes";
import type { ApiResponse } from "../types/apiResponse";
import { apiClient } from "../utils/apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const getInventory = async (): Promise<InventoryResponse> => {
    const res = await apiClient.get<ApiResponse<InventoryResponse>>(
        API_CONFIG.ENDPOINTS.INVENTORY.GET
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get inventory failed");
    }
    return apiRes.data;
};
