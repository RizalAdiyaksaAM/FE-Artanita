import { useState } from "react";
import { motion } from "framer-motion";
import heroImage from "../../assets/image/hero-image.png";
import vector1 from "../../assets/image/vector-1.png";
import vector2 from "../../assets/image/vector-2.png";
import { Button } from "../ui/button";
import DonationForm from "../form/donation";
 // Import komponen modal

export default function LandingHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#F5F7F8] "
    >
      <motion.div
        variants={itemVariants}
        className="container flex justify-between items-center"
      >
        <div className="w-1/2 flex flex-col gap-[32px]">
          <div className="relative flex flex-col gap-4">
            <motion.h1
              variants={itemVariants}
              className="z-1 text-4xl font-bold text-[#232323]"
            >
              Donasi Anda, Senyum Mereka
            </motion.h1>
            <motion.h3
              variants={itemVariants}
              className="text-lg !text-[#232323]"
            >
              Belas kasihan anda memberikan kebahagiaan dan harapan bagi
              anak-anak panti asuhan
            </motion.h3>
            <motion.img
              variants={itemVariants}
              className="absolute right-14"
              src={vector1}
              alt=""
            />
            <motion.img
              variants={itemVariants}
              className="absolute bottom-20 left-[-8px]"
              src={vector2}
              alt=""
            />
          </div>
          <div>
            <motion.div variants={itemVariants}>
              <Button
                className="flex items-center rounded-xl h-full bg-[#F4CE14] !px-[60px] !py-[10px] text-base lg:text-xl font-semibold text-black hover:bg-[#f4cf14dc]"
                onClick={() => setIsModalOpen(true)} // Open modal
              >
                Donasi
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div variants={itemVariants}>
          <img src={heroImage} alt="hero" />
        </motion.div>
      </motion.div>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black/60  flex justify-center items-center z-50">
    <div className="bg-white rounded-xl w-11/12 max-w-lg max-h-[90vh] overflow-y-auto p-8 relative">
      <span
        className="absolute top-4 right-4 cursor-pointer text-xl"
        onClick={() => setIsModalOpen(false)} // Close modal
      >
        &times;
      </span>
      <DonationForm initialData={null} /> {/* Pass initialData if needed */}
    </div>
  </div>
)}
    </motion.section>
  );
}