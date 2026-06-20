import type { UserCreationRequest } from "../types/userTypes";
import type { CustomerResponse, CustomerUpdateRequest } from "../types/customerTypes";
import type { ApiResponse } from "../types/apiResponse";
import { apiClient } from "../utils/apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const createCustomer = async (
    credentials: UserCreationRequest
): Promise<CustomerResponse> => {
    const res = await apiClient.post<ApiResponse<CustomerResponse>>(
        API_CONFIG.ENDPOINTS.CUSTOMER.CREATE,
        credentials
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Đăng ký thất bại");
    }
    return apiRes.data;
};

/** @deprecated Use createCustomer */
export const register = createCustomer;

export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
    const res = await apiClient.get<ApiResponse<CustomerResponse[]>>(
        API_CONFIG.ENDPOINTS.CUSTOMER.GET_ALL
    );
    return res.data?.data ?? [];
};

export const getCustomerById = async (id: string): Promise<CustomerResponse> => {
    const res = await apiClient.get<ApiResponse<CustomerResponse>>(
        API_CONFIG.ENDPOINTS.CUSTOMER.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get customer failed");
    }
    return apiRes.data;
};

export const getInfo = async (): Promise<CustomerResponse> => {
    const res = await apiClient.get<ApiResponse<CustomerResponse>>(
        API_CONFIG.ENDPOINTS.CUSTOMER.GET_INFO
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get info failed");
    }
    return apiRes.data;
};

export const updateCustomer = async (
    id: string,
    request: CustomerUpdateRequest
): Promise<CustomerResponse> => {
    const res = await apiClient.put<ApiResponse<CustomerResponse>>(
        API_CONFIG.ENDPOINTS.CUSTOMER.UPDATE(id),
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Update customer failed");
    }
    return apiRes.data;
};

export const addPoints = async (
    id: string,
    points: number
): Promise<CustomerResponse> => {
    const endpoint = `${API_CONFIG.ENDPOINTS.CUSTOMER.ADD_POINTS(id)}?points=${points}`;
    const res = await apiClient.post<ApiResponse<CustomerResponse>>(endpoint);
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Add points failed");
    }
    return apiRes.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.CUSTOMER.DELETE(id));
};
