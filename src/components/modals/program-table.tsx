// components/program-donation/ProgramModals.tsx
import React, { useState, useRef } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, X } from "lucide-react";
import type { ProgramDonation, ProgramModalsProps } from '@/types/program';

export const ProgramModals: React.FC<ProgramModalsProps> = ({
  selectedProgram,
  isViewModalOpen,
  isEditModalOpen,
  isCreateModalOpen,
  isDeleteDialogOpen,
  isImportModalOpen,
  onViewModalChange,
  onEditModalChange,
  onCreateModalChange,
  onDeleteDialogChange,
  onImportModalChange,
  onSave,
  onCreate,
  onDelete,
  importData,
  importErrors,
  importStatus,
  onImportData,
  isUpdating,
  isDeleting
}) => {
  const [editProgram, setEditProgram] = useState<ProgramDonation | null>(null);
  const [createProgram, setCreateProgram] = useState<Partial<ProgramDonation>>({
    title: '',
    deskripsi: '',
    goal_amount: 0,
    current_amount: 0,
    program_donation_images: [],
  });
  
  // State untuk menyimpan file gambar yang sebenarnya
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Ref untuk file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedProgram && isEditModalOpen) {
      setEditProgram({...selectedProgram});
    }
  }, [selectedProgram, isEditModalOpen]);

  // Reset form ketika modal create ditutup
  React.useEffect(() => {
    if (!isCreateModalOpen) {
      setCreateProgram({
        title: '',
        deskripsi: '',
        goal_amount: 0,
        current_amount: 0,
        program_donation_images: [],
      });
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isCreateModalOpen]);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'Rp0';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const truncateText = (text?: string, maxLength = 20) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const calculateProgress = (current: number, goal: number) => {
    if (!goal || goal <= 0) return 0;
    return Math.round((current / goal) * 100);
  };

  const handleSave = () => {
    if (editProgram) {
      onSave(editProgram);
    }
  };

  // Handle file upload untuk create program - Support multiple images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      
      // Update createProgram state dengan preview URLs
      const imageObjects = fileArray.map(file => ({
        image_url: URL.createObjectURL(file)
      }));
      
      setCreateProgram({
        ...createProgram,
        program_donation_images: imageObjects,
      });
    }
  };

  // Remove specific image by index
  const handleRemoveImage = (indexToRemove?: number) => {
    if (indexToRemove !== undefined) {
      // Remove specific image
      const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
      setSelectedFiles(newFiles);
      
      const newImageObjects = newFiles.map(file => ({
        image_url: URL.createObjectURL(file)
      }));
      
      setCreateProgram({
        ...createProgram,
        program_donation_images: newImageObjects,
      });
    } else {
      // Remove all images
      setSelectedFiles([]);
      setCreateProgram({
        ...createProgram,
        program_donation_images: [],
      });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreate = () => {
    const { title, deskripsi, goal_amount } = createProgram;

    if (!title?.trim() || !deskripsi?.trim()) {
      alert("Judul dan deskripsi tidak boleh kosong.");
      return;
    }

    if (!goal_amount || goal_amount <= 0) {
      alert("Goal amount harus lebih dari 0.");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Minimal satu gambar harus diunggah.");
      return;
    }

    // Kirim data dengan file yang sebenarnya
    const programData = {
      ...createProgram,
      selectedImages: selectedFiles // Kirim file yang sebenarnya
    };

    onCreate(programData);
  };

  return (
    <>
    
      {/* View Program Detail Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={onViewModalChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProgram && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProgram.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Display all images */}
                {selectedProgram.program_donation_images && selectedProgram.program_donation_images.length > 0 && (
                  <div className="space-y-2">
                    {selectedProgram.program_donation_images.length === 1 ? (
                      <div className="flex justify-center">
                        <img 
                          src={selectedProgram.program_donation_images[0].image_url} 
                          alt={selectedProgram.title}
                          className="rounded-lg max-h-64 object-cover" 
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium mb-2">Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedProgram.program_donation_images.map((image, index) => (
                            <img 
                              key={index}
                              src={image.image_url} 
                              alt={`${selectedProgram.title} ${index + 1}`}
                              className="rounded-lg h-32 w-full object-cover" 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm">{selectedProgram.deskripsi}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Goal Amount</h4>
                    <p>{formatCurrency(selectedProgram.goal_amount)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Current Amount</h4>
                    <p>{formatCurrency(selectedProgram.current_amount)}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="font-medium">Progress</h4>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, calculateProgress(selectedProgram.current_amount, selectedProgram.goal_amount))}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1">
                      {calculateProgress(selectedProgram.current_amount, selectedProgram.goal_amount)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => onViewModalChange(false)}
                  className='!px-2'
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className='!px-2'
                    onClick={() => {
                      onViewModalChange(false);
                      setTimeout(() => {
                        onEditModalChange(true);
                      }, 300);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                  className='!px-2'
                    variant="destructive"
                    onClick={() => {
                      onViewModalChange(false);
                      setTimeout(() => {
                        onDeleteDialogChange(true);
                      }, 300);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Program Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={onCreateModalChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
            <DialogDescription>Add a new donation program</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="create-title">Title</Label>
              <Input
                type="text"
                id="create-title"
                value={createProgram.title || ''}
                onChange={(e) => setCreateProgram({
                  ...createProgram,
                  title: e.target.value
                })}
                placeholder="Enter program title"
              />
            </div>

            {/* Description */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={createProgram.deskripsi || ''}
                onChange={(e) => setCreateProgram({
                  ...createProgram,
                  deskripsi: e.target.value
                })}
                rows={4}
                className="h-32 overflow-y-auto resize-none" 
                placeholder="Enter program description"
              />
            </div>

            {/* Goal & Current Amount */}
            <div className="">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="create-goal">Goal Amount</Label>
                <Input
                  type="number"
                  id="create-goal"
                  value={createProgram.goal_amount || 0}
                  onChange={(e) => setCreateProgram({
                    ...createProgram,
                    goal_amount: parseFloat(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>

            </div>

            {/* Image Upload - Support Multiple Images */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="create-image">Upload Images</Label>
              <Input
                ref={fileInputRef}
                id="create-image"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              
              {/* Image Preview - Show all selected images */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFiles.map((file, index) => {
                      const previewUrl = URL.createObjectURL(file);
                      return (
                        <div key={index} className="relative">
                          <img 
                            src={previewUrl} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFiles.length} image(s)
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button className='!px-2' variant="outline" onClick={() => onCreateModalChange(false)}>
              Cancel
            </Button>
            <Button
            className='!px-2 bg-[#379777] !opacity-100 hover:bg-[#379777]/80' 
              type="submit"
              onClick={handleCreate}
              disabled={!createProgram.title || !createProgram.deskripsi || selectedFiles.length === 0}
            >
              Create Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Program Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={onEditModalChange}>
        <DialogContent className="sm:max-w-[60%]">
          {editProgram && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Program</DialogTitle>
                <DialogDescription>
                  Make changes to program "{editProgram.title}"
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    type="text"
                    id="edit-title"
                    value={editProgram.title}
                    onChange={(e) => setEditProgram({
                      ...editProgram,
                      title: e.target.value
                    })}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editProgram.deskripsi}
                    onChange={(e) => setEditProgram({
                      ...editProgram,
                      deskripsi: e.target.value
                    })}
                    rows={4}
                  />
                </div>
                
                <div className="">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="edit-goal">Goal Amount</Label>
                    <Input
                      type="number"
                      id="edit-goal"
                      value={editProgram.goal_amount}
                      onChange={(e) => setEditProgram({
                        ...editProgram,
                        goal_amount: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
                
                {/* Display current images */}
                {editProgram.program_donation_images && editProgram.program_donation_images.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      Current Images ({editProgram.program_donation_images.length})
                    </h4>
                    {editProgram.program_donation_images.length === 1 ? (
                      <img 
                        src={editProgram.program_donation_images[0].image_url} 
                        alt={editProgram.title}
                        className="h-24 rounded object-cover" 
                      />
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {editProgram.program_donation_images.map((image, index) => (
                          <img 
                            key={index}
                            src={image.image_url} 
                            alt={`${editProgram.title} ${index + 1}`}
                            className="h-16 w-full rounded object-cover" 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  className='!px-2'
                  variant="outline" 
                  onClick={() => onEditModalChange(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  className='!px-2 bg-[#379777] !opacity-100 hover:bg-[#379777]/80'
                  type="submit"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Data Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={onImportModalChange}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Program Data</DialogTitle>
            <DialogDescription>
              Review the data before importing
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {importErrors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Import Errors:</h4>
                <div className="bg-red-50 p-3 rounded-md">
                  {importErrors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {importData.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Data to Import ({importData.length} items):</h4>
                <div className="max-h-64 overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Goal Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{truncateText(item.deskripsi)}</TableCell>
                          <TableCell>{formatCurrency(item.goal_amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {importStatus === 'success' && (
              <div className="bg-green-50 p-3 rounded-md">
                <div className="text-sm text-green-600">
                  Data imported successfully! The table will refresh automatically.
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onImportModalChange(false)}
              disabled={importStatus === 'loading'}
            >
              Cancel
            </Button>
            {importData.length > 0 && importErrors.length === 0 && (
              <Button 
                onClick={onImportData}
                disabled={importStatus === 'loading'}
              >
                {importStatus === 'loading' ? "Importing..." : `Import ${importData.length} Items`}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the program 
              {selectedProgram ? ` "${selectedProgram.title}"` : ""}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='!px-2' disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete} 
              className="bg-red-600 hover:bg-red-700 !px-2"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};