import http from "@/utils/http";
import { useState } from "react";
import API_ENDPOINTS from "../api-endpoints";



type ApiResponse = {
    status: string;
    message: string;
}

export const useDeleteUser = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [response, setResponse] = useState<ApiResponse | null>(null);

    const deleteUser = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await http.delete(API_ENDPOINTS.DELETE_USER_BY_ID(id), {
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

    return { deleteUser, isLoading, error, response };
};