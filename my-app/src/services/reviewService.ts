import { apiClient } from "../utils/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";
import type { ProductReviewResponse, ReviewCreationRequest, ReviewStatsResponse, ReviewStatisticsResponse, SentimentStatsResponse } from "../types/reviewTypes";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload a single image file to Cloudinary using unsigned upload.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadReviewImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload ảnh thất bại");
  }

  const data = await res.json();
  return data.secure_url as string;
}

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

export const getAllReviews = async (): Promise<ProductReviewResponse[]> => {
  const res = await apiClient.get<ApiResponse<ProductReviewResponse[]>>(
    API_CONFIG.ENDPOINTS.REVIEW.GET_ALL
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch all reviews");
  }
  return api.data;
};

export const getSentimentStats = async (): Promise<SentimentStatsResponse> => {
  const res = await apiClient.get<ApiResponse<SentimentStatsResponse>>(
    API_CONFIG.ENDPOINTS.REVIEW.GET_SENTIMENT_STATS
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch sentiment stats");
  }
  return api.data;
};

export const getReviewStatistics = async (): Promise<ReviewStatisticsResponse> => {
  const res = await apiClient.get<ApiResponse<ReviewStatisticsResponse>>(
    API_CONFIG.ENDPOINTS.REVIEW.GET_STATISTICS
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch review statistics");
  }
  return api.data;
};
