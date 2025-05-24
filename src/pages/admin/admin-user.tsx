// Main component: TableUser.tsx
import { useEffect, useState, useMemo } from "react";
import { createInitialUserFormState } from "../../utils/user";
import { toast } from "sonner"; // or your notification library

import useDebounce from "@/hooks/orphanage-activity/use-debounce";
import { ProgramPagination } from "@/components/pagination/pagination-program";
import type { User,  UserFormData } from "@/types/user";
import { SearchHeaderUser } from "@/components/users/search-header";
import { UserTable } from "@/components/users/user-table";
import { ViewUserModal } from "@/components/users/view-user-modal";
import usersUpdate from "@/api/orphanage-user/update-user";
import { useDeleteUser } from "@/api/orphanage-user/delete-user";
import { CreateUserModal } from "@/components/users/create-user";
import { EditUserModal } from "@/components/users/edit-user";
import { DeleteUserDialog } from "@/components/users/delete-user";
import { createUser, type UserPayload } from "@/api/orphanage-user/create-user";
import { useFilteredUsers } from "@/hooks/users/use-users";

export default function TableUser() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    address: "",
    age: "",
    education: "",
    position: ""
  });
  const pageSize = 10;
  
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<UserFormData>(createInitialUserFormState());
  const [editFormData, setEditFormData] = useState<UserFormData>(createInitialUserFormState());

  // Create query filters object for the API hook
  const queryFilters = useMemo(() => ({
    page,
    limit: pageSize,
    searchName: debouncedSearch || "",
    filterAddress: filters.address || "all",
    filterAge: filters.age || "all", 
    filterEducation: filters.education || "all",
    filterPosition: filters.position || "all"
  }), [page, debouncedSearch, filters, pageSize]);

  const { 
    data: userData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch 
  } = useFilteredUsers(queryFilters);

  const { updateUser, isLoading: isUpdating, error: updateError, response: updateResponse } = usersUpdate();
  const { deleteUser, isLoading: isDeleting, error: deleteError, response: deleteResponse } = useDeleteUser();

  // Create User State
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<any>(null);

  useEffect(() => {
    if (debouncedSearch !== searchInput && page !== 1) {
      setPage(1);
    }
  }, [debouncedSearch, searchInput, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (!isViewModalOpen && !isEditModalOpen) {
      const timer = setTimeout(() => {
        setSelectedUser(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isViewModalOpen, isEditModalOpen]);

  // Handle successful operations
  useEffect(() => {
    if (updateResponse?.status === 'success') {
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditFormData(createInitialUserFormState());
      refetch();
    }
  }, [updateResponse, refetch]);

  useEffect(() => {
    if (deleteResponse?.status === 'success') {
      toast.success("User deleted successfully!");
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      refetch();
    }
  }, [deleteResponse, refetch]);

  const hasUsers = userData?.data && userData.data.length > 0;
  const totalPages = userData?.pagination?.total_page || 1;

  const handleViewUser = (user: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedUser({...user});
    setIsViewModalOpen(true);
  };

  const handleUpdateUserModal = (user: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedUser({...user});
    // Populate edit form with user data
    setEditFormData({
      name: user.name,
      address: user.address,
      age: user.age,
      education: user.education,
      position: user.position,
      imageFile: null // Will be handled separately for file upload
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUserModal = (user: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUserToDelete({...user});
    setIsDeleteDialogOpen(true);
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

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [filterType]: value === "all" ? "" : value 
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      address: "",
      age: "",
      education: "",
      position: ""
    });
    setSearchInput("");
  };

  const handleCreateUser = async () => {
    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.age ||
      !formData.education ||
      !formData.position
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const payload: UserPayload = {
        name: formData.name,
        address: formData.address,
        age: Number(formData.age),
        education: formData.education,
        position: formData.position,
        image: formData.imageFile || "" // File or empty string
      };

      await createUser(payload);
      toast.success("User created successfully!");
      setIsCreateModalOpen(false);
      setFormData(createInitialUserFormState());
      refetch();
    } catch (error) {
      setCreateError(error as Error);
      toast.error("Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveUser = async () => {
    if (
      !selectedUser ||
      !editFormData.name.trim() ||
      !editFormData.address.trim() ||
      !editFormData.age ||
      !editFormData.education ||
      !editFormData.position
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      name: editFormData.name,
      address: editFormData.address,
      age: Number(editFormData.age),
      education: editFormData.education,
      position: editFormData.position,
      image: editFormData.imageFile || "" // Will be handled as File in update if needed
    };

    try {
      await updateUser(selectedUser.id, payload);
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  // Delete User Handler
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    await deleteUser(userToDelete.id);
  };

  // Cancel handlers
  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    setFormData(createInitialUserFormState());
    setCreateError(null);
  };

  const handleFormDataChange = (data: Partial<UserFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleEditFormDataChange = (data: Partial<UserFormData>) => {
    setEditFormData(prev => ({ ...prev, ...data }));
  };

  if (isLoadingUsers) return <div className="py-4 text-center">Loading users...</div>;
  if (usersError) return <div className="py-4 text-center text-red-500">Error loading data: {(usersError as Error).message}</div>;
  if (!userData) return <div className="py-4 text-center">No data available</div>;

  return (
    <div className="space-y-4">
      <SearchHeaderUser
        searchInput={searchInput}
        debouncedSearch={debouncedSearch}
        filters={filters}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onCreateUser={() => setIsCreateModalOpen(true)}
      />

      <UserTable
        userData={userData}
        page={page}
        pageSize={pageSize}
        debouncedSearch={debouncedSearch}
        onViewUser={handleViewUser}
        onEditUser={handleUpdateUserModal}
        onDeleteUser={handleDeleteUserModal}
      />

      <ProgramPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        user={selectedUser}
        onOpenChange={setIsViewModalOpen}
        onEdit={handleUpdateUserModal}
        onDelete={handleDeleteUserModal}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        isCreating={isCreating}
        formData={formData}
        createError={createError}
        onOpenChange={setIsCreateModalOpen}
        onFormDataChange={handleFormDataChange}
        onCreateUser={handleCreateUser}
        onCancel={handleCancelCreate}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        isUpdating={isUpdating}
        selectedUser={selectedUser}
        formData={editFormData}
        updateError={updateError}
        onOpenChange={setIsEditModalOpen}
        onFormDataChange={handleEditFormDataChange}
        onSaveUser={handleSaveUser}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        userToDelete={userToDelete}
        deleteError={deleteError}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}