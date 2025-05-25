import { motion } from "framer-motion";
import image from "../../src/assets/image/about-image.png";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function SejarahPage() {
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
        className="container mx-auto px-4 py-12 flex flex-col gap-12 items-center justify-between max-w-screen-lg"
      >
        <motion.h2
          variants={itemVariants}
          className="!text-2xl lg:!text-4xl bg-white w-full !py-4 rounded-lg shadow-lg text-center font-bold !text-[#379777]"
        >
          Sejarah Singkat
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-10"
        >
          <motion.img
            variants={itemVariants}
            src={image}
            alt="Hero"
            className="w-full lg:w-2/3"
          />

          <motion.div
            variants={itemVariants}
            className="w-full text-justify text-base text-[#232323] leading-relaxed"
          >
            <motion.p variants={itemVariants} className="!mb-6">
              Berdasarkan anggaran dasar Yayasan Artanita dengan Akta Notaris Riono Roslan No. 16, tanggal 7 Juli 1982, di antara maksud dan tujuan Yayasan Artanita ialah ikut mensejahterakan masyarakat. Salah satu usahanya ialah menyelenggarakan panti asuhan untuk menampung dan mengasuh anak-anak, terinspirasi oleh ayat Al-Qur'an surat Al-Ma’un untuk peduli terhadap anak yatim dan miskin.
            </motion.p>

            <motion.p variants={itemVariants} className="!mb-6">
              Maka, pada tanggal 7 Juli 1987 Yayasan Artanita mulai menyelenggarakan panti asuhan dengan 7 anak. Karena belum memiliki gedung khusus, anak-anak tersebut ditampung di rumah pendiri yayasan.
            </motion.p>

            <motion.p variants={itemVariants} className="!mb-6">
              Alhamdulillah, dengan inayah Allah SWT, pada hari Jumat, 17 Mei 1991 dilakukan peletakan batu pertama pembangunan panti asuhan oleh Bapak Camat Cihideung, Kota Tasikmalaya di atas tanah wakaf dari pendiri yayasan. Pengecoran beton dibantu oleh Brigif 17 Galuh, Kodim 0612, dan Kepolisian Resort Tasikmalaya.
            </motion.p>

            <motion.p variants={itemVariants} className="!mb-6">
              Anak-anak asuh berasal dari berbagai daerah seperti Tasikmalaya, Ciamis, Banjar, Tegal, Garut, Bandung, Tangerang, Jakarta, Lampung, dan NTT. Mereka tinggal sejak bayi hingga usia SMA dan menempuh pendidikan di sekolah-sekolah milik yayasan maupun luar.
            </motion.p>

            <motion.p variants={itemVariants} className="!mb-4">
              Kegiatan harian anak asuh antara lain:
            </motion.p>

            <motion.ul
              variants={itemVariants}
              className="list-disc pl-6 space-y-2"
            >
              <li>Setelah salat Subuh berjamaah, mengaji bersama hingga pukul 06.00 WIB</li>
              <li>Mandi dan makan pagi</li>
              <li>Berangkat ke sekolah</li>
              <li>Setelah pulang sekolah, makan siang</li>
              <li>Aktivitas sekolah dari Senin sampai Jumat</li>
              <li>Malam hari mengaji bersama dan tidak lupa untuk berjamaah</li>
            </motion.ul>

            <motion.p variants={itemVariants} className="!mt-6">
              Demikian sekilas riwayat berdirinya Yayasan Panti Sosial Asuhan Anak Artanita Al-Khairiyah.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      <Footer />
    </motion.section>
  );
}
