import { motion } from "framer-motion";

export default function DashboardDonatur() {

    return(
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-lg rounded-md w-[30%] "
      >
        </motion.div>
    )

}