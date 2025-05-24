import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";


export interface UserFetchResponse {
    status: string;
    message: string;
    data: User[];
    pagination: Pagination;
    link: Record<string, string>;
}

export interface Pagination {
    current_page: number;
    total_page: number;
    total_data: number;
}

export interface User {
    id: string;
    name: string;
    address: string;
    age: number;
    education: string;
    position: string;
    image: string;
}



export const getAllUser = async (
    page?: number,
    limit?: number,
      filterPosition?: string,
  ): Promise<UserFetchResponse> => {
    const params: Record<string, any> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (filterPosition) params.filter_position = filterPosition;
  
    try {
      const response = await http.get(API_ENDPOINTS.GET_ALL_USER, {
        params,
      });
  
      // Return response data langsung tanpa validasi tambahan
      return response.data;
    } catch (error) {
      console.error("Error fetching orphanages:", error);
      throw error; // Throw error asli untuk mendapatkan detail lebih lanjut
    }
  };    
