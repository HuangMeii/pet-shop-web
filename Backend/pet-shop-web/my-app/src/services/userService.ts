import { apiClient } from "../utils/apiClient";
import type {
    UserResponse,
    UserCreationRequest,
    UserUpdateRequest,
    ChangePasswordRequest,
} from "../types/userTypes";
import type { ApiResponse } from "../types/apiResponse";
import { API_CONFIG } from "../config/apiConfig";

export const createUser = async (
    request: UserCreationRequest
): Promise<UserResponse> => {
    const res = await apiClient.post<ApiResponse<UserResponse>>(
        API_CONFIG.ENDPOINTS.USER.CREATE,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create user failed");
    }
    return apiRes.data;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
    const res = await apiClient.get<ApiResponse<UserResponse[]>>(
        API_CONFIG.ENDPOINTS.USER.GET_ALL
    );
    return res.data?.data ?? [];
};

export const getUserById = async (id: string): Promise<UserResponse> => {
    const res = await apiClient.get<ApiResponse<UserResponse>>(
        API_CONFIG.ENDPOINTS.USER.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get user failed");
    }
    return apiRes.data;
};

export const getInfo = async (): Promise<UserResponse> => {
    const res = await apiClient.get<ApiResponse<UserResponse>>(
        API_CONFIG.ENDPOINTS.USER.GET_INFO
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get info failed");
    }
    return apiRes.data;
};

export const updateUser = async (
    id: string,
    request: UserUpdateRequest
): Promise<UserResponse> => {
    const res = await apiClient.put<ApiResponse<UserResponse>>(
        API_CONFIG.ENDPOINTS.USER.UPDATE(id),
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Update user failed");
    }
    return apiRes.data;
};

export const updatePassword = async (
    id: string,
    request: ChangePasswordRequest
): Promise<void> => {
    const res = await apiClient.post<ApiResponse<unknown>>(
        API_CONFIG.ENDPOINTS.USER.UPDATE_PASSWORD(id),
        request
    );
    const apiRes = res.data;
    if (!apiRes.success) {
        throw new Error(apiRes.message ?? "Update password failed");
    }
};

export const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.USER.DELETE(id));
};
