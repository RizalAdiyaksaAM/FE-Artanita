import { motion } from "framer-motion";
import iconProgram from "../../assets/svg/program-donasi.svg";
import iconDonasi from "../../assets/svg/Icon-donasi.svg";
import iconDonatur from "../../assets/svg/Icon-donatur.svg";

// Definisi tipe props
type DashboardProps = {
  program_count: number;
  total_donation: number;
  unique_donators_count: number;
};

/**
 * Komponen Dashboard untuk menampilkan statistik program donasi
 */
const Dashboard: React.FC<DashboardProps> = ({
  program_count,
  total_donation,
  unique_donators_count,
}) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("id-ID");
  };

  const dashboardItems = [
    {
      icon: iconProgram,
      alt: "Program Donasi",
      label: "Program Donasi",
      value: program_count.toString(),
    },
    {
      icon: iconDonasi,
      alt: "Donasi Terkumpul",
      label: "Donasi Terkumpul",
      value: `Rp ${formatCurrency(total_donation)}`,
    },
    {
      icon: iconDonatur,
      alt: "Total Donatur",
      label: "Total Donatur",
      value: unique_donators_count.toString(),
    },
  ];

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {dashboardItems.map((item, index) => (
        <DashboardItem
          key={index}
          icon={item.icon}
          alt={item.alt}
          label={item.label}
          value={item.value}
        />
      ))}
    </motion.div>
  );
};

// Komponen card dashboard item
type DashboardItemProps = {
  icon: string;
  alt: string;
  label: string;
  value: string;
};

const DashboardItem: React.FC<DashboardItemProps> = ({ icon, alt, label, value }) => {
  return (
    <motion.div className="flex gap-10 items-start bg-white p-6 rounded-lg shadow-lg">
      <motion.img src={icon} alt={alt} className="w-[77px] h-77px]" />
      <motion.div>
        <motion.p className="text-black font-semibold text-xl">{label}</motion.p>
        <motion.p className="text-[34px] font-bold mt-1">{value}</motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;