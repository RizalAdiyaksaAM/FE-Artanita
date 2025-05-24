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

export interface Dashboard{
    program_count: number;
    total_donation: number;
    unique_donators_count: number;
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
    const response = await http.get(API_ENDPOINTS.DASHBOARD);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    throw error;
  }
};

