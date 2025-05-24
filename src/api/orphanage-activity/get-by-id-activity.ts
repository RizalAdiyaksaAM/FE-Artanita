import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import API_ENDPOINTS from "@/api/api-endpoints";

// Type untuk detail aktivitas
export interface ActivityDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  activity_images: ActivityImage[];
  activity_videos: ActivityVideos[];
}

export interface ActivityImage {
  image_url: string;
}

export interface ActivityVideos {
  video_url: string;
}

export type ActivityDetailResponse = {
  status: string;
  message: string;
  data: ActivityDetail;
};

export const useActivityDetail = (id?: string) => {
  return useQuery({
    queryKey: ["activity-detail", id],
    queryFn: async (): Promise<ActivityDetailResponse> => {
      if (!id) {
        throw new Error("ID aktivitas tidak valid");
      }

      const response = await http.get(API_ENDPOINTS.GET_ACTIVITY_BY_ID(id));
      return response.data;
    },
    enabled: !!id, // Query hanya dijalankan jika id tersedia
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    retry: 1, // Coba lagi sekali jika gagal
  });
};

export default useActivityDetail;