// types/activity.ts
export interface ActivityImage {
  image_url: string;
}

export interface ActivityVideo {
  video_url: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  activity_images: ActivityImage[];
  activity_videos: ActivityVideo[];
}

export interface PaginationData {
  current_page: number;
  total_page: number;
  total_data: number;
}

export interface ActivityResponse {
  data: Activity[];
  pagination?: PaginationData;
}

export interface ActivityFormData {
  title: string;
  description: string;
  location: string;
  time: string;
  activity_images: ActivityImage[];
  activity_videos: ActivityVideo[];
  imageFiles: File[];
  videoFiles: File[];
}

export interface ActivityFilters {
  page: number;
  limit: number;
  search?: string;
}