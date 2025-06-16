// components/DeleteUserDialog.tsx
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import type { User } from "@/types/user";

interface DeleteUserDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  userToDelete: User | null;
  deleteError?: any;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteUserDialog = ({
  isOpen,
  isDeleting,
  userToDelete,
  deleteError,
  onOpenChange,
  onConfirmDelete
}: DeleteUserDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan secara permanen menghapus user
            {userToDelete ? ` "${userToDelete.name}"` : ""} 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="!px-4" disabled={isDeleting}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete} 
            className="bg-red-600 !px-4 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
        
        {deleteError && (
          <div className="text-sm text-red-500 mt-2">
            {deleteError?.message || "Failed to delete user. Please try again."}
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};