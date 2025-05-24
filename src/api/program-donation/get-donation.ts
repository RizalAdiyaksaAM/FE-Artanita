import { useEffect, useState } from "react";
import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";

export interface DonationFetchResponse {
  status: string;
  message: string;
  data: Donation[];
}

export interface Donation {
  id: string;
  name: string;
  amount: number;
  message: string;
}

const useDonationByProgram = (id: string | undefined) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await http.get<DonationFetchResponse>(
          API_ENDPOINTS.GET_DONATION_BY_PROGRAM_ID(id)
        );
        setDonations(response.data.data);
      } catch (err) {
        console.error("Error fetching donations by program:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [id]);

  return { donations, isLoading, error };
};

export default useDonationByProgram;
