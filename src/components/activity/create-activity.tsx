// components/CreateActivityModal.tsx
import { useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, FileImage, FileVideo } from "lucide-react";
import type { ActivityFormData } from "@/types/activity";


interface CreateActivityModalProps {
  isOpen: boolean;
  isCreating: boolean;
  formData: ActivityFormData;
  createError?: any;
  onOpenChange: (open: boolean) => void;
  onFormDataChange: (data: Partial<ActivityFormData>) => void;
  onCreateActivity: () => void;
  onCancel: () => void;
}

export const CreateActivityModal = ({
  isOpen,
  isCreating,
  formData,
  createError,
  onOpenChange,
  onFormDataChange,
  onCreateActivity,
  onCancel
}: CreateActivityModalProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFormDataChange({
      imageFiles: [...formData.imageFiles, ...files]
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFormDataChange({
      videoFiles: [...formData.videoFiles, ...files]
    });
  };

  const removeImageFile = (index: number) => {
    onFormDataChange({
      imageFiles: formData.imageFiles.filter((_, i) => i !== index)
    });
  };

  const removeVideoFile = (index: number) => {
    onFormDataChange({
      videoFiles: formData.videoFiles.filter((_, i) => i !== index)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[60%]  overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
          <DialogDescription>
            Add a new activity with details and media files
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="create-title">Title</Label>
            <Input 
              id="create-title"
              value={formData.title}
              onChange={(e) => onFormDataChange({ title: e.target.value })}
              placeholder="Enter activity title"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="create-description">Description</Label>
            <Textarea 
              id="create-description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              className="h-32 overflow-y-auto resize-none" 
              placeholder="Enter activity description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="create-location">Location</Label>
              <Input 
                id="create-location"
                value={formData.location}
                onChange={(e) => onFormDataChange({ location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="create-time">Time</Label>
              <Input 
                id="create-time"
                type="datetime-local"
                value={formData.time}
                onChange={(e) => onFormDataChange({ time: e.target.value })}
              />
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex items-center gap-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center !px-4 gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </Button>
                </div>
                
                {formData.imageFiles.length > 0 && (
                  <div className="space-y-2">
                    {formData.imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileImage className="h-4 w-4" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImageFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label>Videos</Label>
                <div className="flex items-center gap-2">
                  <input
                    ref={videoInputRef}
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center !px-4 gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Videos
                  </Button>
                </div>
                
                {formData.videoFiles.length > 0 && (
                  <div className="space-y-2">
                    {formData.videoFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileVideo className="h-4 w-4" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVideoFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isCreating}
            className="!px-4"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={onCreateActivity}
            disabled={isCreating || !formData.title.trim()}
            className="!px-4 bg-[#379777]"
          >
            {isCreating ? "Creating..." : "Create Activity"}
          </Button>
        </DialogFooter>
        
        {createError && (
          <div className="text-sm text-red-500 mt-2">
            {createError?.message || "Failed to create activity. Please try again."}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};