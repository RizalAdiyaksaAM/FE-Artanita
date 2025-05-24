import { type UserFetchResponse } from "@/api/orphanage-user/get-all-user";
import { getFilteredUsers } from "@/api/orphanage-user/get-filter";
import { useQuery } from "@tanstack/react-query";

export const useFilteredUsers = (filters: {
  page: number;
  limit: number;
  searchName: string;
  filterAddress: string;
  filterAge: string;
  filterEducation: string;
  filterPosition: string;
}) => {
  return useQuery<UserFetchResponse>({
    queryKey: [
      "users",
      filters.page,
      filters.limit,
      filters.searchName,
      filters.filterAddress,
      filters.filterAge,
      filters.filterEducation,
      filters.filterPosition,
    ],
    queryFn: async () => {
      try {
        return await getFilteredUsers({
          page: filters.page,
          limit: filters.limit,
          searchName: filters.searchName || undefined,
          filterAddress: filters.filterAddress !== "all" ? filters.filterAddress : undefined,
          filterAge: filters.filterAge !== "all" ? filters.filterAge : undefined,
          filterEducation: filters.filterEducation !== "all" ? filters.filterEducation : undefined,
          filterPosition: filters.filterPosition !== "all" ? filters.filterPosition : undefined,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};