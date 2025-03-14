import { VITE_API_URL } from "@/util/apiRoute";
import { axiosInstance } from "@/util/axios";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get(`${VITE_API_URL}/users/clients`);
  return response.data;
};

export interface User {
  id: number;
  name: string;
  subscribed: boolean;
}
