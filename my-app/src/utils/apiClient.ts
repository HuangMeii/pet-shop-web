import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { getAuthToken } from "../utils/storageUtils";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {

      if (!config.skipAuth) {
        const token = getAuthToken();

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Remove Authorization header if token is not available
          if (config.headers) {
            delete config.headers.Authorization;
          }
        }
      } else {
        // Explicitly remove Authorization header when skipAuth is true
        if (config.headers) {
          delete config.headers.Authorization;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {

      if (error.response) {

        // Only redirect to login on 401 for authenticated requests (e.g. expired token).
        // Do NOT redirect when login itself fails (login request uses skipAuth).
        if (error.response.status === 401 && !error.config?.skipAuth) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        const message =
            error.response.data?.message ||
            error.response.data?.error ||
            "Server error";

        return Promise.reject(new Error(message));
      }

      if (error.request) {
        return Promise.reject(new Error("Server không phản hồi"));
      }

      return Promise.reject(new Error(error.message));
    }
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const message =
            error.response.data?.message ||
            error.response.data?.error ||
            "Server error";

        return Promise.reject(new Error(message));
      }

      if (error.request) {
        return Promise.reject(new Error("Server không phản hồi"));
      }

      return Promise.reject(error);
    }
);

// import { API_CONFIG } from "../config/apiConfig";
// import type { ApiResponse } from "../types/apiResponse.ts";
//
// interface RequestOptions {
//   method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
//   body?: unknown;
//   headers?: Record<string, string>;
// }
//
// class ApiClient {
//   private baseURL: string;
//
//   constructor(baseURL: string) {
//     this.baseURL = baseURL;
//   }
//
//   private async request<T>(
//     endpoint: string,
//     options: RequestOptions = {}
//   ): Promise<ApiResponse<T>> {
//     const { method = "GET", body, headers = {} } = options;
//
//     const config: RequestInit = {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//     };
//
//     if (body) {
//       config.body = JSON.stringify(body);
//     }
//
//     const response = await fetch(`${this.baseURL}${endpoint}`, config);
//     const data: ApiResponse<T> = await response.json();
//
//     return { ...data, status: response.status };
//   }
//
//   private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
//     if (!params || Object.keys(params).length === 0) return endpoint;
//     const search = new URLSearchParams(
//       Object.fromEntries(
//         Object.entries(params).map(([k, v]) => [k, String(v)])
//       )
//     );
//     return `${endpoint}?${search.toString()}`;
//   }
//
//   async get<T>(
//     endpoint: string,
//     options?: { headers?: Record<string, string>; params?: Record<string, string | number> }
//   ): Promise<ApiResponse<T>> {
//     const headers = options?.headers;
//     const params = options?.params;
//     const url = params ? this.buildUrl(endpoint, params) : endpoint;
//     return this.request<T>(url, { method: "GET", headers });
//   }
//
//   async post<T>(
//     endpoint: string,
//     body?: unknown,
//     headers?: Record<string, string>
//   ): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { method: "POST", body, headers });
//   }
//
//   async put<T>(
//     endpoint: string,
//     body?: unknown,
//     headers?: Record<string, string>
//   ): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { method: "PUT", body, headers });
//   }
//
//   async patch<T>(
//     endpoint: string,
//     body?: unknown,
//     headers?: Record<string, string>
//   ): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { method: "PATCH", body, headers });
//   }
//
//   async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { method: "DELETE", headers });
//   }
// }
//
// export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
