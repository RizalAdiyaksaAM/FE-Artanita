import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Donation } from '@/api/donation/dashboard';
import { useDonationUse } from '@/hooks/donation/use-donation';

// Utility function untuk format currency
const formatCurrency = (amount: number): string => {
  const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return validAmount.toLocaleString("id-ID");
};

// Utility function untuk format tanggal
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

// Utility function untuk truncate text
const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-200 rounded-lg p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

// Error component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ 
  message, 
  onRetry 
}) => (
  <div className="text-center py-8">
    <div className="text-red-500 mb-4">
      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-gray-600">
        {message || 'Terjadi kesalahan saat memuat data'}
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Coba Lagi
      </button>
    )}
  </div>
);

// Empty state component
const EmptyState: React.FC = () => (
  <div className="text-center py-8">
    <div className="text-gray-400 mb-4">
      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8a2 2 0 00-2-2H9a2 2 0 00-2 2v1" />
      </svg>
      <p className="text-lg font-medium text-gray-500 mb-2">
        Belum Ada Donasi Terpakai
      </p>
      <p className="text-gray-400">
        Data penggunaan donasi akan muncul di sini setelah donasi digunakan
      </p>
    </div>
  </div>
);

// Donation card component
const DonationCard: React.FC<{ donation: Donation; index: number }> = ({ 
  donation, 
  index 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/activity/details/${donation.id}`);
  };

  return (
    <motion.div
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={handleCardClick}
      whileHover={{ y: -2 }}
    >
      <div className="space-y-3">
        {/* Title */}
        <h4 className="font-semibold !mb-2 text-gray-800 text-lg leading-tight hover:text-[#379777] transition-colors">
          {donation.title}
        </h4>
        
        {/* Description - Truncated */}
        {donation.description && (
          <p className="text-gray-600 !mb-2 text-sm leading-relaxed">
            {truncateText(donation.description, 120)}
          </p>
        )}
        
        {/* Location and Time */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-500">
          {donation.location && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{donation.location}</span>
            </div>
          )}
          
          {donation.time && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDate(donation.time)}</span>
            </div>
          )}
        </div>
        
        {/* Amount Used */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Jumlah Terpakai:
            </span>
            <span className="text-lg font-bold text-red-600">
              Rp {formatCurrency(donation.use_donation)}
            </span>
          </div>
        </div>

        {/* Read More Indicator */}
        {donation.description && donation.description.length > 120 && (
          <div className="flex justify-end">
            <span className="text-xs text-[#379777] font-medium hover:text-[#2a7259] transition-colors">
              Baca selengkapnya →
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main component
const DashboardDonasiTerpakai: React.FC = () => {
  const { data, isLoading, error, refetch } = useDonationUse();

  // Calculate total donation used
  const totalUsed = React.useMemo(() => {
    if (!data?.data) return 0;
    return data.data.reduce((total, donation) => total + donation.use_donation, 0);
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Detail Donasi Terpakai
        </h3>
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Detail Donasi Terpakai
        </h3>
        <ErrorMessage 
          message="Gagal memuat data donasi terpakai" 
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Detail Donasi Terpakai
        </h3>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Detail Donasi Terpakai
        </h3>
        <p className="text-sm text-gray-600">
          Total {data.data.length} program telah menggunakan donasi
        </p>
      </div>

      {/* Summary */}
      <motion.div 
        className="bg-red-50 border border-red-200 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-red-800">
              Total Donasi Terpakai
            </p>
            <p className="text-xs text-red-600">
              Dari {data.data.length} program
            </p>
          </div>
          <p className="text-2xl font-bold text-red-700">
            Rp {formatCurrency(totalUsed)}
          </p>
        </div>
      </motion.div>

      {/* Donation List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
          Rincian Penggunaan
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {data.data.map((donation, index) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardDonasiTerpakai;