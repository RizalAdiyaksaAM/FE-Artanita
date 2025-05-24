import http from "@/utils/http";
import { useState } from "react";
import API_ENDPOINTS from "../api-endpoints";

type UpdatePayload = {
  title?: string;
  deskripsi?: string;
  goal_amount?: number;
  // tambahkan field lain jika perlu
};

type ApiResponse = {
  status: string;
  message: string;
};

export const useUpdateProgramDetail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const updateProgram = async (id: string, payload: UpdatePayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await http.put(API_ENDPOINTS.UPDATE_PROGRAM_DONATION_BY_ID(id), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProgram, isLoading, error, response };
};

export default useUpdateProgramDetail;
