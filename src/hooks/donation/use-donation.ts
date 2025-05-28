import { getDashboard, getDonationsDonatur, type DashboardFetchResponse, type NotifikasiFetchResponse } from "@/api/donation/dashboard";
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

export const useDonationDonatur = () => {
    return useQuery<NotifikasiFetchResponse>(
        {
            queryKey: ["donation-notifikasi"],
            queryFn: () => getDonationsDonatur(),
            staleTime: 1000 * 60 * 5,
        }  
    )
}

