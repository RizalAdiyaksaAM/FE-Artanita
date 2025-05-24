import http from "@/utils/http";
import API_ENDPOINTS from "../api-endpoints";


export interface UserPayload {
    name: string;
    address: string;
    age: number;
    education: string;
    position: string;
    image: File | string; // File saat upload, string kosong jika tidak ada
}

export const createUser = async (data: UserPayload) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("address", data.address);
  formData.append("age", data.age.toString());
  formData.append("education", data.education);
  formData.append("position", data.position);
  formData.append("image", typeof data.image === "string" ? "" : data.image);

  const response = await http.post(API_ENDPOINTS.CREATE_USER, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
