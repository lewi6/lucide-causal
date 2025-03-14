import { VITE_API_URL } from "@/util/apiRoute";
import axios from "axios";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${VITE_API_URL}/users/clients`);
  return response.data;
};

export interface User {
  id: number;
  name: string;
  subscribed: boolean;
}
