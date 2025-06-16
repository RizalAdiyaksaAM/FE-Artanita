// components/user/view-user-modal.tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";


interface ViewUserModalProps {
  isOpen: boolean;
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const ViewUserModal = ({
  isOpen,
  user,
  onOpenChange,
}: ViewUserModalProps) => {
  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>User Details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 ">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600">Name</h4>
              <p className="text-sm">{user.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">Address</h4>
              <p className="text-sm">{user.address}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">Age</h4>
              <p className="text-sm">{user.age} years old</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">Education</h4>
              <p className="text-sm">{user.education}</p>
            </div>
            <div className="col-span-2">
              <h4 className="font-medium text-sm text-gray-600">Position</h4>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                user.position === 'Anak Asuh' ? 'bg-blue-100 text-blue-800' :
                user.position === 'Anak Panti' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {user.position}
              </span>
            </div>
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
};