import { apiClient } from "../utils/apiClient";
import type { StaffResponse, StaffCreationRequest } from "../types/staffTypes";
import type { ApiResponse } from "../types/apiResponse";
import { API_CONFIG } from "../config/apiConfig";

export const createStaff = async (
    request: StaffCreationRequest
): Promise<StaffResponse> => {
    const res = await apiClient.post<ApiResponse<StaffResponse>>(
        API_CONFIG.ENDPOINTS.STAFF.CREATE,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create staff failed");
    }
    return apiRes.data;
};

export const getAllStaff = async (): Promise<StaffResponse[]> => {
    const res = await apiClient.get<ApiResponse<StaffResponse[]>>(
        API_CONFIG.ENDPOINTS.STAFF.GET_ALL
    );
    return res.data?.data ?? [];
};

export const getStaffById = async (id: string): Promise<StaffResponse> => {
    const res = await apiClient.get<ApiResponse<StaffResponse>>(
        API_CONFIG.ENDPOINTS.STAFF.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get staff failed");
    }
    return apiRes.data;
};

// export const getInfo = async (): Promise<StaffResponse> => {
//   const res = await apiClient.get<ApiResponse<StaffResponse>>(
//       API_CONFIG.ENDPOINTS.STAFF.GET_INFO
//   );
//   const apiRes = res.data;
//   if (!apiRes.success || apiRes.data == null) {
//     throw new Error(apiRes.message ?? "Get info failed");
//   }
//   return apiRes.data;
// };

// export const updateStaff = async (
//     id: string,
//     request: StaffUpdateRequest
// ): Promise<StaffResponse> => {
//     const res = await apiClient.put<ApiResponse<StaffResponse>>(
//         API_CONFIG.ENDPOINTS.STAFF.UPDATE(id),
//         request
//     );
//     const apiRes = res.data;
//     if (!apiRes.success || apiRes.data == null) {
//         throw new Error(apiRes.message ?? "Update staff failed");
//     }
//     return apiRes.data;
// };

export const updateStaffShift = async (
    id: string,
    shift: number
): Promise<StaffResponse> => {
    const res = await apiClient.put<ApiResponse<StaffResponse>>(
        API_CONFIG.ENDPOINTS.STAFF.UPDATE_SHIFT(id, shift)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Update shift failed");
    }
    return apiRes.data;
};

export const deleteStaff = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.STAFF.DELETE(id));
};

export const getInfo = async (): Promise<StaffResponse> => {
    const res = await apiClient.get<ApiResponse<StaffResponse>>(
        API_CONFIG.ENDPOINTS.STAFF.GET_INFO
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get info failed");
    }
    return apiRes.data;
};
