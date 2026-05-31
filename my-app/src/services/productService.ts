import {apiClient} from "../utils/apiClient";
import type {
  ProductResponse,
  ProductCreationRequest,
  ProductUpdateRequest,
} from "../types/productTypes";
import {API_CONFIG} from "../config/apiConfig";
import type {ApiResponse} from "../types/apiResponse";

export const createProduct = async (
    credentials: ProductCreationRequest
): Promise<ProductResponse> => {
  const res = await apiClient.post<ApiResponse<ProductResponse>>(
      API_CONFIG.ENDPOINTS.PRODUCT.CREATE,
      credentials
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Create product failed");
  }
  return api.data;
};

export const getAllProducts = async (): Promise<ProductResponse[]> => {
  const res = await apiClient.get<ApiResponse<ProductResponse[]>>(
      API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL,
      {skipAuth: true}
  );
  return res.data.data ?? [];
};

export const getProductById = async (productId: string): Promise<ProductResponse> => {
  const res = await apiClient.get<ApiResponse<ProductResponse>>(
      API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_ID(productId),
      {skipAuth: true}
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Get product failed");
  }
  return api.data;
};

export const updateProduct = async (
    productId: string,
    body: ProductUpdateRequest
): Promise<ProductResponse> => {
  const res = await apiClient.put<ApiResponse<ProductResponse>>(
      API_CONFIG.ENDPOINTS.PRODUCT.UPDATE(productId),
      body
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Update product failed");
  }
  return api.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(API_CONFIG.ENDPOINTS.PRODUCT.DELETE(productId));
};

export const getAllProductsPaginated = async (
    page: number,
    size: number
): Promise<ProductResponse[]> => {
  const res = await apiClient.get<ApiResponse<ProductResponse[]>>(
      API_CONFIG.ENDPOINTS.PRODUCT.PAGINATE,
      {params: {page, size}}
  );
  const api = res.data;
  return api.data ?? [];
};
