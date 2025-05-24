// src/utils/authUtils.ts
import Cookies from 'js-cookie';

// Cookie configuration
const TOKEN_COOKIE_NAME = 'auth_token';
const USER_COOKIE_NAME = 'auth_user';
const COOKIE_EXPIRES_DAYS = 7;
const SECURE_COOKIE = process.env.NODE_ENV === 'production';

// Define user types and role interfaces
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TokenData {
  token: string;
  expiresAt?: number;
}

// Cookie management functions
export const setAuthCookies = (userData: UserData, tokenData: TokenData): void => {
  // Store token in a secure, HttpOnly cookie when possible
  Cookies.set(TOKEN_COOKIE_NAME, tokenData.token, {
    expires: COOKIE_EXPIRES_DAYS,
    secure: SECURE_COOKIE,
    sameSite: 'strict'
  });
  
  // Store user data (excluding sensitive info) in a cookie
  Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), {
    expires: COOKIE_EXPIRES_DAYS,
    secure: SECURE_COOKIE,
    sameSite: 'strict'
  });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE_NAME);
};

export const getAuthUser = (): UserData | null => {
  const userJson = Cookies.get(USER_COOKIE_NAME);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as UserData;
  } catch (e) {
    console.error('Failed to parse user data from cookie:', e);
    clearAuthCookies();
    return null;
  }
};

export const clearAuthCookies = (): void => {
  Cookies.remove(TOKEN_COOKIE_NAME);
  Cookies.remove(USER_COOKIE_NAME);
};

// Role-based authorization helpers
export const isAdmin = (): boolean => {
  const user = getAuthUser();
  return user?.role === 'admin';
};

// Authentication status checker
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getAuthUser();
  return !!token && !!user;
};