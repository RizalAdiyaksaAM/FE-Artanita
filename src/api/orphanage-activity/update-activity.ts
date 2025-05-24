import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";
import { useState } from "react";


type UpdatePayload = {
    title: string;
    description: string;
    location: string;
    time: string;
};

type ApiResponse = {
    status: string;
    message: string;
}

export const useUpdateActivity = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [response, setResponse] = useState<ApiResponse | null>(null);

    const updateActivity = async (id: string, payload: UpdatePayload) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await http.put(API_ENDPOINTS.UPDATE_ACTIVITY_BY_ID(id), payload, {
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

    return { updateActivity, isLoading, error, response };
};

export default useUpdateActivity;