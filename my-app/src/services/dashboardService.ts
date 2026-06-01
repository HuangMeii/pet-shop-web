import { apiClient } from "../utils/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import type { ApiResponse } from "../types/apiResponse";

export interface RevenueTrendItem {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface NewVsReturningCustomers {
  newCustomers: number;
  returningCustomers: number;
  newPercent: number;
  returningPercent: number;
}

export interface TopItem {
  id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
  imageUrl?: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  type: string;
}

export interface DashboardStatsResponse {
  totalOrders: number;
  totalRevenue: number;
  newCustomers: number;
  totalProducts: number;
  revenueTrend?: RevenueTrendItem[];
  orderStatusDistribution?: Record<string, number>;
  productTypeDistribution?: Record<string, number>;
  newVsReturning?: NewVsReturningCustomers;
  topPets?: TopItem[];
  topProducts?: TopItem[];
  lowStockAlerts?: LowStockItem[];
}

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  console.log("[DashboardService] Calling API:", API_CONFIG.ENDPOINTS.DASHBOARD.GET_STATS);
  const res = await apiClient.get<ApiResponse<DashboardStatsResponse>>(
    API_CONFIG.ENDPOINTS.DASHBOARD.GET_STATS
  );
  console.log("[DashboardService] Raw response:", res);
  const api = res.data;
  console.log("[DashboardService] API response data:", api);
  console.log("[DashboardService] api.success:", api?.success);
  console.log("[DashboardService] api.data:", api?.data);
  if (!api.success || api.data == null) {
    throw new Error(api.message ?? "Failed to fetch dashboard stats");
  }
  return api.data;
};
