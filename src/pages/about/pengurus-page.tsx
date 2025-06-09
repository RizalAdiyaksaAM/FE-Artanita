import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useUsers } from "@/hooks/users/use-pengurus";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  address: string;
  age: number;
  education: string;
  position: string;
  image: string;
}

export default function PengurusPage() {
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

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.15,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 25px 50px rgba(55, 151, 119, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Image animation variants
  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.3
      }
    }
  };

  // Position badge animation
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.5,
        ease: "backOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const [pengurus, setPengurus] = useState<User[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { data: dataPengurus } = useUsers(1, 30);

  useEffect(() => {
    if (dataPengurus?.data) {
      const filtered = dataPengurus.data.filter(
        (user) => user.position.toLowerCase() !== "anak asuh"
      );
      setPengurus(filtered);
    }
  }, [dataPengurus]);

  const handleImageError = (userId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  // Path untuk gambar placeholder/dummy yang sudah disediakan
  const dummyImagePath = "/images/dummy-avatar.png"; // Sesuaikan dengan path gambar Anda

  const hasPengurus = pengurus && pengurus.length > 0;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-[#3797771A] min-h-screen"
    >
      <Navbar />
      <motion.div className="container mx-auto py-12">
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center">
          <motion.h2
            variants={itemVariants}
            className="!text-2xl lg:!text-4xl bg-white w-full !py-4 rounded-lg shadow-lg text-center font-bold !text-[#379777]"
          >
            Pengurus & Pengasuh
          </motion.h2>

          {hasPengurus && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-8"
            >
              {pengurus.map((user, index) => (
                <motion.div
                  key={user.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-white w-fit rounded-lg shadow-lg overflow-hidden cursor-pointer relative"
                >
                  {/* Decorative gradient overlay */}
                  <motion.div 
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#379777] to-[#4da085]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                  />
                  
                  <div className="overflow-hidden rounded-t-xl">
                    {imageErrors[user.id] || !user.image || user.image.trim() === '' ? (
                      <motion.img
                        variants={imageVariants}
                        src={dummyImagePath}
                        alt={`${user.name} - Default Avatar`}
                        className="w-[263px] h-[274px] object-cover"
                      />
                    ) : (
                      <motion.img
                        variants={imageVariants}
                        src={user.image}
                        alt={user.name}
                        className="w-[263px] h-[274px] object-cover"
                        onError={() => handleImageError(user.id)}
                        onLoad={() => {
                          // Reset error state if image loads successfully
                          setImageErrors(prev => ({
                            ...prev,
                            [user.id]: false
                          }));
                        }}
                      />
                    )}
                  </div>
                  
                  <motion.div className="p-4 relative">
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h3 
                        className="!text-xl !text-black font-semibold mt-2 text-center mb-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {user.name}
                      </motion.h3>
                      
                      <motion.div
                        variants={badgeVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="flex justify-center"
                      >
                        <motion.span className="!text-[#379777] font-semibold text-center bg-[#3797771A] px-3 py-1 rounded-full text-sm border border-[#379777]/20">
                          {user.position}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                    
                    {/* Subtle decoration */}
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#379777] to-transparent"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: index * 0.15 + 0.6, duration: 0.5 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <Footer />
    </motion.section>
  );
};