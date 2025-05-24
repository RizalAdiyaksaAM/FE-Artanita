import donations, { getDonationStatus, getProgramDetail, type DonationResponse, type DonationsCollectionPayload, type ProgramDetail } from "@/api/donation/donasi";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";


// Schema validation interfaces
interface FormData {
  name: string;
  useDefaultName: boolean;
  address: string;
  no_wa: string;
  email: string;
  amount: number;
  message: string;
}

interface FormErrors {
  name?: string;
  address?: string;
  no_wa?: string;
  email?: string;
  amount?: string;
  message?: string;
}

interface PaymentData {
  id: string;
  title: string;
  name: string;
  amount: number;
  snap_url?: string;
}

interface DonationFormProps {
  initialData?: Partial<FormData> | null;
}

// Simple validation functions
const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name || data.name.length < 2) {
    errors.name = "Nama minimal 2 karakter.";
  }

  if (!data.address || data.address.length < 5) {
    errors.address = "Alamat minimal 5 karakter.";
  }

  if (!data.no_wa || data.no_wa.length < 9) {
    errors.no_wa = "Nomor WhatsApp minimal 9 digit.";
  } else if (!/^\d+$/.test(data.no_wa)) {
    errors.no_wa = "Nomor WhatsApp hanya boleh angka.";
  }

  if (!data.email) {
    errors.email = "Email tidak boleh kosong.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!data.amount || data.amount < 10000) {
    errors.amount = "Jumlah minimal Rp. 10.000.";
  }

  if (!data.message || data.message.length < 1) {
    errors.message = "Pesan tidak boleh kosong.";
  }

  return errors;
};

// Toast notification function (you can replace with your preferred toast library)
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

const DonationForm: React.FC<DonationFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { programId } = useParams<{ programId?: string }>();
  
  const [loading, setLoading] = useState(false);
  const [programLoading, setProgramLoading] = useState(false);
  const [useDefaultName, setUseDefaultName] = useState(
    initialData?.useDefaultName || false
  );
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [programDetail, setProgramDetail] = useState<ProgramDetail | null>(null);
  const [programError, setProgramError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || "",
    useDefaultName: initialData?.useDefaultName || false,
    address: initialData?.address || "",
    no_wa: initialData?.no_wa || "",
    email: initialData?.email || "",
    amount: initialData?.amount || 0,
    message: initialData?.message || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch program details if programId exists
  useEffect(() => {
    const fetchProgramDetail = async () => {
      if (programId && programId.trim() !== '') {
        setProgramLoading(true);
        setProgramError(null);
        try {
          const response = await getProgramDetail(programId);
          setProgramDetail(response.data);
        } catch (error: any) {
          console.error("Failed to fetch program detail:", error);
          const errorMessage = 
            error?.response?.data?.meta?.message ||
            error?.response?.data?.message ||
            error?.message ||
            "Gagal memuat detail program. Program mungkin tidak ditemukan.";
          setProgramError(errorMessage);
          // Don't prevent donation, just show warning
        } finally {
          setProgramLoading(false);
        }
      }
    };

    fetchProgramDetail();
  }, [programId]);

  // Handle payment status from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('status');
    
    if (paymentStatus) {
      const donationId = localStorage.getItem("current_donation_id");
      if (donationId) {
        navigate('/donation/payment-status', { replace: true });
      }
    }
  }, [location, navigate]);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setUseDefaultName(initialData.useDefaultName || false);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleDefaultNameChange = (checked: boolean) => {
    setUseDefaultName(checked);
    handleInputChange('useDefaultName', checked);
    if (checked) {
      handleInputChange('name', "Hamba Allah");
    } else {
      handleInputChange('name', "");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setShowConfirmation(true);
  };

  const confirmDonation = async () => {
    setLoading(true);
    try {
      // Prepare payload with program_id from URL params or empty string for general donation
      const payload: DonationsCollectionPayload = {
        name: formData.name,
        address: formData.address,
        no_wa: formData.no_wa,
        email: formData.email,
        amount: formData.amount,
        message: formData.message,
        program_id: programId || "", // Use programId from URL params or empty string for general donation
        return_url: `${window.location.origin}/donation?status=pending`,
      };
      
      console.log("Submitting donation data:", payload);
      const response = await donations(payload);
      
      if (response && response.data) {
        const donationData: DonationResponse = response.data;
        const { id, snap_url } = donationData;

        if (id) {
          localStorage.setItem("current_donation_id", id);
          setIsSubmitted(true);
        }

        // Map the response to PaymentData format
        const mappedPaymentData: PaymentData = {
          id: donationData.id,
          title: donationData.title,
          name: donationData.name,
          amount: donationData.amount,
          snap_url: donationData.snap_url
        };

        setPaymentData(mappedPaymentData);
        setShowConfirmation(false);

        if (snap_url) {
          showToast("Donasi berhasil! Silakan lanjutkan ke pembayaran.");
        } else {
          showToast("Donasi berhasil! Terima kasih atas donasi Anda.");
          navigate("/donation/thank-you");
        }
      }

    } catch (error: any) {
      console.error("Error saat POST donasi:", error);
      const errorMessage =
        error?.response?.data?.meta?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Terjadi kesalahan saat memproses donasi.";

      showToast(errorMessage, 'error');

    } finally {
      setLoading(false);
    }
  };

  const cancelDonation = () => {
    setShowConfirmation(false);
  };

  const proceedToPayment = () => {
    if (paymentData && paymentData.snap_url) {
      window.location.href = paymentData.snap_url;
    } else {
      showToast("Link pembayaran tidak tersedia", 'error');
    }
  };

  const checkDonationStatus = async () => {
    if (!paymentData?.id) return;

    try {
      const response = await getDonationStatus(paymentData.id);
      if (response && response.data) {
        const status = response.data.status;
        if (status === 'paid' || status === 'settlement') {
          showToast("Pembayaran berhasil! Terima kasih atas donasi Anda.");
          navigate("/donation/thank-you");
        } else if (status === 'failed' || status === 'expired') {
          showToast("Pembayaran gagal atau kadaluarsa. Silakan coba lagi.", 'error');
        }
      }
    } catch (error) {
      console.error("Error checking donation status:", error);
    }
  };

  return (
    <>
      {/* Program Information Display */}
      {programId && (
        <div className="mb-6 border rounded-lg bg-white shadow-sm">
          <div className="p-6">
            {programLoading ? (
              <div className="text-center">
                <p className="text-gray-600">Memuat informasi program...</p>
              </div>
            ) : programError ? (
              <div className="text-center">
                <p className="text-red-600 mb-2">{programError}</p>
                <p className="text-sm text-gray-600">Anda masih dapat melanjutkan donasi sebagai donasi umum.</p>
              </div>
            ) : programDetail ? (
              <>
                <h3 className="font-semibold text-lg mb-3">Program Donasi</h3>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700">{programDetail.title}</h4>
                  <p className="text-sm text-gray-600">{programDetail.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Target:</span>
                    <span>Rp {programDetail.target_amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Terkumpul:</span>
                    <span>Rp {programDetail.current_amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((programDetail.current_amount / programDetail.target_amount) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress:</span>
                    <span>{Math.round((programDetail.current_amount / programDetail.target_amount) * 100)}%</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Payment Information Display */}
      {isSubmitted && paymentData && (
        <div className="mb-6 border rounded-lg bg-white shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold !pb-2 text-center text-lg mb-2">Informasi Pembayaran</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID Donasi:</span>
                <span>{paymentData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nama:</span>
                <span>{paymentData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jumlah:</span>
                <span>Rp {paymentData.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">Menunggu Pembayaran</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 italic">Silakan lanjutkan ke halaman pembayaran Midtrans...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <h2 className="text-3xl font-semibold text-center mb-5">
        {programDetail ? `Donasi - ${programDetail.title}` : 'Donasi'}
      </h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nama Anda"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={useDefaultName || loading || isSubmitted}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="useDefaultName"
              checked={useDefaultName}
              onChange={(e) => handleDefaultNameChange(e.target.checked)}
              disabled={loading || isSubmitted}
              className="rounded"
            />
            <label
              htmlFor="useDefaultName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Gunakan "Hamba Allah"
            </label>
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Alamat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan alamat Anda"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={loading || isSubmitted}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nomor WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nomor WhatsApp Anda"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.no_wa}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleInputChange('no_wa', value);
              }
            }}
            disabled={loading || isSubmitted}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          {errors.no_wa && <p className="text-red-500 text-sm mt-1">{errors.no_wa}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Masukkan email Anda"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={loading || isSubmitted}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Jumlah Donasi <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Masukkan jumlah donasi"
            value={formData.amount === 0 ? "" : formData.amount}
            onChange={(e) => {
              const value = e.target.value === "" ? 0 : Number(e.target.value);
              handleInputChange('amount', value);
            }}
            disabled={loading || isSubmitted}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <p className="text-sm text-gray-600 mt-1">Minimal Donasi Rp. 10.000</p>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Pesan <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 align-top resize-none"
            placeholder="Masukkan pesan Anda"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            disabled={loading || isSubmitted}
          />
          <p className="text-sm text-gray-600 mt-1">Silakan masukkan doa atau pesan Anda.</p>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        {isSubmitted ? (
          <div className="flex  justify-between gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="!px-4 w-1/2 !py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Donasi Baru
            </button>
            <button
              type="button"
              onClick={proceedToPayment}
              className="!px-4 !py-2 w-full bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors"
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full !py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Kirim Donasi"}
          </button>
        )}
      </form>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi Donasi</h3>
            <p className="text-gray-600 !mb-4">
              Apakah Anda yakin ingin melakukan donasi dengan detail berikut:
            </p>
            
            <div className="border rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                {programDetail && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Program:</span>
                    <span className="font-medium text-green-700">{programDetail.title}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Alamat:</span>
                  <span>{formData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp:</span>
                  <span>{formData.no_wa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah:</span>
                  <span>Rp {formData.amount.toLocaleString('id-ID')}</span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500">Pesan:</span>
                  <p className="mt-2">{formData.message}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDonation}
                disabled={loading}
                className="!px-4 !py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDonation}
                disabled={loading}
                className="!px-4 !py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Konfirmasi & Bayar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationForm;