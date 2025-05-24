import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";



export interface DonatursFetchResponse {
    status: string;
    message: string;
    data: Donatur[];
}

export interface Donatur {
    id: string;
    name: string;
    amount: number;
    message: string;
}

export const getDonatur = async (): Promise<DonatursFetchResponse> => {
    try {
        const response = await http.get(API_ENDPOINTS.DONATUR);
        return response.data;
    } catch (error) {
        console.error("Error fetching donatur:", error);
        throw error;
    }
};