import { VITE_API_URL } from "@/util/apiRoute";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useWhoAmi = () => {
  return useQuery({
    queryKey: ["whomai"],
    queryFn: whomai,
  });
};

export default useWhoAmi;

const whomai = async () => {
  const response = await axios.post(`${VITE_API_URL}/users/profile`, {
    session_id: localStorage.getItem("session_id") as string,
  });
  return response.data as typeof DLoginResponse;
};

const DLoginResponse = {
  id: 7,
  name: "test_user",
};
