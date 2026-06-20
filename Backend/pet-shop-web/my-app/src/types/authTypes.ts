import { UserRole } from "../enum/user";

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  authenticated: boolean;
  token: string;
}

export interface LoginError {
  message: string;
  status?: number;
  errorCode?: number;
}

export interface IntrospectRequest {
    token: string;
}

export interface IntrospectResponse {
    valid: boolean;
}

export interface LogoutRequest {
    token: string;
}

export interface RefreshRequest {
    token: string;
}

export interface RegisterRequest {
  username: string;
  phone: string;
  password: string;
  address?: string;
  role: UserRole;
}