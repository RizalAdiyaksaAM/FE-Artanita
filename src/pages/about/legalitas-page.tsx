import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";


export default function LegalitasPage() {
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

  
    return (
        <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#3797771A] min-h-screen"
        >
        <Navbar />
        <motion.div
            variants={itemVariants}
            className="container flex flex-col gap-10 items-center justify-between"
        >
            <motion.h2
          variants={itemVariants}
          className="!text-2xl lg:!text-4xl bg-white w-full !py-4 rounded-lg shadow-lg text-center font-bold !text-[#379777]"
        >
          Legalitas & Akta Notaris
        </motion.h2>
        <motion.div className=" flex flex-col lg:flex-row w-full gap-6 lg:gap-2 ">
        <motion.div className="w-full lg:w-1/2 lg:px-18">
            <motion.h3
            variants={itemVariants}
            className="!text-2xl lg:!text-3xl !mb-4   text-center font-bold !text-[#379777]"
            >
           Legalitas
            </motion.h3>
            <motion.ul
              variants={itemVariants}
              className="list-disc pl-6 space-y-2"
            >
              <li>Tercatat di instansi Sosial Kota Tasikmalaya Nomor : 400.9.12/013/BID.PEMSOS/2025 </li>
              <li>Terdaftar di Dinas Sosial Propinsi Jawa Barat Nomor : 062/286/PPSKS/2022</li>
            </motion.ul>
        </motion.div>
        <motion.div className="w-full lg:w-1/2 lg:px-18">
            <motion.h3
            variants={itemVariants}
            className="!text-2xl lg:!text-3xl !mb-4  text-center font-bold !text-[#379777]"
            >
           Akta Notaris
            </motion.h3>
            <motion.ul
              variants={itemVariants}
              className="list-disc pl-6 space-y-2"
            >
              <li>Riono Roeslam SH   No. 16 Tanggal 07 Juli 1982</li>
              <li>In in Inayat Amintapura SH No. 09 Tanggal 07 Juli 2011 </li>
            </motion.ul>
            </motion.div>
        </motion.div>
            
        </motion.div>
            
        <Footer />
        </motion.section>
    )
}