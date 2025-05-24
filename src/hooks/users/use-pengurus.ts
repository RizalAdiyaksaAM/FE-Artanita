import { getAllUser, type UserFetchResponse } from "@/api/orphanage-user/get-all-user";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (page?: number, limit?: number) => {
  return useQuery<UserFetchResponse>({
    queryKey: ["users", page, limit, "excluding-anak-asuh"],
    queryFn: async () => {
      const data = await getAllUser(page, limit);
      const filtered = data.data.filter(user => user.position !== "anak asuh");

      return {
        ...data,
        data: filtered,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
