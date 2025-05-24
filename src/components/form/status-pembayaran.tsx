import { useEffect, useState, useCallback, type JSX } from "react";
import { useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getDonationStatus } from "@/api/donation/donasi";

// Type definitions
type PaymentStatus = "loading" | "success" | "failed" | "pending" | "unknown" | "error";

interface DonationData {
  id: string | number;
  amount: number;
  status: number;
  program_title?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  data: DonationData;
  message?: string;
  success?: boolean;
}

interface StatusContent {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function PaymentStatus(): JSX.Element {

  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkPaymentStatus = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Ambil donation_id dari localStorage
      const donationId = localStorage.getItem("current_donation_id");
      
      if (!donationId) {
        setStatus("unknown");
        setLoading(false);
        return;
      }

      // Panggil API untuk memeriksa status donasi berdasarkan ID
      const response: ApiResponse = await getDonationStatus(donationId);
      
      if (response && response.data) {
        setDonationData(response.data);
        
        // Periksa status dari respons API
        switch (response.data.status) {
          case 1: // success
            setStatus("success");
            break;
          case 2: // failed
            setStatus("failed");
            break;
          case 0: // pending/belum dibayar
            setStatus("pending");
            break;
          default:
            setStatus("unknown");
        }
      } else {
        setStatus("unknown");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error checking payment status:", error);
      setStatus("error");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPaymentStatus();
  }, [checkPaymentStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    
    // Jika statusnya pending, polling setiap 5 detik untuk mengecek perubahan
    if (status === "pending") {
      intervalId = setInterval(() => {
        checkPaymentStatus();
      }, 5000);
    }
    
    // Clean up interval ketika komponen unmount atau status berubah
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status, checkPaymentStatus]);

  useEffect(() => {
    // Clean up localStorage ketika pembayaran berhasil atau gagal
    return () => {
      if (status === "success" || status === "failed") {
        localStorage.removeItem("current_donation_id");
      }
    };
  }, [status]);

  const getStatusContent = (): StatusContent => {
    switch (status) {
      case "loading":
        return {
          icon: <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />,
          title: "Memuat Status Pembayaran",
          description: "Mohon tunggu sebentar, kami sedang memeriksa status pembayaran Anda."
        };
      case "success":
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: "Pembayaran Berhasil",
          description: "Terima kasih! Donasi Anda telah berhasil diproses."
        };
      case "failed":
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: "Pembayaran Gagal",
          description: "Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi."
        };
      case "pending":
        return {
          icon: <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />,
          title: "Pembayaran Tertunda",
          description: "Pembayaran Anda sedang diproses. Silakan periksa status pembayaran nanti."
        };
      case "error":
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: "Terjadi Kesalahan",
          description: "Terjadi kesalahan saat memeriksa status pembayaran. Silakan coba lagi atau hubungi customer service."
        };
      default:
        return {
          icon: <Loader2 className="h-12 w-12 text-gray-500" />,
          title: "Status Tidak Diketahui",
          description: "Kami tidak dapat menentukan status pembayaran Anda. Silakan hubungi customer service kami."
        };
    }
  };

  const handleBackToHome = (): void => {
    navigate("/");
  };

  const handleTryAgain = (): void => {
    navigate("/donation");
  };

  const content = getStatusContent();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          {content.icon}
          <CardTitle className="mt-4 text-center">{content.title}</CardTitle>
          <CardDescription className="text-center">
            {content.description}
          </CardDescription>
        </CardHeader>
        
        {donationData && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">ID Donasi:</span>
                <span className="font-medium">{donationData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jumlah:</span>
                <span className="font-medium">
                  Rp {donationData.amount.toLocaleString('id-ID')}
                </span>
              </div>
              {donationData.program_title && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Program:</span>
                  <span className="font-medium">{donationData.program_title}</span>
                </div>
              )}
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            disabled={loading}
          >
            Kembali ke Beranda
          </Button>
          
          {status === "failed" && (
            <Button 
              onClick={handleTryAgain}
              disabled={loading}
            >
              Coba Lagi
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}