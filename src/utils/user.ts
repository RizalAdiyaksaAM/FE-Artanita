import type { UserFormData } from "@/types/user";


export const createInitialUserFormState = (): UserFormData => ({
  name: "",
  address: "",
  age: "",
  education: "",
  position: "",
  imageFile: null
});

export const getAgeGroup = (age: number): string => {
  if (age <= 10) return "0-10";
  if (age <= 15) return "11-15";
  if (age <= 20) return "16-20";
  return "21+";
};
