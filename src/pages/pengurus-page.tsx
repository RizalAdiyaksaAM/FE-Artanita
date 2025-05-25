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

  const [pengurus, setPengurus] = useState<User[]>([]);

  const { data: dataPengurus } = useUsers(1, 10);

  useEffect(() => {
    if (dataPengurus?.data) {
      const filtered = dataPengurus.data.filter(
        (user) => user.position.toLowerCase() !== "anak asuh"
      );
      setPengurus(filtered);
    }
  }, [dataPengurus]);

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
            {pengurus.map((user) => (
              <motion.div
                key={user.id}
                className="bg-white w-fit rounded-lg shadow-lg"
              >
                <motion.img
                  src={user.image}
                  alt={user.name}
                  className="w-[263px] h-[274px] rounded-t-xl object-cover"
                />
                <motion.div className="p-4">
                  <motion.h3 className="!text-xl !text-black font-semibold mt-2 text-center">
                    {user.name}
                  </motion.h3>
                  <motion.p className="!text-[#379777] font-semibold text-center">
                    {user.position}
                  </motion.p>
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
}
