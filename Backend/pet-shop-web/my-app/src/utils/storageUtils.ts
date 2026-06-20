import { STORAGE_KEYS } from "../config/apiConfig";

export function storeAuthToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}


export function removeAuthToken(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function storeUserName(userName: string): void {
  localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
}


export function getUserName(): string | null {
  return localStorage.getItem(STORAGE_KEYS.USER_NAME);
}


export function removeUserName(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
}


export function setStorageItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}


export function getStorageItem(key: string): string | null {
  return localStorage.getItem(key);
}


export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}


export function clearStorage(): void {
  localStorage.clear();
}
