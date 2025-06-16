import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import useProgramDetail from "@/api/program-donation/get-by-id-program";
import DonationForm from "@/components/form/donation";
import Footer from "@/components/footer";
import useDonationByProgram from "@/api/program-donation/get-donation";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Heart, MessageCircle } from "lucide-react";
import Navbar from "@/components/navbar";

export default function DetailsProgram() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: programData,
    isLoading: isProgramLoading,
    error: programError,
  } = useProgramDetail(id);

  const {
    donations: donationData,
    isLoading: isDonationLoading,
    error: donationError,
  } = useDonationByProgram(id);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("id-ID");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentAmount = (): number => {
    if (!programData?.data) return 0;

    const program = programData.data;
    let currentAmount = parseFloat(program.current_amount?.toString() || "0") || 0;

    if (currentAmount === 0 && donationData?.length) {
      currentAmount = donationData.reduce((sum, donation) => {
        const amount = parseFloat(donation.amount?.toString() || '0') || 0;
        return sum + amount;
      }, 0);
    }

    return currentAmount;
  };

  const calculateProgress = (): number => {
    if (!programData?.data) return 0;

    const program = programData.data;
    const goalAmount = parseFloat(program.goal_amount?.toString() || "0") || 0;

    const currentAmount = getCurrentAmount();

    if (goalAmount === 0) return 100;
    if (goalAmount > 0 && currentAmount === 0) return 0;

    const progress = (currentAmount / goalAmount) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const handleBackToCampaign = () => {
    navigate("/campaign");
  };

  if (isProgramLoading || isDonationLoading) {
    return (
      <div className="container py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#379777]"></div>
      </div>
    );
  }

  if (donationError) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{donationError.message}</p>
      </div>
    );
  }

  if (programError || !programData || programData.status !== "success") {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{programError?.message || "Program donasi tidak ditemukan"}</p>
        <Button className="mt-6 " onClick={handleBackToCampaign}>
          Kembali ke Campaign
        </Button>
      </div>
    );
  }

  const program = programData.data;
  const currentAmount = getCurrentAmount();
  const progressPercentage = calculateProgress();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <div className="container py-10">
        {/* Navigasi Kembali */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-[#379777] hover:bg-transparent hover:text-[#2a7259]"
            onClick={handleBackToCampaign}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Kembali ke Campaign
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Kolom kiri - Detail Program */}
          <div className="w-full lg:w-2/3">
            {/* Galeri Gambar */}
            <div className="mb-8">
              {program.program_donation_images &&
              program.program_donation_images.length > 0 ? (
                <img
                  src={program.program_donation_images[0].image_url}
                  alt={program.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">Tidak ada gambar</p>
                </div>
              )}
            </div>

            {/* Judul dan Info Program */}
            <div className="mb-8">
              <h1 className="!text-4xl font-bold mb-4">{program.title}</h1>

              <div className="flex items-center gap-6 mb-6 text-gray-600">
                {program.created_at && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{formatDate(program.created_at)}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar - UPDATED */}
              <div className="mb-6 relative">
                {program.goal_amount && parseFloat(program.goal_amount.toString()) > 0 ? (
                  // Progress bar normal dengan target tertentu
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">
                        Target: Rp {formatCurrency(parseFloat(program.goal_amount.toString()) || 0)}
                      </p>
                      <p className="text-[#379777] font-bold">
                        {progressPercentage}%
                      </p>
                    </div>
                    <Progress
                      className="h-4 bg-[#E5E5E5]"
                      value={progressPercentage}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-medium">
                        Terkumpul: Rp {formatCurrency(currentAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {donationData?.length || 0} donatur
                      </p>
                    </div>
                  </>
                ) : (
                  // Progress bar untuk target terbuka (goal_amount = 0)
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-[#379777]">
                        Target: Terbuka (Donasi Bebas)
                      </p>
                      <p className="text-[#379777] font-bold flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        Aktif
                      </p>
                    </div>
                    <div className="h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#379777] to-[#2a7259] w-full animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-medium">
                        Total Terkumpul: Rp {formatCurrency(currentAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {donationData?.length || 0} donatur
                      </p>
                    </div>
                  </>
                )}
                
              
              </div>
            </div>

            {/* Tabs untuk Detail dan Donatur */}
            <Tabs defaultValue="detail" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger className="!px-4" value="detail">
                  Detail Program
                </TabsTrigger>
                <TabsTrigger className="!px-4" value="donatur">
                  Daftar Donatur
                </TabsTrigger>
              </TabsList>

              <TabsContent value="detail" className="text-gray-700">
                <div className="prose max-w-none">
                  <p>{program.deskripsi}</p>
                </div>
              </TabsContent>

              <TabsContent value="donatur" className="mt-6">
                {donationData && donationData.length > 0 ? (
                  <div className="space-y-4 md:space-y-6">
                    {/* Header Statistics - UPDATED */}
                    <div className="bg-gradient-to-r from-[#379777]/10 to-[#379777]/5 rounded-xl p-3 md:p-4 border border-[#379777]/20">
                      <div className="flex items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center justify-center gap-4 m-0">
                          <div className="p-2 bg-[#379777]/20 rounded-full">
                            <Heart className="h-4 w-4 md:h-5 md:w-5 text-[#379777]" />
                          </div>
                          <div>
                            <h3 className="font-semibold !text-sm md:!text-base text-gray-900">Total Donatur</h3>
                            <p className="text-xs md:text-sm text-gray-600">{donationData.length} orang berdonasi</p>
                          </div>
                        </div>
                        <div className=" text-right">
                          <p className="!text-xs text-gray-500 uppercase tracking-wide">Total Terkumpul</p>
                          <p className="!text-base md:text-lg font-bold text-[#379777]">
                            Rp {formatCurrency(currentAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Donatur List with ScrollArea */}
                    <ScrollArea className="h-129 w-full rounded-md border border-gray-200">
                      <div className="space-y-3 md:space-y-4 p-4">
                        {donationData.map((donation) => (
                          <Card 
                            key={donation.id} 
                            className="group hover:shadow-lg hover:shadow-[#379777]/10 transition-all duration-300 border-l-4 border-l-[#379777]/30 hover:border-l-[#379777]"
                          >
                            <CardContent className="md:p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                                {/* Left Section - Avatar & Info */}
                                <div className="flex items-start gap-4 m-0 md:space-x-4 flex-1 p-2">
                                  <div className="relative flex-shrink-0">
                                    <Avatar className=" !w-[12px] h-full rounded-full border-2 md:border-3 border-[#379777]/20 shadow-lg group-hover:border-[#379777]/40 transition-colors">
                                      <AvatarFallback className="bg-gradient-to-br p-2 from-[#379777] to-[#379777]/80 text-white font-bold text-sm md:text-lg rounded-full">
                                        {getInitials(donation.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                                      <h4 className="font-semibold text-base md:text-lg text-gray-900 truncate">{donation.name}</h4>
                                    </div>
                                    
                                    {/* Amount on mobile - moved here for better mobile layout */}
                                    <div className="block lg:hidden mb-3">
                                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Donasi</p>
                                      <p className="font-bold text-xl text-[#379777]">
                                        Rp {formatCurrency(donation.amount)}
                                      </p>
                                    </div>
                                    
                                    {/* Message */}
                                    <div className="bg-gray-50 rounded-lg p-3 md:p-4 mt-2 md:mt-3 border-l-4 border-[#379777]/30">
                                      <div className="flex items-start space-x-2">
                                        <MessageCircle className="h-3 w-3 md:h-4 md:w-4 text-[#379777] mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-xs font-medium text-[#379777] uppercase tracking-wide mb-1">Pesan</p>
                                          <p className="text-sm md:text-base text-gray-700 leading-relaxed italic break-words">"{donation.message}"</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Section - Amount (Desktop only) */}
                                <div className="hidden lg:block text-right ml-4 flex-shrink-0">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Donasi</p>
                                  <p className="font-bold text-xl md:text-2xl text-[#379777] group-hover:text-[#379777]/80 transition-colors">
                                    Rp {formatCurrency(donation.amount)}
                                  </p>
                                  
                                  {/* Decorative element */}
                                  <div className="flex justify-end mt-2 space-x-1">
                                    <div className="w-1 h-1 bg-[#379777] rounded-full"></div>
                                    <div className="w-1 h-1 bg-[#379777]/60 rounded-full"></div>
                                    <div className="w-1 h-1 bg-[#379777]/30 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Footer */}
                    <div className="text-center py-4 md:py-6 border-t border-gray-100">
                      <p className="!text-xl md:text-sm text-gray-500">
                        Terima kasih kepada semua donatur yang telah berkontribusi 🙏
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center  flex flex-col justify-center items-center py-12 md:py-16 px-4">
                    <div className="mx-auto w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                      <Heart className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      Belum Ada Donatur
                    </h3>
                    <p className="text-sm text-center md:text-base text-gray-500 max-w-md mx-auto leading-relaxed px-4">
                      Program ini belum memiliki donatur. Jadilah yang pertama untuk berdonasi dan membantu sesama.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Kolom kanan - Form Donasi */}
          <div className="w-full lg:w-1/3">
            <div className="p-4 border border-gray-300 rounded-lg shadow-lg">
              {/* Pass program ID dan data program ke form donasi */}
              <DonationForm programId={id} programData={program} />
            </div>

            {/* Informasi Tambahan */}
            <Card className="mt-6  shadow-lg">
              <CardContent className="">
                <h4 className="font-semibold mb-2">Cara Berdonasi:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Isi formulir donasi di atas</li>
                  <li>Pilih nominal donasi (minimal Rp 10.000)</li>
                  <li>Klik tombol "Donasi Sekarang"</li>
                  <li>Pilih metode pembayaran pada halaman berikutnya</li>
                  <li>Selesaikan pembayaran sesuai instruksi</li>
                </ol>
                <p className="mt-4 text-sm text-gray-500">
                  Untuk bantuan lebih lanjut, silakan hubungi customer service
                  kami di support@artanita.org
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </motion.section>
  );
}