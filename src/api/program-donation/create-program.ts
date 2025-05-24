// api/program-donation/create-program.ts
import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";

export interface ProgramDonationPayload {
    title: string;
    deskripsi: string;
    goal_amount: number;
    program_donation_images: ProgramDonationImage[];
    imageFiles?: File[]; // Tambahkan untuk file yang sebenarnya
}

export interface ProgramDonationImage {
    image_url: string;
}

export const programs = async (data: ProgramDonationPayload) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("deskripsi", data.deskripsi);
  formData.append("goal_amount", data.goal_amount.toString());

  // Jika ada file gambar yang sebenarnya, gunakan itu
  if (data.imageFiles && data.imageFiles.length > 0) {
    data.imageFiles.forEach((file) => {
      formData.append("image", file); // Gunakan file yang sebenarnya
    });
  } else if (data.program_donation_images && data.program_donation_images.length > 0) {
    // Fallback untuk URL string (untuk kasus import CSV)
    data.program_donation_images.forEach((img, index) => {
      formData.append(`image_urls[${index}]`, img.image_url);
    });
  }

  const response = await http.post(API_ENDPOINTS.CREATE_PROGRAM_DONATION, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};