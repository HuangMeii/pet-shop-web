import { apiClient } from "../utils/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";
import type { ProductReviewResponse, ReviewCreationRequest, ReviewStatsResponse } from "../types/reviewTypes";

export const createReview = async (
  customerId: string,
  request: ReviewCreationRequest
): Promise<ProductReviewResponse> => {
  const res = await apiClient.post<ApiResponse<ProductReviewResponse>>(
    API_CONFIG.ENDPOINTS.REVIEW.CREATE(customerId),
    request
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Create review failed");
  }
  return api.data;
};

export const getReviewsByProductId = async (
  productId: string
): Promise<ProductReviewResponse[]> => {
  const res = await apiClient.get<ApiResponse<ProductReviewResponse[]>>(
    API_CONFIG.ENDPOINTS.REVIEW.GET_BY_PRODUCT(productId)
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch reviews");
  }
  return api.data;
};

export const getReviewStats = async (
  productId: string
): Promise<ReviewStatsResponse> => {
  const res = await apiClient.get<ApiResponse<ReviewStatsResponse>>(
    API_CONFIG.ENDPOINTS.REVIEW.GET_STATS(productId)
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch review stats");
  }
  return api.data;
};

export const getReviewsByCustomerId = async (
  customerId: string
): Promise<ProductReviewResponse[]> => {
  const res = await apiClient.get<ApiResponse<ProductReviewResponse[]>>(
    API_CONFIG.ENDPOINTS.REVIEW.GET_BY_CUSTOMER(customerId)
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch customer reviews");
  }
  return api.data;
};
