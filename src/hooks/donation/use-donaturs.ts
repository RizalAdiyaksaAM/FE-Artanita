import { getDonatur, type DonatursFetchResponse } from "@/api/donation/donatur";
import { useQuery } from "@tanstack/react-query";



export const useDonatur = () => {
    return useQuery<DonatursFetchResponse>({
        queryKey: ["donatur"],
        queryFn: () => getDonatur(),
        staleTime: 1000 * 60 * 5,
    });
} 