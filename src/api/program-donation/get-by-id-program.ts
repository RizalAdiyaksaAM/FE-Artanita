import http from "@/utils/http";
import { useState, useEffect } from "react";
import API_ENDPOINTS from "../api-endpoints";

type ProgramDonationImage = {
  image_url: string;
};

type Donation = {
  id: string;
  user_name: string;
  amount: number;
  message: string;
  created_at: string;
};

type ProgramDetail = {
  id: string;
  number: number;
  title: string;
  deskripsi: string;
  goal_amount: number;
  current_amount: number;
  program_donation_images: ProgramDonationImage[];
  donator_count: number;
  created_at: string;
  donations: Donation[];
};

type ApiResponse = {
  status: string;
  message: string;
  data: ProgramDetail;
};

/**
 * Custom hook untuk mengambil detail program donasi
 * @param id ID program yang akan diambil detailnya
 */
export const useProgramDetail = (id: string | undefined) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchProgramDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await http.get(API_ENDPOINTS.GET_DONATION_BY_ID(id), {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Set data dari response
        setData(response.data);
      } catch (err) {
        console.error("Error fetching program detail:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgramDetail();
  }, [id]);

  return { data, isLoading, error };
};

export default useProgramDetail;