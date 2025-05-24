import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";

export interface ActivityFetchResponse {
  status: string;
  message: string;
  data: Activity[];
  pagination: Pagination;
  link: Record<string, string>;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  activity_images: ActivityImage[];
  activity_videos: ActivityVideo[];
}

export interface ActivityImage {
  image_url: string;
}

export interface ActivityVideo {
  video_url: string;
}

export interface Pagination {
  current_page: number;
  total_page: number;
  total_data: number;
}

export const getAllActivity = async (
  page?: number,
  limit?: number,
  searchTitle?: string
): Promise<ActivityFetchResponse> => {
  const params: Record<string, any> = {};
  
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (searchTitle) params.search_title = searchTitle;

  try {
    const response = await http.get(API_ENDPOINTS.GET_ALL_ACTIVITY, {
      params,
    });


    // Return response data langsung tanpa validasi tambahan
    return response.data;
  } catch (error) {
    console.error("Error fetching program donations:", error);
    throw error; // Throw error asli untuk mendapatkan detail lebih lanjut
  }
};
