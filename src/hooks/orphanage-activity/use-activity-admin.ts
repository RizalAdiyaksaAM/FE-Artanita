// hooks/useActivityOperations.ts
import { useState, useEffect, useCallback } from "react";

import useUpdateActivity from "@/api/orphanage-activity/update-activity";
import useDeleteActivity from "@/api/orphanage-activity/delete-activity";
import { useCreateActivity } from "@/api/orphanage-activity/create-activity";
import type {  ActivityFormData } from "@/types/activity";

export const useActivityOperations = (refetch: () => void) => {
  // State for operations status
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [createStatus, setCreateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // API hooks
  const { 
    updateActivity, 
    isLoading: isUpdating, 
    error: updateError, 
    response: updateResponse 
  } = useUpdateActivity();
  
  const { 
    deleteActivity, 
    isLoading: isDeleting, 
    error: deleteError, 
    response: deleteResponse 
  } = useDeleteActivity();
  
  const { 
    createActivity, 
    isLoading: isCreating, 
    error: createError, 
    response: createResponse 
  } = useCreateActivity();

  // Handle update response
  useEffect(() => {
    if (updateResponse?.status === "success") {
      setUpdateStatus('success');
      
      // Delay to show success state briefly, then refetch
      const timer = setTimeout(() => {
        setUpdateStatus('idle');
        refetch();
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (updateError) {
      setUpdateStatus('error');
      console.error("Update error:", updateError);
    }
  }, [updateResponse, updateError, refetch]);
  
  // Handle delete response with improved error handling
  useEffect(() => {
    if (deleteResponse?.status === "success") {
      setDeleteStatus('success');
      
      // Immediately refetch data after successful delete
      const timer = setTimeout(() => {
        setDeleteStatus('idle');
        refetch();
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (deleteError) {
      setDeleteStatus('error');
      console.error("Delete error:", deleteError);
      
      // Even if there's an error, try to refetch to see current state
      const timer = setTimeout(() => {
        refetch();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [deleteResponse, deleteError, refetch]);
  
  // Handle create response
  useEffect(() => {
    if (createResponse?.status === "success") {
      setCreateStatus('success');
      
      const timer = setTimeout(() => {
        setCreateStatus('idle');
        refetch();
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (createError) {
      setCreateStatus('error');
      console.error("Create error:", createError);
    }
  }, [createResponse, createError, refetch]);

  // Define the UpdatePayload type to match the API expectation
  type UpdatePayload = {
    title: string;
    description: string;
    location: string;
    time: string;
  };

  // Operation handlers with improved error handling
  const handleUpdateActivity = useCallback(async (activityId: string, payload: UpdatePayload) => {
    try {
      setUpdateStatus('idle'); // Reset status before operation
      await updateActivity(activityId, payload);
    } catch (err) {
      console.error("Failed to update activity:", err);
      setUpdateStatus('error');
    }
  }, [updateActivity]);



  const handleDeleteActivity = useCallback(async (activityId: string) => {
    try {
      setDeleteStatus('idle'); // Reset status before operation
      await deleteActivity(activityId);
    } catch (err) {
      console.error("Failed to delete activity:", err);
      setDeleteStatus('error');
      // Still try to refetch after error to show current state
      setTimeout(() => refetch(), 1000);
    }
  }, [deleteActivity, refetch]);

  const handleCreateActivity = useCallback(async (formData: ActivityFormData) => {
    try {
      setCreateStatus('idle'); // Reset status before operation
      await createActivity(formData);
    } catch (err) {
      console.error("Failed to create activity:", err);
      setCreateStatus('error');
    }
  }, [createActivity]);

  return {
    // Status
    updateStatus,
    deleteStatus,
    createStatus,
    
    // Loading states
    isUpdating,
    isDeleting,
    isCreating,
    
    // Errors
    updateError,
    deleteError,
    createError,
    
    // Handlers
    handleUpdateActivity,
    handleDeleteActivity,
    handleCreateActivity,
    
    // Reset functions
    resetUpdateStatus: () => setUpdateStatus('idle'),
    resetDeleteStatus: () => setDeleteStatus('idle'),
    resetCreateStatus: () => setCreateStatus('idle')
  };
};