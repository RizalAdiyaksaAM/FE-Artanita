import { motion } from "framer-motion";
import { Button } from "../ui/button";
import whatsapp from "../../assets/image/wa.svg";
import bg from "../../assets/image/bg-wa.png";

export default function LandingWA() {
  return (
  <motion.section
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
    className="py-16 px-4"
  >
    <motion.div className="container flex flex-col gap-6 items-center justify-center text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-lg sm:text-xl md:text-2xl font-semibold text-white max-w-xl"
      >
        Tanya tentang panti asuhan atau ingin mengunjungi? Chat di nomor bawah ini.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <Button className="flex items-center bg-white text-[#67C15E] px-6 py-3 sm:px-8 sm:py-4 rounded-3xl hover:bg-[#d0e7d4] transition text-base sm:text-lg">
          <motion.img
            src={whatsapp}
            alt="whatsapp"
            className="mr-2 h-6 w-6 sm:h-7 sm:w-7"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          Whatsapp
        </Button>
      </motion.div>
    </motion.div>
  </motion.section>
);
}