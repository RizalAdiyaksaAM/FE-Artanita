import { motion } from "framer-motion";
import image from "../../assets/image/about-image.png";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button"; // pastikan Button diimpor dengan benar
import { useNavigate } from "react-router-dom";

export default function LandingAbout() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1,
      y: 0, 
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 }
    }
  };

  const navigate = useNavigate();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#3797771A]"
    >
      <motion.div
        variants={itemVariants}
        className="container flex flex-col lg:flex-row gap-10  lg:gap-20 items-center justify-between"
      >
        {/* Gambar */}
        <motion.img
          variants={itemVariants}
          src={image}
          alt="Hero"
          className="w-full lg:w-1/2 object-cover rounded-lg"
        />

        {/* Konten Teks */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-4"
        >
          <motion.div className="flex flex-col items-center lg:items-start gap-2">
            
          <motion.h3
            variants={itemVariants}
            className="text-2xl font-semibold "
          >
            About Us
          </motion.h3>
          <motion.h2
            variants={itemVariants}
            className="!text-3xl lg:text-4xl font-bold text-[#232323]"
          >
            Sejarah Singkat
          </motion.h2>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-sm lg:text-[16px] text-center lg:text-left text-[#232323]"
          >
            Berdasarkan anggaran dasar yayasan Artanita dengan Akta Notaris Riono Roslan no 16, tanggal 7 juli 1982, diantara maksud tujuan yayasan Artanita, ialah ikut mensejahterakan masyarakat, dan diantara usahanya ialah menyelenggarakan panti asuhan untuk menampung dan mengasuh anak-anak dan termotifasi ayat Al-Quran surat Al-ma’un untuk peduli terhadap anak yatim dan miskin, maka pimpinan yayasan Artanita pada tanggal 7 juli 1987 mulai menyelenggarakan panti asuhan, dengan anak 7 anak. karena belum mempunyai tempat/gedung khusus untuk menampung anak-anak asuh, maka anak-anak asuh tersebut ditampung dirumah pendiri yayasan...
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button onClick={() => navigate("/about/sejarah")}  className="flex items-center rounded-xl h-full bg-[#379777] !px-[40px] !py-[10px] text-base font-semibold text-white hover:bg-[#379759]">
              Read More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
