import { apiClient } from "../utils/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";

export interface DashboardStatsResponse {
  totalOrders: number;
  totalRevenue: number;
  newCustomers: number;
  totalProducts: number;
}

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const res = await apiClient.get<ApiResponse<DashboardStatsResponse>>(
    API_CONFIG.ENDPOINTS.DASHBOARD.GET_STATS
  );
  const api = res.data;
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch dashboard stats");
  }
  return api.data;
};
