import Activity from "@/components/card/activity";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useActivity } from "@/hooks/orphanage-activity/use-activity";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6; // Mengubah limit menjadi 6 dan membuatnya sebagai state

  const {
    data: activityData,
    isLoading: isActivityLoading,
    error: activityError,
    refetch,
  } = useActivity({ page: currentPage, limit });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalData: 0,
  });

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

  useEffect(() => {
    // Refetch ketika currentPage atau limit berubah
    refetch();
  }, [currentPage, limit, refetch]);

  useEffect(() => {
    if (activityData?.status === "success" && activityData?.pagination) {
      setPagination({
        currentPage: activityData.pagination.current_page,
        totalPage: activityData.pagination.total_page,
        totalData: activityData.pagination.total_data,
      });
    }
  }, [activityData]);

   const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
    }
  };

  // Tampilkan loading saat data sedang dimuat
  if (isActivityLoading) {
    return (
      <div className="container py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#379777]"></div>
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (activityError instanceof Error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{activityError.message}</p>
      </div>
    );
  }

  const hasActivity = activityData?.data && activityData.data.length > 0;

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
        for (
          let i = pagination.currentPage - 1;
          i <= pagination.currentPage + 1;
          i++
        ) {
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
      className=""
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navbar></Navbar>
      <motion.div className="container !px-64" variants={containerVariants}>
        <motion.div className="mb-10" variants={itemVariants}>
          <h1 className="!text-3xl text-center font-bold">Activity</h1>
          <p className="text-gray-600 text-center !mt-2">
            Lihat berbagai kegiatan yang telah dilakukan oleh anak-anak panti asuhan
          </p>
        </motion.div>

        {hasActivity ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {activityData.data.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Activity
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  location={item.location}
                  time={item.time}
                  activity_images={item.activity_images}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 bg-gray-50 rounded-lg"
            variants={itemVariants}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500 text-lg">Belum ada kegiatan yang ditambahkan</p>
          </motion.div>
        )}

        {/* Pagination */}
        {hasActivity && pagination.totalPage > 1 && (
          <motion.div variants={itemVariants}>
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.currentPage - 1);
                    }}
                    className={
                      pagination.currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
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
                    className={
                      pagination.currentPage === pagination.totalPage
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </motion.div>
      <Footer/>
    </motion.section>
  );
}