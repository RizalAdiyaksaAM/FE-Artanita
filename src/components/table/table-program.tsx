// components/program-donation/TableProgram.tsx
import  { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useUpdateProgramDetail from "@/api/program-donation/update-program";
import useDeleteProgramDetail from "@/api/program-donation/delete-program";
import { programs, type ProgramDonationPayload } from "@/api/program-donation/create-program";
import { useFilteredProgramDonations } from "@/hooks/program-donations/use-program-donation";
import type { ImportData, ProgramDonation, ProgramDonationResponse } from "@/types/program";
import { SearchAndControls } from "../search/search-control-program";
import { ProgramTable } from "./table-programs";
import { ProgramModals } from "../modals/program-table";
import { ProgramPagination } from "../pagination/pagination-program";

// Import our new components


// Import types


export default function TableProgram() {
  // State for pagination and search
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [limit] = useState(4);
  
  // State for the selected program and modals
  const [selectedProgram, setSelectedProgram] = useState<ProgramDonation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Import related states
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Fetch data with pagination and search
  const { data, isLoading, error, refetch } = useFilteredProgramDonations({
    page,
    limit,
    search
  });

  // API hooks for update and delete
  const { 
    updateProgram, 
    isLoading: isUpdating, 
    error: updateError, 
    response: updateResponse 
  } = useUpdateProgramDetail();
  
  const { 
    deleteProgram, 
    isLoading: isDeleting, 
    error: deleteError, 
    response: deleteResponse 
  } = useDeleteProgramDetail();

  const safeRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Watch for API responses
  useEffect(() => {
    const shouldCloseModal = updateResponse?.status === 'success';
    const hasError = updateError !== null;

    if (shouldCloseModal || hasError) {
      setUpdateStatus(shouldCloseModal ? 'success' : 'error');
      setIsEditModalOpen(false);
    }
  }, [updateResponse, updateError]);

  useEffect(() => {
    if (!isEditModalOpen && updateStatus === 'success') {
      const timeout = setTimeout(() => {
        setUpdateStatus('idle');
        safeRefresh();
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isEditModalOpen, updateStatus]);
  
  useEffect(() => {
    if (deleteResponse?.status && deleteStatus === "success") {
      setDeleteStatus('success');
      setIsDeleteDialogOpen(false);
      
      setTimeout(() => {
        setDeleteStatus('idle');
        setSelectedProgram(null);
        refetch();
      }, 300);
    } else if (deleteError) {
      setDeleteStatus('error');
    }
  }, [deleteResponse, deleteError, refetch]);

  useEffect(() => {
    if (!isViewModalOpen && !isEditModalOpen && updateStatus === 'idle') {
      const timeout = setTimeout(() => {
        setSelectedProgram(null);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [isViewModalOpen, isEditModalOpen, updateStatus]);

  const programDonationsData = data as ProgramDonationResponse | undefined;
  const hasPrograms = programDonationsData?.data && programDonationsData.data.length > 0;
  const totalPages = programDonationsData?.pagination?.total_page || 1;

  // Search functionality
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // Import functionality
  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const parsedData = parseCSV(csvText);
        setImportData(parsedData);
        setImportErrors([]);
        setIsImportModalOpen(true);
      } catch (error) {
        setImportErrors(['Failed to parse CSV file. Please check the format.']);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string): ImportData[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have header and at least one data row');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['title', 'deskripsi', 'goal_amount'];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const titleIndex = headers.indexOf('title');
      const deskripsiIndex = headers.indexOf('deskripsi');
      const goalAmountIndex = headers.indexOf('goal_amount');
      const imageUrlIndex = headers.indexOf('image_url');

      if (values.length < headers.length) {
        throw new Error(`Row ${index + 2} has insufficient columns`);
      }

      const goalAmount = parseFloat(values[goalAmountIndex]);
      if (isNaN(goalAmount) || goalAmount <= 0) {
        throw new Error(`Row ${index + 2} has invalid goal_amount`);
      }

      return {
        title: values[titleIndex] || '',
        deskripsi: values[deskripsiIndex] || '',
        goal_amount: goalAmount,
        image_url: imageUrlIndex >= 0 ? values[imageUrlIndex] : undefined
      };
    });
  };

  const handleImportData = async () => {
    if (importData.length === 0) return;

    setImportStatus('loading');
    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < importData.length; i++) {
      const item = importData[i];
      try {
        const payload: ProgramDonationPayload = {
          title: item.title,
          deskripsi: item.deskripsi,
          goal_amount: item.goal_amount,
          program_donation_images: item.image_url ? [{ image_url: item.image_url }] : []
        };

        await programs(payload);
        successCount++;
      } catch (error) {
        errors.push(`Row ${i + 2}: Failed to import "${item.title}"`);
      }
    }

    if (errors.length > 0) {
      setImportErrors(errors);
      setImportStatus('error');
    } else {
      setImportStatus('success');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportData([]);
        setImportStatus('idle');
        refetch();
      }, 2000);
    }
  };

  // Program actions
  const handleViewProgram = (program: ProgramDonation) => {
    setSelectedProgram({...program});
    setIsViewModalOpen(true);
  };

  const handleUpdateProgram = (program: ProgramDonation) => {
    setSelectedProgram({...program});
    setIsEditModalOpen(true);
  };

  const handleCreateProgram = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveProgram = async (program: ProgramDonation) => {
    if (program) {
      const payload = {
        title: program.title,
        deskripsi: program.deskripsi,
        goal_amount: program.goal_amount,
        current_amount: program.current_amount
      };
      
      try {
        await updateProgram(program.id.toString(), payload);
      } catch (err) {
        console.error("Failed to update program:", err);
      }
    }
  };

// components/program-donation/TableProgram.tsx - Updated handleCreateNewProgram function
const handleCreateNewProgram = async (programData: Partial<ProgramDonation> & { selectedImages?: File[] }) => {
  try {
    const payload: ProgramDonationPayload = {
      title: programData.title || '',
      deskripsi: programData.deskripsi || '',
      goal_amount: programData.goal_amount || 0,
      program_donation_images: []
    };

    // Jika ada file gambar yang dipilih, tambahkan ke payload
    if (programData.selectedImages && programData.selectedImages.length > 0) {
      // Untuk sementara, kita buat object URL sebagai placeholder
      // Nanti di API function, kita akan menggunakan file yang sebenarnya
      payload.program_donation_images = programData.selectedImages.map(file => ({
        image_url: file.name // atau bisa menggunakan URL.createObjectURL(file)
      }));
      
      // Tambahkan file ke payload untuk dikirim ke API
      (payload as any).imageFiles = programData.selectedImages;
    }

    await programs(payload);
    setIsCreateModalOpen(false);
    refetch();
  } catch (error) {
    console.error("Failed to create program:", error);
  }
};

  const handleDeleteProgram = (program: ProgramDonation) => {
    setSelectedProgram({...program});
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProgram) {
      try {
        await deleteProgram(selectedProgram.id.toString());
      } catch (err) {
        console.error("Failed to delete program:", err);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) return <div className="py-4 text-center">Loading...</div>;
  if (error) return <div className="py-4 text-center text-red-500">Error loading data: {(error as Error).message}</div>;
  if (!programDonationsData) return <div className="py-4 text-center">No data available</div>;

  return (
    <div className="space-y-4">
      {/* Search and Import Controls */}
      <SearchAndControls
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        onImportCSV={handleImportCSV}
        onCreateNew={handleCreateProgram}
      />

      {/* Loading/Status indicators */}
      {isRefreshing && (
        <div className="text-center text-sm text-gray-500">Memuat ulang data...</div>
      )}

      {/* Results info */}
      {search && (
        <div className="text-sm text-gray-600">
          {hasPrograms 
            ? `Found ${programDonationsData.data.length} programs matching "${search}"`
            : `No programs found for "${search}"`
          }
        </div>
      )}

      {/* Table */}
      {!hasPrograms ? (
        <div className="py-8 text-center">
          <div className="text-gray-500 mb-4">
            {search ? `No programs found for "${search}"` : 'No donation programs found'}
          </div>
          {search && (
            <Button variant="outline" onClick={clearSearch}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <>
          <ProgramTable
            programs={programDonationsData.data}
            onView={handleViewProgram}
            onEdit={handleUpdateProgram}
            onDelete={handleDeleteProgram}
          />

          {/* Pagination Component */}
          <ProgramPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* All Modals */}
      <ProgramModals
        selectedProgram={selectedProgram}
        isViewModalOpen={isViewModalOpen}
        isEditModalOpen={isEditModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isImportModalOpen={isImportModalOpen}
        onViewModalChange={setIsViewModalOpen}
        onEditModalChange={setIsEditModalOpen}
        onCreateModalChange={setIsCreateModalOpen}
        onDeleteDialogChange={setIsDeleteDialogOpen}
        onImportModalChange={setIsImportModalOpen}
        onSave={handleSaveProgram}
        onCreate={handleCreateNewProgram}
        onDelete={confirmDelete}
        importData={importData}
        importErrors={importErrors}
        importStatus={importStatus}
        onImportData={handleImportData}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
}