import { apiClient } from "../utils/apiClient";
import type {
    SupplierResponse,
    SupplierCreationRequest,
    SupplierUpdateRequest,
} from "../types/supplierTypes";
import type { ApiResponse } from "../types/apiResponse";
import { API_CONFIG } from "../config/apiConfig";

export const createSupplier = async (
    request: SupplierCreationRequest
): Promise<SupplierResponse> => {
    const res = await apiClient.post<ApiResponse<SupplierResponse>>(
        API_CONFIG.ENDPOINTS.SUPPLIER.CREATE,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create supplier failed");
    }
    return apiRes.data;
};

export const getAllSuppliers = async (): Promise<SupplierResponse[]> => {
    const res = await apiClient.get<ApiResponse<SupplierResponse[]>>(
        API_CONFIG.ENDPOINTS.SUPPLIER.GET_ALL
    );
    return res.data?.data ?? [];
};

export const getSupplierById = async (
    id: string
): Promise<SupplierResponse> => {
    const res = await apiClient.get<ApiResponse<SupplierResponse>>(
        API_CONFIG.ENDPOINTS.SUPPLIER.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get supplier failed");
    }
    return apiRes.data;
};

export const updateSupplier = async (
    id: string,
    request: SupplierUpdateRequest
): Promise<SupplierResponse> => {
    const res = await apiClient.put<ApiResponse<SupplierResponse>>(
        API_CONFIG.ENDPOINTS.SUPPLIER.UPDATE(id),
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Update supplier failed");
    }
    return apiRes.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.SUPPLIER.DELETE(id));
};
