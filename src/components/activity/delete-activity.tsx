// components/DeleteActivityDialog.tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Activity } from "@/types/activity";


interface DeleteActivityDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  activityToDelete: Activity | null;
  deleteError?: any;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteActivityDialog = ({
  isOpen,
  isDeleting,
  activityToDelete,
  deleteError,
  onOpenChange,
  onConfirmDelete
}: DeleteActivityDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
           Tindakan ini akan secara permanen menghapus program 
            {activityToDelete ? ` "${activityToDelete.title}"` : ""}. 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="!px-4" disabled={isDeleting}>Batal</AlertDialogCancel>
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
            {deleteError?.message || "Failed to delete activity. Please try again."}
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};