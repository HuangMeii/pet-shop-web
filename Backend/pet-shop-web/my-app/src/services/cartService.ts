import type { CartRequest } from "../types/cartTypes";
import type { CartResponse } from "../types/cartTypes";
import type { ApiResponse } from "../types/apiResponse";
import { apiClient } from "../utils/apiClient";
import { API_CONFIG } from "../config/apiConfig";

/**
 * Add or update a cart item. Pass quantity 0 to remove the item.
 */
export const addOrUpdateCartItem = async (
    customerId: string,
    request: CartRequest
): Promise<CartResponse> => {
    const res = await apiClient.post<ApiResponse<CartResponse>>(
        API_CONFIG.ENDPOINTS.CUSTOMER.ADD_CART_ITEM(customerId),
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Cập nhật giỏ hàng thất bại");
    }
    return apiRes.data;
};
