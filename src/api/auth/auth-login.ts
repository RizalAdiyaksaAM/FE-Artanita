// src/services/authService.ts
import API_ENDPOINTS from "@/api/api-endpoints";
import http from "@/utils/http";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";


// Body request untuk login
export interface AuthLoginBody {
  email: string;
  password: string;
}

// Struktur respons login yang berhasil
export interface AuthLoginResponse {
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    token: string;
  };
  meta: {
    status: string;
    message: string;
  };
}

// Struktur error jika login gagal
export interface AuthErrorResponse {
  response?: {
    data?: {
      meta?: {
        message?: string;
      };
    };
  };
}

// Fungsi async login
const authLogin = async (
  data: AuthLoginBody
): Promise<AuthLoginResponse> => {
  const response = await http.post<AuthLoginResponse>(API_ENDPOINTS.LOGIN, data);
  return response.data;
};

// Verify token validity (can be used for persistent sessions)


// Custom hooks for React Query

// Login hook
const useAuthLoginMutation = (): UseMutationResult<
  AuthLoginResponse,
  AuthErrorResponse,
  AuthLoginBody
> => {
  return useMutation<AuthLoginResponse, AuthErrorResponse, AuthLoginBody>({
    mutationFn: authLogin,
  });
};

export { useAuthLoginMutation };