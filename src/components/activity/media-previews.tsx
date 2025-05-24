// components/MediaPreview.tsx
import type { Activity } from "@/types/activity";
import { Image, Play, Video } from "lucide-react";


interface MediaPreviewProps {
  activity: Activity;
}

export const MediaPreview = ({ activity }: MediaPreviewProps) => (
  <div className="flex items-center gap-2">
    {activity.activity_images && activity.activity_images.length > 0 && (
      <div className="flex items-center gap-1">
        <Image className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-blue-600">{activity.activity_images.length}</span>
      </div>
    )}
    {activity.activity_videos && activity.activity_videos.length > 0 && (
      <div className="flex items-center gap-1">
        <Play className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-600">{activity.activity_videos.length}</span>
      </div>
    )}
  </div>
);