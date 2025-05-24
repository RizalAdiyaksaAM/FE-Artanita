// components/EditUserModal.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileImage } from "lucide-react";
import type { User, UserFormData } from "@/types/user";

interface EditUserModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  selectedUser: User | null;
  formData: UserFormData;
  updateError?: any;
  onOpenChange: (open: boolean) => void;
  onFormDataChange: (data: Partial<UserFormData>) => void;
  onSaveUser: () => void;
}

export const EditUserModal = ({
  isOpen,
  isUpdating,
  selectedUser,
  formData,
  updateError,
  onOpenChange,
  onFormDataChange,
  onSaveUser
}: EditUserModalProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFormDataChange({ imageFile: file });
    }
  };

  const removeImageFile = () => {
    onFormDataChange({ imageFile: null });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  if (!selectedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to user "{selectedUser.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="edit-name">Name *</Label>
            <Input 
              id="edit-name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="edit-address">Address *</Label>
            <Input 
              id="edit-address"
              value={formData.address}
              onChange={(e) => onFormDataChange({ address: e.target.value })}
              placeholder="Enter address"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="edit-age">Age *</Label>
              <Input 
                id="edit-age"
                type="number"
                min="1"
                max="100"
                value={formData.age || ''}
                onChange={(e) => onFormDataChange({ age: parseInt(e.target.value) || 0 })}
                placeholder="Enter age"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="edit-education">Education *</Label>
              <Select 
                value={formData.education} 
                onValueChange={(value) => onFormDataChange({ education: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">SD (Elementary)</SelectItem>
                  <SelectItem value="SMP">SMP (Junior High)</SelectItem>
                  <SelectItem value="SMA">SMA (Senior High)</SelectItem>
                  <SelectItem value="D3">D3 (Diploma)</SelectItem>
                  <SelectItem value="S1">S1 (Bachelor)</SelectItem>
                  <SelectItem value="S2">S2 (Master)</SelectItem>
                  <SelectItem value="S3">S3 (Doctorate)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="edit-position">Position *</Label>
            <Select 
              value={formData.position} 
              onValueChange={(value) => onFormDataChange({ position: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anak Asuh">Anak Asuh</SelectItem>
                <SelectItem value="Pengurus">Pengurus</SelectItem>
                <SelectItem value="Volunteer">Volunteer</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Image Display */}
          {selectedUser.image && (
            <div className="space-y-2">
              <Label>Current Profile Image</Label>
              <div className="flex items-center gap-2">
                <img 
                  src={selectedUser.image} 
                  alt={selectedUser.name}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <span className="text-sm text-gray-600">Current image</span>
              </div>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Update Profile Image</Label>
            <div className="flex items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 !px-4"
              >
                <Upload className="h-4 w-4" />
                {formData.imageFile ? "Change Image" : "Upload New Image"}
              </Button>
            </div>
            
            {formData.imageFile && (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  <span className="text-sm truncate">{formData.imageFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImageFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="!px-4"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={onSaveUser}
            disabled={isUpdating || !formData.name.trim() || !formData.address.trim() || !formData.age || !formData.education || !formData.position}
            className="!px-4 bg-[#379777] hover:bg-[#37977780]"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
        
        {updateError && (
          <div className="text-sm text-red-500 mt-2">
            {updateError?.message || "Failed to update user. Please try again."}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};