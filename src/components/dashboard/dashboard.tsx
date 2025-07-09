import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import iconProgram from "../../assets/svg/program-donasi.svg";
import iconDonasi from "../../assets/svg/Icon-donasi.svg";
import iconDonatur from "../../assets/svg/Icon-donatur.svg";
import DashboardDonatur from "../dashboard-donasi";
import DashboardDonasiTerpakai from "../dashboard-donasi-terpakai"; // Import komponen baru
import { ArrowRightIcon } from "lucide-react";

// Types
type DashboardProps = {
  use_donation: number;
  total_donation: number;
  unique_donators_count: number;
};

type ModalType = 'donasi-terkumpul' | 'donasi-terpakai' | null;

// Constants
const DASHBOARD_CONFIG = {
  ANIMATION: {
    DURATION: 0.5,
    STAGGER_DELAY: 0.1,
  },
  CURRENCY: {
    LOCALE: "id-ID",
    PREFIX: "Rp ",
  },
} as const;

// Utility functions
const formatCurrency = (amount: number): string => {
  const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return validAmount.toLocaleString(DASHBOARD_CONFIG.CURRENCY.LOCALE);
};

const formatCurrencyWithPrefix = (amount: number): string => {
  return `${DASHBOARD_CONFIG.CURRENCY.PREFIX}${formatCurrency(amount)}`;
};

/**
 * Hook untuk mengelola state modal
 */
const useModal = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const isModalOpen = (type: ModalType) => activeModal === type;

  return {
    activeModal,
    openModal,
    closeModal,
    isModalOpen,
  };
};

/**
 * Komponen Dashboard untuk menampilkan statistik program donasi
 */
const Dashboard: React.FC<DashboardProps> = ({
  use_donation,
  total_donation,
  unique_donators_count,
}) => {
  const { activeModal, openModal, closeModal } = useModal();

  // Konfigurasi dashboard items
  const dashboardItems = [
    {
      id: 'donasi-terkumpul',
      icon: iconProgram,
      alt: "Donasi Terkumpul",
      label: "Donasi Terkumpul",
      value: formatCurrencyWithPrefix(total_donation),
      clickable: true,
      onClick: () => openModal('donasi-terkumpul'),
    },
    {
      id: 'donasi-terpakai',
      icon: iconDonasi,
      alt: "Donasi Terpakai",
      label: "Donasi Terpakai",
      value: formatCurrencyWithPrefix(use_donation),
      clickable: true,
      onClick: () => openModal('donasi-terpakai'),
    },
    {
      id: 'total-donatur',
      icon: iconDonatur,
      alt: "Total Donasi",
      label: "Total Donasi",
      value: formatCurrency(unique_donators_count),
      clickable: false,
    },
  ];

  // Render modal content berdasarkan tipe
  const renderModalContent = () => {
    switch (activeModal) {
      case 'donasi-terkumpul':
        return <DashboardDonatur />;
      case 'donasi-terpakai':
        return <DashboardDonasiTerpakai />;
      default:
        return null;
    }
  };

  return (
    <>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DASHBOARD_CONFIG.ANIMATION.DURATION }}
      >
        {dashboardItems.map((item, index) => (
          <DashboardItem
            key={item.id}
            {...item}
            index={index}
          />
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <Modal onClose={closeModal} title={getModalTitle(activeModal)}>
            {renderModalContent()}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper function untuk mendapatkan title modal
const getModalTitle = (modalType: ModalType): string => {
  const titles = {
    'donasi-terkumpul': 'Detail Donasi Terkumpul',
    'donasi-terpakai': 'Detail Donasi Terpakai',
  };
  return titles[modalType as keyof typeof titles] || '';
};

// Dashboard Item Component
type DashboardItemProps = {
  id: string;
  icon: string;
  alt: string;
  label: string;
  value: string;
  index?: number;
  clickable?: boolean;
  onClick?: () => void;
};

const DashboardItem: React.FC<DashboardItemProps> = ({ 
  icon, 
  alt, 
  label, 
  value, 
  index = 0,
  clickable = false,
  onClick
}) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const isEmptyValue = value === "0" || value === "Rp 0";

  return (
    <motion.div 
      className={`
        relative flex flex-col lg:flex-col gap-4 lg:gap-2 items-start justify-center 
        bg-white p-6 rounded-lg shadow-lg 
        hover:shadow-xl transition-all duration-300
        ${clickable ? 'cursor-pointer hover:bg-gray-50' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: DASHBOARD_CONFIG.ANIMATION.DURATION, 
        delay: index * DASHBOARD_CONFIG.ANIMATION.STAGGER_DELAY
      }}
      whileHover={{ scale: clickable ? 1.02 : 1.01 }}
      whileTap={clickable ? { scale: 0.98 } : {}}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className=" flex mt-2 items-start gap-6 justify-center">
        <img 
          src={icon} 
          alt={alt} 
          className="w-[77px] h-[77px] object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="">
          <div className="flex items-center gap-2">
        <p className="text-black font-semibold text-xl mb-1 break-words">
          {label}
        </p>
       {clickable && (
    <div className="flex-shrink-0 absolute right-3 top-2 ">
<div className="w-8 h-8 bg-[#379777] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 group hover:scale-110 hover:rotate-12">
  <ArrowRightIcon className="h-4 w-4 -rotate-40 text-white transform transition-transform duration-300 group-hover:rotate-20" />
</div>

    </div>
  )}
          </div>
            
          
      {/* Content */}
      <div className="flex-1 mt-1 min-w-0 ">
        <p 
          className="text-[34px] font-bold text-[#379777] leading-tight break-all"
          style={{ wordBreak: 'break-word' }}
        >
          {value || "0"}
        </p>
        {isEmptyValue && (
          <p className="text-sm text-gray-500 mt-1">
            Belum ada data
          </p>
        )}
      </div>
        </div>
        
      </div>

    </motion.div>
  );
};

// Chevron Right Icon Component


// Close Icon Component
const CloseIcon: React.FC = () => (
  <svg 
    className="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M6 18L18 6M6 6l12 12" 
    />
  </svg>
);

// Modal Component
type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
};

const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-auto"
            aria-label="Tutup modal"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;