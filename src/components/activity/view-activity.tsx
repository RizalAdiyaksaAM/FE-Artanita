// components/ViewActivityModal.tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Activity } from "@/types/activity";
import { formatDateTime } from "@/utils/activity";


interface ViewActivityModalProps {
  isOpen: boolean;
  activity: Activity | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

export const ViewActivityModal = ({
  isOpen,
  activity,
  onOpenChange,
  onEdit,
  onDelete
}: ViewActivityModalProps) => {
  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{activity.title}</DialogTitle>
          <DialogDescription>Activity Details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <h4 className="font-medium">Description</h4>
            <p className="text-sm">{activity.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Location</h4>
              <p className="text-sm">{activity.location}</p>
            </div>
            <div>
              <h4 className="font-medium">Time</h4>
              <p className="text-sm">{formatDateTime(activity.time)}</p>
            </div>
          </div>

          {/* Images */}
          {activity.activity_images && activity.activity_images.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Images ({activity.activity_images.length})</h4>
              <div className="grid grid-cols-2 gap-2">
                {activity.activity_images.map((image, index) => (
                  <img 
                    key={index}
                    src={image.image_url} 
                    alt={`${activity.title} - ${index + 1}`}
                    className="rounded-lg w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={() => window.open(image.image_url, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {activity.activity_videos && activity.activity_videos.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Videos ({activity.activity_videos.length})</h4>
              <div className="space-y-3">
                {activity.activity_videos.map((video, index) => (
                  <div key={index} className="w-full">
                    <video 
                      src={video.video_url} 
                      controls
                      preload="metadata"
                      className="rounded-lg w-full h-48 bg-gray-100"
                      style={{ maxWidth: '100%' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between flex-shrink-0">
          <Button className="!px-4" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button 
            className="!px-4"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => onEdit(activity), 300);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
            className="!px-4"
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => onDelete(activity), 300);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};