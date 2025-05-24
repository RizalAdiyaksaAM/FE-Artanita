import { getChartData, type ChartDataFetchResponse } from "@/api/donation/chart";
import { useQuery } from "@tanstack/react-query";


export const useChartData = () => {
    return useQuery<ChartDataFetchResponse>(
        {
            queryKey: ["chart-data"],
            queryFn: () => getChartData(),
            staleTime: 1000 * 60 * 5,
        }
    );
}