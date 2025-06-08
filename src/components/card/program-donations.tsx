import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useNavigate } from "react-router-dom";
import { Infinity } from "lucide-react";

// Tipe untuk props
type ProgramDonationImage = {
  image_url: string;
};

type ProgramDonationProps = {
  id: string;
  number: number;
  title: string;
  deskripsi: string;
  goal_amount: number;
  current_amount: number;
  program_donation_images: ProgramDonationImage[];
};

/**
 * Komponen untuk menampilkan kartu program donasi
 */
const ProgramDonation: React.FC<ProgramDonationProps> = ({
  id,
  title,
  deskripsi,
  goal_amount,
  current_amount,
  program_donation_images,
}) => {
  // Menggunakan navigate untuk routing programatis
  const navigate = useNavigate();

  // Cek apakah target unlimited (goal_amount = 0)
  const isUnlimited = goal_amount === 0;

  // Menghitung persentase progres donasi
  const progressPercentage = !isUnlimited && goal_amount > 0 
    ? Math.min(Math.round((current_amount / goal_amount) * 100), 100)
    : 0;
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("id-ID");
  };

  // Handler untuk navigasi ke halaman detail
  const handleNavigateToDetail = () => {
    navigate(`/campaign/details/${id}`);
  };

  // Komponen untuk menampilkan target
  const TargetDisplay = () => {
    if (isUnlimited) {
      return (
        <motion.div className="flex items-center gap-1">
          <Infinity className="w-5 h-5 text-[#379777]" />
          <span className="font-medium text-[#379777]">Unlimited</span>
        </motion.div>
      );
    }
    
    return (
      <motion.p>
        <span className="font-medium">Rp {formatCurrency(goal_amount)}</span>
        <span className="text-gray-500 ml-1">target</span>
      </motion.p>
    );
  };

  return (
    <motion.div 
      className="border rounded-lg overflow-hidden shadow-lg bg-white h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gambar program - bisa diklik untuk navigasi ke detail */}
      {program_donation_images && program_donation_images.length > 0 ? (
        <motion.div 
          className="relative h-[226.942px] m-3 cursor-pointer"
          onClick={handleNavigateToDetail}
        >
          <motion.img 
            src={program_donation_images[0].image_url} 
            alt={title} 
            className="w-full h-full rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
          {/* Badge untuk unlimited campaign */}
          {isUnlimited && (
            <motion.div 
              className="absolute top-2 right-2 bg-[#379777] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Infinity className="w-3 h-3" />
              <span>Unlimited</span>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div className="h-48 bg-gray-200 flex items-center justify-center m-3 rounded-lg">
          <p className="text-gray-500">Tidak ada gambar</p>
        </motion.div>
      )}

      {/* Konten program */}
      <motion.div className="p-4 flex flex-col flex-grow">
        {/* Judul bisa diklik untuk navigasi ke detail */}
        <motion.h4 
          className="text-xl font-semibold mb-2 cursor-pointer hover:text-[#379777] transition-colors"
          onClick={handleNavigateToDetail}
        >
          {title}
        </motion.h4>
        <motion.p className="text-gray-600 text-[16px] line-clamp-3 mb-4">{deskripsi}</motion.p>
        
        {/* Progress section */}
        <motion.div className="mt-auto flex flex-col gap-2 relative">
          {/* Progress percentage - hanya tampil jika bukan unlimited */}
          {!isUnlimited && (
            <motion.p 
              className="text-[#379777] font-semibold absolute z-10"
              style={{
                left: `${progressPercentage}%`, 
                transform: 'translateX(-50%)',
              }}
            >
              {progressPercentage}%
            </motion.p>
          )}
          
          {/* Progress bar */}
          <Progress 
            className={`h-4 ${!isUnlimited ? 'mt-[25px]' : 'mt-2'} bg-[#E5E5E5]`} 
            value={isUnlimited ? 100 : progressPercentage}
          />

          {/* Info donasi */}
          <div className="flex justify-between items-center text-sm mb-4">
            <motion.p>
              <span className="font-medium">Rp {formatCurrency(current_amount)}</span>
              <span className="text-gray-500 ml-1">terkumpul</span>
            </motion.p>
            <TargetDisplay />
          </div>

          {/* Status badge untuk unlimited */}
          {isUnlimited && (
            <motion.div 
              className="text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Target Terbuka - Setiap donasi sangat berarti
              </span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Button donasi */}
        <Button 
          className="w-full bg-[#F4CE14] text-black font-semibold hover:bg-amber-300 transition-colors"
          onClick={handleNavigateToDetail}
        >
          {isUnlimited ? "Donasi" : "Donasi"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProgramDonation;