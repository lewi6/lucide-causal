import { VITE_API_URL } from "@/util/apiRoute";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/util/axios";

const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export default useLogout;

const logout = async ({ session_id }: { session_id: string }) => {
  const response = await axiosInstance.post(`${VITE_API_URL}/users/logout`, {
    session_id,
  });
  return response.data;
};
