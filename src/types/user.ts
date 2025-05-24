// types/user.ts
export interface User {
  id: string;
  name: string;
  address: string;
  age: number;
  education: string;
  position: string;
  image: string;
}

export interface UserResponse {
  status: string;
  message: string;
  data: User[];
  pagination: {
    current_page: number;
    total_page: number;
    total_data: number;
  };
  link: Record<string, string>;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  address?: string;
  age?: string;
  education?: string;
  position?: string;
}

export interface UserFormData {
  name: string;
  address: string;
  age: number | string;
  education: string;
  position: string;
  imageFile?: File | null;
}