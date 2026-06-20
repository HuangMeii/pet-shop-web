import { apiClient } from "../utils/apiClient";
import type {
    PetResponse,
    PetCreationRequest,
    PetUpdateRequest,
} from "../types/petTypes";
import type { ApiResponse } from "../types/apiResponse";
import { API_CONFIG } from "../config/apiConfig";

export const createPet = async (
    request: PetCreationRequest
): Promise<PetResponse> => {
    const res = await apiClient.post<ApiResponse<PetResponse>>(
        API_CONFIG.ENDPOINTS.PET.CREATE,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create pet failed");
    }
    return apiRes.data;
};

export const getAllPets = async (): Promise<PetResponse[]> => {
    const res = await apiClient.get<ApiResponse<PetResponse[]>>(
        API_CONFIG.ENDPOINTS.PET.GET_ALL,
        {skipAuth : true}
    );
    return res.data?.data ?? [];
};

export const getPetById = async (id: string): Promise<PetResponse> => {
    const res = await apiClient.get<ApiResponse<PetResponse>>(
        API_CONFIG.ENDPOINTS.PET.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get pet failed");
    }
    return apiRes.data;
};

export const getAllPetsPaginated = async (
    page: number,
    size: number
): Promise<PetResponse[]> => {
    const res = await apiClient.get<ApiResponse<PetResponse[]>>(
        API_CONFIG.ENDPOINTS.PET.PAGINATE,
        { params: { page, size } }
    );
    return res.data?.data ?? [];
};

export const updatePet = async (
    id: string,
    request: PetUpdateRequest
): Promise<PetResponse> => {
    const res = await apiClient.put<ApiResponse<PetResponse>>(
        API_CONFIG.ENDPOINTS.PET.UPDATE(id),
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Update pet failed");
    }
    return apiRes.data;
};

export const markAsSold = async (id: string): Promise<PetResponse> => {
    const res = await apiClient.patch<ApiResponse<PetResponse>>(
        API_CONFIG.ENDPOINTS.PET.MARK_SOLD(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Mark as sold failed");
    }
    return apiRes.data;
};

export const deletePet = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PET.DELETE(id));
};
