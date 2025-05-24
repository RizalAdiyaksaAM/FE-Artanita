import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useProgramDetail from "@/api/program-donation/get-by-id-program";
import DonationForm from "@/components/form/donation";
import Footer from "@/components/footer";
import useDonationByProgram from "@/api/program-donation/get-donation";




export default function DetailsProgram() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  // Gunakan custom hook untuk mendapatkan data program
const { data: programData, isLoading: isProgramLoading, error: programError } = useProgramDetail(id);
const { donations: donationData, isLoading: isDonationLoading, error: donationError } = useDonationByProgram(id);

 console.log(donationData, "donationData");

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("id-ID");
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!programData?.data || programData.data.goal_amount <= 0) return 0;
    return Math.min(Math.round((programData.data.current_amount / programData.data.goal_amount) * 100), 100);
  };

  // Handle kembali ke halaman campaign
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
        <Button 
          className="mt-6 "
          onClick={handleBackToCampaign}
        >
          Kembali ke Campaign
        </Button>
      </div>
    );
  }

  const program = programData.data;


  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container py-10">
        {/* Navigasi Kembali */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-[#379777] hover:bg-transparent hover:text-[#2a7259]"
            onClick={handleBackToCampaign}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              {program.program_donation_images && program.program_donation_images.length > 0 ? (
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
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{program.donator_count || 0} Donatur</span>
                </div>
                {program.created_at && (
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{formatDate(program.created_at)}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6 relative">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">Target: Rp {formatCurrency(program.goal_amount)}</p>
                  <p className="text-[#379777] font-bold">{calculateProgress()}%</p>
                </div>
                <Progress className="h-4 bg-[#E5E5E5]" value={calculateProgress()} />
                <p className="mt-1 font-medium">Terkumpul: Rp {formatCurrency(program.current_amount)}</p>
              </div>
            </div>

            {/* Tabs untuk Detail dan Donatur */}
            <Tabs defaultValue="detail" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger className="!px-4" value="detail">Detail Program</TabsTrigger>
                <TabsTrigger className="!px-4" value="donatur">Daftar Donatur</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detail" className="text-gray-700">
                <div className="prose max-w-none">
                  <p>{program.deskripsi}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="donatur">
                {donationData && donationData.length > 0 ? (
                  <div className="space-y-4">
                    {donationData.map((donation) => (
                      <Card key={donation.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{donation.name}</h4>
                              <p className="mt-2">{donation.message}</p>
                            </div>
                            <p className="font-bold text-[#379777]">Rp {formatCurrency(donation.amount)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">Belum ada donatur untuk program ini</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Kolom kanan - Form Donasi */}
          <div className="w-full lg:w-1/3">
            <div className="p-4 border border-gray-300 rounded-lg shadow-lg">
            <DonationForm/>
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
                  Untuk bantuan lebih lanjut, silakan hubungi customer service kami di support@artanita.org
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer/>
    </motion.section>
  );
}