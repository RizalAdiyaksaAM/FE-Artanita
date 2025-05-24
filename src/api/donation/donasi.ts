import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";

// Interface for donation payload
export interface DonationsCollectionPayload {
  name: string;
  address: string;
  no_wa: string;
  email: string;
  amount: number;
  message: string;
  program_id?: string | null; // Made optional to handle general donations
  return_url?: string;
}

// Interface for program detail
export interface ProgramDetail {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  status: string;
  image?: string;
  created_at: string;
  updated_at: string;
  // Add other program fields as needed
}

// Interface for donation response
export interface DonationResponse {
  id: string;
  title: string;
  name: string;
  amount: number;
  snap_url?: string;
  status: string;
  program_id?: string;
}

// Create donation function
export const donations = async (data: DonationsCollectionPayload) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("no_wa", data.no_wa);
    formData.append("email", data.email);
    formData.append("amount", data.amount.toString());
    formData.append("message", data.message);
    
    // Only append program_id if it exists and is not empty
    if (data.program_id && data.program_id.trim() !== '') {
      formData.append("program_id", data.program_id);
    }
    
    // Add return_url if provided
    if (data.return_url) {
      formData.append("return_url", data.return_url);
    }

    const response = await http.post(API_ENDPOINTS.DONASI, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in donations API:", error);
    throw error;
  }
};

// Get donation status by ID
export const getDonationStatus = async (id: string) => {
  try {
    const response = await http.get(API_ENDPOINTS.GET_DONATION_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching donation status:", error);
    throw error;
  }
};

// Get program detail by ID
export const getProgramDetail = async (programId: string): Promise<{ data: ProgramDetail }> => {
  try {
    if (!programId || programId.trim() === '') {
      throw new Error('Program ID is required');
    }

    const response = await http.get(API_ENDPOINTS.GET_PROGRAM_DONATION_BY_ID(programId));
    return response.data;
  } catch (error) {
    console.error("Error fetching program detail:", error);
    throw error;
  }
};

// Get all programs (if needed)
export const getAllPrograms = async () => {
  try {
    const response = await http.get(API_ENDPOINTS.GET_ALL_PROGRAM_DONATION);
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }
};

// Check payment status (alternative method)
export const checkPaymentStatus = async (donationId: string) => {
  try {
    const response = await http.get(API_ENDPOINTS.GET_NOTIFIKASI_BY_ID(donationId));
    return response.data;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};

export default donations;