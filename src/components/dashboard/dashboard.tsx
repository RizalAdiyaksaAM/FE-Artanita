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
  // Format currency - tambahkan pengecekan untuk nilai 0
  const formatCurrency = (amount: number): string => {
    // Pastikan amount adalah number yang valid
    const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return validAmount.toLocaleString("id-ID");
  };

  // Format number - tambahkan pengecekan untuk nilai 0
  const formatNumber = (value: number): string => {
    const validValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return validValue.toString();
  };

  const dashboardItems = [
    {
      icon: iconProgram,
      alt: "Program Donasi",
      label: "Program Donasi",
      value: formatNumber(program_count),
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
      value: formatNumber(unique_donators_count),
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {dashboardItems.map((item, index) => (
        <DashboardItem
          key={index}
          icon={item.icon}
          alt={item.alt}
          label={item.label}
          value={item.value}
          index={index}
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
  index?: number;
};

const DashboardItem: React.FC<DashboardItemProps> = ({ 
  icon, 
  alt, 
  label, 
  value, 
  index = 0 
}) => {
  return (
    <motion.div 
      className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-start bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1 // Staggered animation
      }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div className="flex-shrink-0">
        <motion.img 
          src={icon} 
          alt={alt} 
          className="w-[77px] h-[77px] object-contain"
          onError={(e) => {
            // Fallback jika gambar tidak bisa dimuat
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </motion.div>
      <motion.div className="flex-1 min-w-0">
        <motion.p className="text-black font-semibold text-xl mb-1 break-words">
          {label}
        </motion.p>
        <motion.p 
          className="text-[34px] font-bold text-[#379777] leading-tight break-all"
          style={{ wordBreak: 'break-word' }}
        >
          {value || "0"}
        </motion.p>
        {/* Indikator jika nilai adalah 0 */}
        {(value === "0" || value === "Rp 0") && (
          <motion.p className="text-sm text-gray-500 mt-1">
            Belum ada data
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;