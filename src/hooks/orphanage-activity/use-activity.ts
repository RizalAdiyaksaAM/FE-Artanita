
import {  getAllActivity, type ActivityFetchResponse } from "@/api/orphanage-activity/get-all-activity";
import { useQuery } from "@tanstack/react-query";



export const useActivity = (filters: {
  page: number;
  limit: number;
  search?: string; // Changed from searchTitle to search for better clarity
}) => {
  return useQuery<ActivityFetchResponse>({
    queryKey: [
      "activity",
      filters.page,
      filters.limit,
      filters.search,
    ],
    queryFn: async () => {
      try {
        // Clean up the search parameter
        const searchParam = filters.search?.trim() || undefined;
        
        return await getAllActivity(
          filters.page,
          filters.limit,
          searchParam
        );
      } catch (error) {
        console.error("Error fetching program donations:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Refetch when search changes but debounce it
    refetchOnWindowFocus: false,
  });
};