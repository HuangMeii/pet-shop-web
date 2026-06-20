import type { LoginError } from "../types/authTypes";

export function createLoginError(
  message: string,
  status: number = 0,
  errorCode?: number
): LoginError {
  return { message, status, errorCode };
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    error.message.includes("Failed to fetch")
  );
}

export function isLoginError(error: unknown): error is LoginError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  );
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Không thể kết nối đến server. Vui lòng đảm bảo backend đang chạy trên http://localhost:8080",
  LOGIN_FAILED: "Đăng nhập thất bại. Vui lòng thử lại.",
  UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.",
} as const;
