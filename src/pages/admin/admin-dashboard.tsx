
import DonationLineChart from "@/components/chart";
import DashboardDonatur from "@/components/dashboard-donasi";
import Dashboard from "@/components/dashboard/dashboard";
import TableProgram from "@/components/table/table-program";
import { useDashboard } from "@/hooks/donation/use-donation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type DashboardData = {
  program_count: number;
  total_donation: number;
  unique_donators_count: number;
};


export default function AdminDashboard(){
   const { 
      data: dashboardData, 
    } = useDashboard();

     // State untuk menyimpan data dashboard
      const [dashboard, setDashboard] = useState<DashboardData>({
        program_count: 0,
        total_donation: 0,
        unique_donators_count: 0,
      });


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

        // Destructuring data dari state dashboard
  const { program_count, total_donation, unique_donators_count } = dashboard;



  return (
    <motion.section className="">
      <motion.div className="flex flex-col gap-8 ">
        <Dashboard
            program_count={program_count}
            total_donation={total_donation}
            unique_donators_count={unique_donators_count}
          />
          <motion.div className="w-full flex gap-6">
            < DonationLineChart/>
            < DashboardDonatur/>
          </motion.div>

          <TableProgram />
      </motion.div>
    </motion.section>
  )
}