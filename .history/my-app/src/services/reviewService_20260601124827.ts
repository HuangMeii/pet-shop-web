import { API_CONFIG } from "@/config/apiConfig";
import type { ProductReviewResponse, ReviewCreationRequest, ReviewStatsResponse } from "@/types/reviewTypes";

const BASE_URL = API_CONFIG.BASE_URL;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `HTTP ${response.status}`);
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || "Request failed");
  }
  return json.data as T;
}

export async function createReview(
  customerId: string,
  request: ReviewCreationRequest
): Promise<ProductReviewResponse> {
  return request<ProductReviewResponse>(
    `${BASE_URL}${API_CONFIG.ENDPOINTS.REVIEW.CREATE(customerId)}`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}

export async function getReviewsByProductId(
  productId: string
): Promise<ProductReviewResponse[]> {
  return request<ProductReviewResponse[]>(
    `${BASE_URL}${API_CONFIG.ENDPOINTS.REVIEW.GET_BY_PRODUCT(productId)}`
  );
}

export async function getReviewStats(
  productId: string
): Promise<ReviewStatsResponse> {
  return request<ReviewStatsResponse>(
    `${BASE_URL}${API_CONFIG.ENDPOINTS.REVIEW.GET_STATS(productId)}`
  );
}

export async function getReviewsByCustomerId(
  customerId: string
): Promise<ProductReviewResponse[]> {
  return request<ProductReviewResponse[]>(
    `${BASE_URL}${API_CONFIG.ENDPOINTS.REVIEW.GET_BY_CUSTOMER(customerId)}`
  );
}
