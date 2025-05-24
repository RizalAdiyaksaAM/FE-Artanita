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

// Updated to accept object parameter for better clarity
export const getFilteredUsers = async (filters: {
  page?: number;
  limit?: number;
  searchName?: string;
  filterAddress?: string;
  filterAge?: string;
  filterEducation?: string;
  filterPosition?: string;
}): Promise<UserFetchResponse> => {
  const {
    page = 1,
    limit = 10,
    searchName,
    filterAddress,
    filterAge,
    filterEducation,
    filterPosition,
  } = filters;

  const params: Record<string, any> = {
    page,
    limit,
  };

  // Add filter parameters only if they have values
  if (searchName) params.search_name = searchName;
  if (filterAddress) params.filter_address = filterAddress;
  if (filterAge) params.filter_age = filterAge;
  if (filterEducation) params.filter_education = filterEducation;
  if (filterPosition) params.filter_position = filterPosition;

  try {
    const response = await http.get(API_ENDPOINTS.GET_ALL_USER, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Keep the old function signature for backward compatibility if needed
export const getFilteredUsersLegacy = async (
  page: number = 1,
  limit: number = 10,
  searchName?: string,
  filterAddress?: string,
  filterAge?: string,
  filterEducation?: string,
  filterPosition?: string,
): Promise<UserFetchResponse> => {
  return getFilteredUsers({
    page,
    limit,
    searchName,
    filterAddress,
    filterAge,
    filterEducation,
    filterPosition,
  });
};