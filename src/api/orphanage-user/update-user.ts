import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";
import { useState } from "react";

type UserPayload = {
  name: string;
  address: string;
  age: number;
  education: string;
  position: string;
  image: File | string;
};

type ApiResponse = {
  status: string;
  message: string;
};

export const usersUpdate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const updateUser = async (id: string, payload: UserPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await http.put(API_ENDPOINTS.UPDATE_USER_BY_ID(id), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponse(res.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, error, response };
};

export default usersUpdate;
