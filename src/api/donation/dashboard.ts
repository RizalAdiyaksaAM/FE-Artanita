import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";


export interface DashboardFetchResponse {
    status: string;
    message: string;
    data: Dashboard;
}


export interface NotifikasiFetchResponse {
  status: string;
  message: string;
  data: Notifikasi[];
}

export interface DonationUseFetchResponse {
  status: string;
  message: string;
  data: Donation[];
}

export interface Donation {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  use_donation: number;
}

export interface Dashboard{
    used_donation: number;
    remaining_donation : number;
    total_donation: number;
}



export interface Notifikasi{
  id: string;
  name: string;
  amount: string;
  program_title: string;
  message: string;
  date: string;
  status: string;
}

 

export const getDashboard = async (): Promise<DashboardFetchResponse> => {
  try {
    const response = await http.get(API_ENDPOINTS.SUMMARY);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    throw error;
  }
};

export const getDonationsDonatur = async (): Promise<NotifikasiFetchResponse> => {
  try {
    const response = await http.get(API_ENDPOINTS.NOTIFIKASI);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifikasi:", error);
    throw error;
  }
};

export const getDonationUse = async (): Promise<DonationUseFetchResponse> => {
  try {
    const response = await http.get(API_ENDPOINTS.GET_DONASI_TERPAKAI);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifikasi:", error);
    throw error;
  }
}

