import {API_CONFIG} from "../config/apiConfig";
import type {
  AuthRequest,
  AuthResponse,
  IntrospectRequest,
  IntrospectResponse,
  LogoutRequest,
  RefreshRequest,
} from "../types/authTypes";
import type {ApiResponse} from "../types/apiResponse";
import {
  createLoginError,
  isNetworkError,
  isLoginError,
  ERROR_MESSAGES,
} from "../utils/errorHandler";
import {apiClient} from "../utils/apiClient";
import {removeAuthToken, removeUserName} from "../utils/storageUtils";
import type {UserCreationRequest} from "@/types/userTypes.ts";

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
  try {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials,
        {skipAuth: true}
    );
    const apiRes = res.data;

    if (!apiRes.success || !apiRes.data) {
      throw createLoginError(
          apiRes.message || ERROR_MESSAGES.LOGIN_FAILED,
          apiRes.status ?? res.status,
          apiRes.errorCode
      );
    }

    return apiRes.data;
  } catch (error: unknown) {
    if (isNetworkError(error)) {
      throw createLoginError(ERROR_MESSAGES.NETWORK_ERROR);
    }

    if (isLoginError(error)) {
      throw error;
    }

    throw createLoginError(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
};

export const verifyToken = async (request: IntrospectRequest): Promise<IntrospectResponse> => {
  const res = await apiClient.post<ApiResponse<IntrospectResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.INTROSPECT,
      request,
      {skipAuth: true}
  );
  const apiRes = res.data;
  if (!apiRes.success || !apiRes.data) {
    throw new Error(apiRes.message ?? "Introspect failed");
  }
  return apiRes.data;
};

export const refresh = async (request: RefreshRequest): Promise<AuthResponse> => {
  const res = await apiClient.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      request
  );
  const apiRes = res.data;
  if (!apiRes.success || !apiRes.data) {
    throw new Error(apiRes.message || "Refresh failed");
  }
  return apiRes.data;
};

export const register = async (credentials: UserCreationRequest): Promise<AuthResponse> => {
  try {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        credentials,
        {skipAuth: true}
    );
    const apiRes = res.data;

    if (!apiRes.success || !apiRes.data) {
      throw createLoginError(
          apiRes.message || ERROR_MESSAGES.LOGIN_FAILED,
          apiRes.status ?? res.status,
          apiRes.errorCode
      );
    }

    return apiRes.data;
  } catch (error: unknown) {
    if (isNetworkError(error)) {
      throw createLoginError(ERROR_MESSAGES.NETWORK_ERROR);
    }

    if (isLoginError(error)) {
      throw error;
    }

    throw createLoginError(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
};

export const logout = async (request?: LogoutRequest) => {
  if (request?.token) {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
          request,
          {skipAuth: true}
      );
    } catch {
      // ignore errors on logout
      //test github
    }
  }
  removeAuthToken();
  removeUserName();
};
