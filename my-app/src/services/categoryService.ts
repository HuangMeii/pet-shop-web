import { apiClient } from "../utils/apiClient";
import type {
  CategoryResponse,
  CategoryCreationRequest,
  CategoryUpdateRequest,
} from "../types/categoryTypes";
import { API_CONFIG } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";

export const createCategory = async (
    request: CategoryCreationRequest
): Promise<CategoryResponse> => {
  const res = await apiClient.post<ApiResponse<CategoryResponse>>(
      API_CONFIG.ENDPOINTS.CATEGORY.CREATE,
      request
  );

  const apiData = res.data;

  if (!apiData.success || apiData.data == null) {
    throw new Error(apiData.message ?? "Create category failed");
  }

  return apiData.data;
};

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  const res = await apiClient.get<ApiResponse<CategoryResponse[]>>(
      API_CONFIG.ENDPOINTS.CATEGORY.GET_ALL,
      { skipAuth: true }
  );

  const apiData = res.data;

  if (!apiData.success || apiData.data == null) {
    throw new Error(apiData.message ?? "Get categories failed");
  }

  return apiData.data;
};

export const getCategoryById = async (
    id: string
): Promise<CategoryResponse> => {
  const res = await apiClient.get<ApiResponse<CategoryResponse>>(
      API_CONFIG.ENDPOINTS.CATEGORY.GET_BY_ID(id)
  );

  const apiData = res.data;

  if (!apiData.success || apiData.data == null) {
    throw new Error(apiData.message ?? "Get category failed");
  }

  return apiData.data;
};

export const updateCategoryById = async (
    id: string,
    request: CategoryUpdateRequest
): Promise<CategoryResponse> => {
  const res = await apiClient.put<ApiResponse<CategoryResponse>>(
      API_CONFIG.ENDPOINTS.CATEGORY.UPDATE(id),
      request
  );

  const apiData = res.data;

  if (!apiData.success || apiData.data == null) {
    throw new Error(apiData.message ?? "Update category failed");
  }

  return apiData.data;
};

export const deleteCategoryById = async (id: string): Promise<void> => {
  const res = await apiClient.delete<ApiResponse<unknown>>(
    API_CONFIG.ENDPOINTS.CATEGORY.DELETE(id)
  );
  const apiData = res.data;
  if (!apiData.success) {
    throw new Error(apiData.message ?? "Delete category failed");
  }
};