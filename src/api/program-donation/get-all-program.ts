import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";

export interface ProgramDonationFetchResponse {
  status: string;
  message: string;
  data: ProgramDonation[];
  pagination: Pagination;
  link: Record<string, string>;
}

// Interface untuk program donation image
export interface ProgramDonationImage {
  image_url: string;
}

// Interface untuk program donation
export interface ProgramDonation {
  id: string;
  number: number;
  title: string;
  deskripsi: string;
  goal_amount: number;
  current_amount: number;
  program_donation_images: ProgramDonationImage[];
}

// Interface untuk pagination data
export interface Pagination {
  current_page: number;
  total_page: number;
  total_data: number;
}


export const getFilteredProgram = async (
  page: number = 1,
  limit: number = 10,
  searchTitle?: string,
): Promise<ProgramDonationFetchResponse> => {
  const params: Record<string, any> = {
    page,
    limit,
  };


if (searchTitle) params.search_title = searchTitle;

try {
  const response = await http.get(API_ENDPOINTS.GET_ALL_PROGRAM_DONATION, {
    params,
  });

  // Return response data langsung tanpa validasi tambahan
  return response.data;
} catch (error) {
  console.error("Error fetching program donations:", error);
  throw error; // Throw error asli untuk mendapatkan detail lebih lanjut
}
};


// Fungsi untuk mendapatkan semua program donasi
export const getAllProgramDonations = async (
  page?: number,
  limit?: number,
  searchTitle?: string
): Promise<ProgramDonationFetchResponse> => {
  const params: Record<string, any> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (searchTitle) params.search_title = searchTitle;

  try {
    const response = await http.get(API_ENDPOINTS.GET_ALL_PROGRAM_DONATION, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching program donations:", error);
    throw error;
  }
};
