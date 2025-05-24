import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useNavigate } from "react-router-dom";

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

  // Menghitung persentase progres donasi
  const progressPercentage = goal_amount > 0 
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
          />
        </motion.div>
      ) : (
        <motion.div className="h-48 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Tidak ada gambar</p>
        </motion.div>
      )}

      {/* Konten program */}
      <motion.div className="p-4 flex flex-col flex-grow">
        {/* Judul bisa diklik untuk navigasi ke detail */}
        <motion.h4 
          className="text-xl font-semibold mb-2 cursor-pointer hover:text-[#379777]"
          onClick={handleNavigateToDetail}
        >
          {title}
        </motion.h4>
        <motion.p className="text-gray-600 text-[16px] line-clamp-3">{deskripsi}</motion.p>
        
        {/* Progress bar */}
        <motion.div className="mt-auto flex flex-col gap-2 relative">
          <motion.p 
            className="text-[#379777] font-semibold absolute"
            style={{
              left: `${progressPercentage}%`, 
              transform: 'translateX(-50%)',
            }}
          >
            {progressPercentage}%
          </motion.p>
          <Progress className="h-4 mt-[25px] bg-[#E5E5E5]" value={progressPercentage} />

          {/* Info donasi */}
          <div className="flex justify-between items-center text-sm mb-4">
            <motion.p>
              <span className="font-medium">Rp {formatCurrency(current_amount)}</span>
              <span className="text-gray-500 ml-1">terkumpul</span>
            </motion.p>
            <motion.p>
              <span className="font-medium">Rp {formatCurrency(goal_amount)}</span>
              <span className="text-gray-500 ml-1">target</span>
            </motion.p>
          </div>
        </motion.div>
        
        {/* Button donasi */}
        <Button 
          className="w-full bg-[#F4CE14] text-black font-semibold hover:bg-amber-300"
          onClick={handleNavigateToDetail}
        >
          Donasi
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProgramDonation;