// src/components/landing/landing-blog.tsx
import { useActivity } from "@/hooks/orphanage-activity/use-activity";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Activity from "../card/activity";
import { useNavigate } from "react-router-dom";

export default function LandingBlog() {


  const { data: dataBlog, isLoading } = useActivity({ page: 1, limit: 4 });
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Loading Blog...</h2>
        </div>
      </section>
    );
  }




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

  if (!dataBlog?.data?.length) {
    return (
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Blog</h2>
          <p className="text-gray-600">
            Tidak ada artikel blog untuk ditampilkan.
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#3797771A]"
    >
      <div className="container mx-auto ">
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center justify-between"
        >
          {/* Konten Teks */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-1/2  flex flex-col items-center lg:items-start gap-6"
          >

            <motion.div className="flex flex-col items-center gap-2">
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-semibold text-green-700"
            >
              Activity
            </motion.h3>
            <motion.h2
              variants={itemVariants}
              className="!text-3xl lg:!text-4xl text-center font-bold text-[#232323]"
            >
              Siap Membantu Anak Panti Asuhan?
            </motion.h2>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="!text-base text-center lg:text-start lg:!text-lg text-[#232323]"
            >
              Berdasarkan anggaran dasar yayasan Artanita Dampak Positif dari
              Setiap Donasi yang Anda Berikan Membawa Harapan Baru untuk Masa
              Depan Mereka
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => navigate("/activity")}
                className="flex items-center rounded-xl h-full bg-[#379777] !px-[40px] !py-[10px] text-base font-semibold text-white hover:bg-[#379759]"
              >
                Read More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="w-auto flex flex-col lg:flex-row justify-end items-end gap-10"
          >
            {/* Kolom kiri: card 1 dan 2 */}
            <div className="flex  flex-col w-[293px] justify-end items-end py-10  gap-10 ">
              {dataBlog.data.slice(0, 2).map((activity) => (
                <Activity
                  key={activity.id}
                  id={activity.id}
                  title={activity.title}
                  description={activity.description}
                  location={activity.location}
                  time={activity.time}
                  activity_images={activity.activity_images}
                />
              ))}
            </div>
            {/* Kolom kanan: card 3 dan 4 */}
            <div className="flex flex-col   justify-start items-center gap-10">
              {dataBlog.data.slice(2, 4).map((activity) => (
                <Activity
                  key={activity.id}
                  id={activity.id}
                  title={activity.title}
                  description={activity.description}
                  location={activity.location}
                  time={activity.time}
                  activity_images={activity.activity_images}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
