import { getDashboard, type DashboardFetchResponse } from "@/api/donation/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
    return useQuery<DashboardFetchResponse>(
        {
            queryKey: ["dashboard"],
            queryFn: () => getDashboard(),
            staleTime: 1000 * 60 * 5,
        }
    );
}

