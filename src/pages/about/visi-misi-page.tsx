import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";


export default function VisiMisiPage() {

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
          Visi, Misi & Tujuan
        </motion.h2>
        <motion.div className=" flex flex-col lg:flex-row gap-6 lg:gap-2 ">
        <motion.div>
            <motion.h3
            variants={itemVariants}
            className=" !text-2xl lg:!text-3xl !mb-4  text-center font-bold !text-[#379777]"
            >
           Visi 
            </motion.h3>
            <motion.p className="text-center">
                Membentuk Rumah Asuhan yang Amanah, Berkualitas Untuk Kesejahteraan Yatim, Piatu, Yatim Piatu dan Miskin
            </motion.p>
        </motion.div>
        <motion.div>
            <motion.h3
            variants={itemVariants}
            className="!text-2xl lg:!text-3xl !mb-4  text-center font-bold !text-[#379777]"
            >
           Misi
            </motion.h3>
            <motion.ul
              variants={itemVariants}
              className="list-disc pl-6 space-y-2"
            >
              <li>Membina Anak Agar Terampil Sehingga Menjadi Generasi yang Berkualitas </li>
              <li>Membina Anak Agar Kreatif Dalam Berkarya, Mandiri Dalam Kewirausahaan</li>
              <li>Membina Anak Agar Mampu Berkompetisi Dalam Syiar Agama</li>
            </motion.ul>
        </motion.div>
        <motion.div>
            <motion.h3
            variants={itemVariants}
            className="!text-2xl lg:!text-3xl !mb-4  text-center font-bold !text-[#379777]"
            >
           Tujuan
            </motion.h3>
            <motion.ul
              variants={itemVariants}
              className="list-disc pl-6 space-y-2"
            >
              <li>Membentuk Generasi Secara Moral Maupun Ilmu Pengetahuan Serta Dapat Membantu Pemerintah Dalam Melaksanakan Program Kesejahteraan </li>
              <li>Memberikan Pembinaan yang Berbasis Nilai Islam Serta Kecakapan Hidup Anak Asuh</li>
              <li>Memberikan Keteladanan Kepada Anak Asuh Dalam Membentuk Sikap Mental dan Cara Pandang</li>
            </motion.ul>
            </motion.div>
        </motion.div>
            
        </motion.div>
            
        <Footer />
        </motion.section>
    )
}

