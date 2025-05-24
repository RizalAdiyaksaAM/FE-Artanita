import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";
import { useEffect, useState } from "react";


type UserDetail = {
    id: string;
    name: string;
    address: string;
    age: number;
    education: string;
    position: string;
    image: string;
}

type ApiResponse = {
    status: string;
    message: string;
    data: UserDetail;
}

export const userDetail = async (id: string) => {
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
            const response = await http.get(API_ENDPOINTS.GET_USER_BY_ID(id), {
              headers: {
                "Content-Type": "application/json",
              },
            });

            // Set data dari response
            setData(response.data);
          } catch (err) {
            console.error("Error fetching program detail:", err);
            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
          } finally {
            setIsLoading(false);
          }
        };

        fetchProgramDetail();
      }, [id]);

    
    return { data, isLoading, error };
}

export default userDetail;