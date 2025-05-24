// TableActivity.tsx - Main refactored component
import { useEffect, useState, useMemo } from "react";
import { createInitialFormState } from "../../utils/activity";

import { useActivity } from "@/hooks/orphanage-activity/use-activity";
import useDebounce from "@/hooks/orphanage-activity/use-debounce";

import { ProgramPagination } from "@/components/pagination/pagination-program";
import type { Activity, ActivityFilters, ActivityFormData } from "@/types/activity";
import { useActivityOperations } from "@/hooks/orphanage-activity/use-activity-admin";
import { ActivityTable } from "@/components/activity/activity-table";
import { CreateActivityModal } from "@/components/activity/create-activity";
import { ViewActivityModal } from "@/components/activity/view-activity";
import { EditActivityModal } from "@/components/activity/edit-activity";
import { DeleteActivityDialog } from "@/components/activity/delete-activity";
import { SearchHeader } from "@/components/activity/search-header";

// Import components


export default function TableActivity() {
  // State for pagination and search
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const pageSize = 10;
  
  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(searchInput, 500);
  
  // State for the selected activity and modals
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  
  // Form state for create modal
  const [formData, setFormData] = useState<ActivityFormData>(createInitialFormState());

  // Prepare filters object for React Query
  const filters: ActivityFilters = useMemo(() => ({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined
  }), [page, debouncedSearch, pageSize]);

  // Fetch data with React Query
  const { 
    data: activityData,
    isLoading: isLoadingActivities,
    error: activitiesError,
    refetch 
  } = useActivity(filters);
  
  // Use custom hook for CRUD operations
  const {
    updateStatus,
    deleteStatus,
    createStatus,
    isUpdating,
    isDeleting,
    isCreating,
    updateError,
    deleteError,
    createError,
    handleUpdateActivity,
    handleDeleteActivity,
    handleCreateActivity
  } = useActivityOperations(refetch);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearch !== searchInput && page !== 1) {
      setPage(1);
    }
  }, [debouncedSearch, searchInput, page]);

  // Reset selected activity when closing modals
  useEffect(() => {
    if (!isViewModalOpen && !isEditModalOpen) {
      const timer = setTimeout(() => {
        setSelectedActivity(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isViewModalOpen, isEditModalOpen]);

  // Close modals when operations succeed
  useEffect(() => {
    if (updateStatus === 'success') {
      setIsEditModalOpen(false);
    }
  }, [updateStatus]);

  useEffect(() => {
    if (deleteStatus === 'success') {
      setIsDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  }, [deleteStatus]);

  useEffect(() => {
    if (createStatus === 'success') {
      setIsCreateModalOpen(false);
      setFormData(createInitialFormState());
    }
  }, [createStatus]);

  const hasActivities = activityData?.data && activityData.data.length > 0;
  const totalPages = activityData?.pagination?.total_page || 1;

  // Handler functions
  const handleViewActivity = (activity: Activity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedActivity({...activity});
    setIsViewModalOpen(true);
  };

  const handleUpdateActivityModal = (activity: Activity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedActivity({...activity});
    setIsEditModalOpen(true);
  };

  const handleSaveActivity = async () => {
    if (selectedActivity) {
      const payload = {
        title: selectedActivity.title,
        description: selectedActivity.description,
        location: selectedActivity.location,
        time: selectedActivity.time
      };
      
      await handleUpdateActivity(selectedActivity.id, payload);
    }
  };

  const handleDeleteActivityModal = (activity: Activity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivityToDelete({...activity});
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (activityToDelete) {
      await handleDeleteActivity(activityToDelete.id);
    }
  };

  const handleCreateActivitySubmit = async () => {
    await handleCreateActivity(formData);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
  };

  const handleFormDataChange = (data: Partial<ActivityFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    setFormData(createInitialFormState());
  };

  const handleSelectedActivityChange = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  // Handle errors and loading states
  if (isLoadingActivities) return <div className="py-4 text-center">Loading activities...</div>;
  if (activitiesError) return <div className="py-4 text-center text-red-500">Error loading data: {(activitiesError as Error).message}</div>;
  if (!activityData) return <div className="py-4 text-center">No data available</div>;

  return (
    <div className="space-y-4">
      {/* Header with Search and Create Button */}
      <SearchHeader
        searchInput={searchInput}
        debouncedSearch={debouncedSearch}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onCreateActivity={() => setIsCreateModalOpen(true)}
      />

      {/* Main Table */}
      <ActivityTable
        activityData={activityData}
        page={page}
        pageSize={pageSize}
        debouncedSearch={debouncedSearch}
        onViewActivity={handleViewActivity}
        onEditActivity={handleUpdateActivityModal}
        onDeleteActivity={handleDeleteActivityModal}
      />

      {/* Pagination */}
      <ProgramPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Activity Modal */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        isCreating={isCreating}
        formData={formData}
        createError={createError}
        onOpenChange={setIsCreateModalOpen}
        onFormDataChange={handleFormDataChange}
        onCreateActivity={handleCreateActivitySubmit}
        onCancel={handleCreateCancel}
      />

      {/* View Activity Detail Modal */}
      <ViewActivityModal
        isOpen={isViewModalOpen}
        activity={selectedActivity}
        onOpenChange={setIsViewModalOpen}
        onEdit={handleUpdateActivityModal}
        onDelete={handleDeleteActivityModal}
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={isEditModalOpen}
        isUpdating={isUpdating}
        selectedActivity={selectedActivity}
        updateError={updateError}
        onOpenChange={setIsEditModalOpen}
        onActivityChange={handleSelectedActivityChange}
        onSaveActivity={handleSaveActivity}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteActivityDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        activityToDelete={activityToDelete}
        deleteError={deleteError}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
}