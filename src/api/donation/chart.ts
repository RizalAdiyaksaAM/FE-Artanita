import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";



export interface ChartDataFetchResponse {
    status: string;
    message: string;
    data: ChartData[];
}

export interface ChartData{
    id: string;
    amount: number;
    date: string;
    program_donation: string;
}

export const getChartData = async (): Promise<ChartDataFetchResponse> => {
  try {
    const response = await http.get(API_ENDPOINTS.CHART_DATA);
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};