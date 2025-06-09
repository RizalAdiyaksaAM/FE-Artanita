// src/components/landing/landing-donaturs.tsx
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Donatur from "../card/donaturs";
import { useDonatur } from "@/hooks/donation/use-donaturs";

export default function LandingDonaturs() {
  const { data: donaturs, isLoading } = useDonatur();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Loading Donaturs...</h2>
        </div>
      </section>
    );
  }

  if (!donaturs?.data?.length) {
    return (
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Donatur</h2>
          <p className="text-gray-600">Tidak ada donatur untuk ditampilkan.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-10 lg:py-12 bg-[#FFFBEF]">
      <div className="container mx-auto flex flex-col  items-center lg:items-start">
        <motion.h2 
          className="!text-3xl lg:text-4xl font-semibold !mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Donatur
        </motion.h2>
        
        <div className="mb-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <motion.p 
              className="text-gray-600 text-center lg:text-left max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Menjadi Sumber Harapan bagi Anak Panti Asuhan. Ikuti kemajuan kami
              dalam memberikan kehidupan yang lebih baik.
            </motion.p>
            
          </div>

          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full  "
          >
            <CarouselContent>
              {donaturs.data.map((donatur, index) => (
                <CarouselItem 
                  key={donatur.id || index} 
                  className="md:basis-1/2 lg:p-4 lg:basis-1/3 "
                >
                  <Donatur
                    name={donatur.name}
                    amount={donatur.amount}
                    message={donatur.message}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-38 lg:left-[1100px] bottom-[-60px] lg:top-[-350px] w-5 lg:w-10 flex ">
              <CarouselPrevious className="w-13 h-13 lg:w-15 lg:h-15 border-[#379777] border text-[#379777] hover:bg-[#379777] hover:text-white"/>
              <CarouselNext className="w-13 h-13 lg:w-15 lg:h-15 rounded-full bg-[#379777] text-white hover:bg-[#379777] hover:text-white"/>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
