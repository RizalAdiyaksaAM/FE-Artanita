export interface ProgramDonationImage {
  image_url: string;
}

export interface ProgramDonation {
  id: string | number;
  number: number;
  title: string;
  deskripsi: string;
  goal_amount: number;
  current_amount: number;
  program_donation_images?: ProgramDonationImage[];
}

export interface PaginationData {
  total_page: number;
}

export interface ProgramDonationResponse {
  data: ProgramDonation[];
  pagination?: PaginationData;
}

export interface ImportData {
  title: string;
  deskripsi: string;
  goal_amount: number;
  image_url?: string;
}

export interface TableProgramProps {
  data?: ProgramDonationResponse;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (data: any) => Promise<void>;
}

export interface SearchAndControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onImportCSV: (file: File) => void;
  onCreateNew: () => void;
}

export interface ProgramTableProps {
  programs: ProgramDonation[];
  onView: (program: ProgramDonation) => void;
  onEdit: (program: ProgramDonation) => void;
  onDelete: (program: ProgramDonation) => void;
}

export interface ProgramModalsProps {
  selectedProgram: ProgramDonation | null;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isCreateModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isImportModalOpen: boolean;
  onViewModalChange: (open: boolean) => void;
  onEditModalChange: (open: boolean) => void;
  onCreateModalChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onImportModalChange: (open: boolean) => void;
  onSave: (program: ProgramDonation) => void;
  onCreate: (program: Partial<ProgramDonation>) => void;
  onDelete: () => void;
  importData: ImportData[];
  importErrors: string[];
  importStatus: 'idle' | 'loading' | 'success' | 'error';
  onImportData: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}