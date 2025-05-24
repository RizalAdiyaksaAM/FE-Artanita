import ProgramDonation from "@/components/card/program-donations";
import Dashboard from "@/components/dashboard/dashboard";
import { useDashboard } from "@/hooks/donation/use-donation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useFilteredProgramDonations } from "@/hooks/program-donations/use-program-donation";

type DashboardData = {
  program_count: number;
  total_donation: number;
  unique_donators_count: number;
};

export default function CampaignPage() {
  // State untuk halaman saat ini
  const [currentPage, setCurrentPage] = useState(1);
  // Tetapkan limit item per halaman
  const limit = 6;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Menggunakan custom hooks untuk mendapatkan data dengan parameter pagination
  const {
    data: programDonationsData,
    isLoading: isProgramLoading,
    error: programError,
  } = useFilteredProgramDonations({ page: currentPage, limit });

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboard();

  // State untuk menyimpan data dashboard
  const [dashboard, setDashboard] = useState<DashboardData>({
    program_count: 0,
    total_donation: 0,
    unique_donators_count: 0,
  });

  // State untuk menyimpan informasi pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalData: 0,
  });

  // Memperbarui state dashboard saat data baru tersedia
  useEffect(() => {
    // Akses data dengan struktur yang sesuai berdasarkan console log
    if (dashboardData?.status === "success" && dashboardData?.data) {
      setDashboard({
        program_count: dashboardData.data.program_count,
        total_donation: dashboardData.data.total_donation,
        unique_donators_count: dashboardData.data.unique_donators_count,
      });
    }
  }, [dashboardData]);

  // Memperbarui state pagination saat data program donations berubah
  useEffect(() => {
    if (programDonationsData?.status === "success" && programDonationsData?.pagination) {
      setPagination({
        currentPage: programDonationsData.pagination.current_page,
        totalPage: programDonationsData.pagination.total_page,
        totalData: programDonationsData.pagination.total_data,
      });
    }
  }, [programDonationsData]);

  // Handle pergantian halaman
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
    }
  };

  // Tampilkan loading saat data sedang dimuat
  if (isProgramLoading || isDashboardLoading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (programError instanceof Error) {
    return (
      <div className="container py-20 text-center">
        Error with Program Donations: {programError.message}
      </div>
    );
  }

  if (dashboardError instanceof Error) {
    return (
      <div className="container py-20 text-center">
        Error with Dashboard: {dashboardError.message}
      </div>
    );
  }

  // Destructuring data dari state dashboard
  const { program_count, total_donation, unique_donators_count } = dashboard;

  // Periksa jika ada data program donasi
  const hasPrograms =
    programDonationsData?.data && programDonationsData.data.length > 0;

  // Function untuk menghasilkan item pagination
  const renderPaginationItems = () => {
    const items = [];
    
    // Jika total halaman <= 5, tampilkan semua halaman
    if (pagination.totalPage <= 5) {
      for (let i = 1; i <= pagination.totalPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={i === pagination.currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Jika halaman aktif di awal
      if (pagination.currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                href="#" 
                isActive={i === pagination.currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i);
                }}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={pagination.totalPage}>
            <PaginationLink 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pagination.totalPage);
              }}
            >
              {pagination.totalPage}
            </PaginationLink>
          </PaginationItem>
        );
      } 
      // Jika halaman aktif di akhir
      else if (pagination.currentPage > pagination.totalPage - 3) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = pagination.totalPage - 2; i <= pagination.totalPage; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                href="#" 
                isActive={i === pagination.currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i);
                }}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } 
      // Jika halaman aktif di tengah
      else {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        items.push(
          <PaginationItem key="ellipsis3">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                href="#" 
                isActive={i === pagination.currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i);
                }}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis4">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={pagination.totalPage}>
            <PaginationLink 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pagination.totalPage);
              }}
            >
              {pagination.totalPage}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navbar/>
      <motion.div 
        className="container flex flex-col justify-center items-center gap-10"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold"
          variants={itemVariants}
        >
          Campaign
        </motion.h2>
        
        {/* Bagian dashboard */}
        <motion.div 
          className="flex flex-col gap-12"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Dashboard
              program_count={program_count}
              total_donation={total_donation}
              unique_donators_count={unique_donators_count}
            />
          </motion.div>
          
          {/* Bagian program donasi */}
          {hasPrograms ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {programDonationsData.data.map((program) => (
                <motion.div key={program.id} variants={itemVariants}>
                  <ProgramDonation
                    id={program.id}
                    number={program.number}
                    title={program.title}
                    deskripsi={program.deskripsi}
                    goal_amount={program.goal_amount}
                    current_amount={program.current_amount}
                    program_donation_images={program.program_donation_images}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-10"
              variants={itemVariants}
            >
              Belum ada program donasi tersedia
            </motion.div>
          )}

          {/* Pagination */}
          {hasPrograms && pagination.totalPage > 1 && (
            <motion.div variants={itemVariants}>
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pagination.currentPage - 1);
                      }}
                      className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pagination.currentPage + 1);
                      }}
                      className={pagination.currentPage === pagination.totalPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <Footer/>
    </motion.section>
  );
}