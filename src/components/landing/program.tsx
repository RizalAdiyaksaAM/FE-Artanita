import { useDashboard } from "@/hooks/donation/use-donation";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Dashboard from "../dashboard/dashboard";
import ProgramDonation from "../card/program-donations";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFilteredProgramDonations } from "@/hooks/program-donations/use-program-donation";

// Tipe untuk data dashboard
type DashboardData = {
  program_count: number;
  total_donation: number;
  unique_donators_count: number;
};

export default function LandingProgram() {
  const navigate = useNavigate();
  // Menggunakan custom hooks untuk mendapatkan data
  const { 
    data: programDonationsData, 
    isLoading: isProgramLoading, 
    error: programError 
  } = useFilteredProgramDonations({ page: 1, limit: 6 });

  console.log(programDonationsData, "programDonationsData"); ;


  
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading, 
    error: dashboardError 
  } = useDashboard();

  // State untuk menyimpan data dashboard
  const [dashboard, setDashboard] = useState<DashboardData>({
    program_count: 0,
    total_donation: 0,
    unique_donators_count: 0,
  });

  // Memperbarui state dashboard saat data baru tersedia
  useEffect(() => {
    // Akses data dengan struktur yang sesuai berdasarkan console log
    if (dashboardData?.status === 'success' && dashboardData?.data) {
      setDashboard({
        program_count: dashboardData.data.program_count,
        total_donation: dashboardData.data.total_donation,
        unique_donators_count: dashboardData.data.unique_donators_count
      });
    }
  }, [dashboardData]);

  // Tampilkan loading saat data sedang dimuat
  if (isProgramLoading || isDashboardLoading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (programError instanceof Error) {
    return <div className="container py-20 text-center">Error with Program Donations: {programError.message}</div>;
  }
  
  if (dashboardError instanceof Error) {
    return <div className="container py-20 text-center">Error with Dashboard: {dashboardError.message}</div>;
  }

  // Destructuring data dari state dashboard
  const { program_count, total_donation, unique_donators_count } = dashboard;
  
  // Periksa jika ada data program donasi
  const hasPrograms = programDonationsData?.data && programDonationsData.data.length > 0;

  return (
    <motion.section className="lg:py-10 bg-[#F5F7F8">
      <motion.div className="container space-y-8">
        {/* Bagian header */}
        <motion.div className="flex flex-col justify-center items-center mb-10 text-center">
          <motion.div className="flex flex-col justify-center items-center gap-2 text-center">
            
          <motion.h3 className="text-2xl font-semibold ">Campaign</motion.h3>
          <motion.h2 className="!text-3xl lg:text-4xl font-bold text-[#232323] !mb-4">
            Donasi anda sangat membantu mereka
          </motion.h2>
          </motion.div>
          <motion.p className="max-w-2xl text-gray-600">
            Menjadi Sumber Harapan bagi Anak Panti Asuhan. Ikuti kemajuan kami dalam memberikan kehidupan yang lebih baik
          </motion.p>
        </motion.div>

        {/* Bagian dashboard */}
        <motion.div className="mb-12">
          <Dashboard
            program_count={program_count}
            total_donation={total_donation}
            unique_donators_count={unique_donators_count}
          />
        </motion.div>

        {/* Bagian program donasi */}
        {hasPrograms ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programDonationsData.data.map((program) => (
              <ProgramDonation
                key={program.id}
                id={program.id}
                number={program.number}
                title={program.title}
                deskripsi={program.deskripsi}
                goal_amount={program.goal_amount}
                current_amount={program.current_amount}
                program_donation_images={program.program_donation_images}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div className="text-center py-10">
            Belum ada program donasi tersedia
          </motion.div>
        )}
       <motion.div className="flex justify-center" >
            <Button onClick={() => navigate("/campaign")} className="flex items-center rounded-xl h-full bg-[#379777] !px-[40px] !py-[10px] text-base font-semibold text-white hover:bg-[#379759]">
              Read More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
      </motion.div>
    </motion.section>
  );
}