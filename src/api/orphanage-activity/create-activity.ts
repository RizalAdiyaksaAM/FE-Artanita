// api/activity.ts
import { useState } from 'react';
import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";
import type { ActivityPayload } from '@/types/activity';


export interface CreateActivityResponse {
  status: string;
  message?: string;
  data?: any;
}

export const useCreateActivity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<CreateActivityResponse | null>(null);

  const createActivity = async (data: ActivityPayload) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("time", data.time);

      // Handle image files
      if (data.imageFiles && data.imageFiles.length > 0) {
        data.imageFiles.forEach((file) => {
          formData.append("image", file);
        });
      } else if (data.activity_images && data.activity_images.length > 0) {
        data.activity_images.forEach((img, index) => {
          formData.append(`image_urls[${index}]`, img.image_url);
        });
      }

      // Handle video files
      if (data.videoFiles && data.videoFiles.length > 0) {
        data.videoFiles.forEach((file) => {
          formData.append("video", file);
        });
      } else if (data.activity_videos && data.activity_videos.length > 0) {
        data.activity_videos.forEach((video, index) => {
          formData.append(`video_urls[${index}]`, video.video_url);
        });
      }

      const result = await http.post(API_ENDPOINTS.CREATE_ACTIVITY, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(result.data);
      return result.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createActivity,
    isLoading,
    error,
    response
  };
};