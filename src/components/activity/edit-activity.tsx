// components/EditActivityModal.tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/types/activity";


interface EditActivityModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  selectedActivity: Activity | null;
  updateError?: any;
  onOpenChange: (open: boolean) => void;
  onActivityChange: (activity: Activity) => void;
  onSaveActivity: () => void;
}

export const EditActivityModal = ({
  isOpen,
  isUpdating,
  selectedActivity,
  updateError,
  onOpenChange,
  onActivityChange,
  onSaveActivity
}: EditActivityModalProps) => {
  if (!selectedActivity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogDescription>
            Make changes to activity "{selectedActivity.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <input 
              type="text"
              id="title"
              value={selectedActivity.title}
              onChange={(e) => onActivityChange({
                ...selectedActivity,
                title: e.target.value
              })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea 
              id="description"
              value={selectedActivity.description}
              onChange={(e) => onActivityChange({
                ...selectedActivity,
                description: e.target.value
              })}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="location" className="text-sm font-medium">Location</label>
            <input 
              type="text"
              id="location"
              value={selectedActivity.location}
              onChange={(e) => onActivityChange({
                ...selectedActivity,
                location: e.target.value
              })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="time" className="text-sm font-medium">Time</label>
            <input 
              type="datetime-local"
              id="time"
              value={selectedActivity.time}
              onChange={(e) => onActivityChange({
                ...selectedActivity,
                time: e.target.value
              })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            />
          </div>

          {/* Current Media Preview */}
          {((selectedActivity.activity_images && selectedActivity.activity_images.length > 0) || 
            (selectedActivity.activity_videos && selectedActivity.activity_videos.length > 0)) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Media</h4>
              <div className="text-sm text-gray-600">
                {selectedActivity.activity_images?.length || 0} images, {selectedActivity.activity_videos?.length || 0} videos
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
          className="!px-4"
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
           className="!px-4 bg-[#379777] hover:bg-[#37977780]"
            type="submit"
            onClick={onSaveActivity}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
        
        {/* Status messages */}
        {updateError && (
          <div className="text-sm text-red-500 mt-2">
            {updateError?.message || "Failed to update activity. Please try again."}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};