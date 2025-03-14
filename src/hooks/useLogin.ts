import { VITE_API_URL } from "@/util/apiRoute";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { APIError } from "@/lib/utils";

const useLogin = () => {
  return useMutation<
    typeof DLoginResponse,
    APIError,
    { username: string; password: string }
  >({
    mutationKey: ["login"],
    mutationFn: login,
  });
};

export default useLogin;

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(`${VITE_API_URL}/users/login`, {
    name: username,
    password,
  });
  return response.data as typeof DLoginResponse;
};

const DLoginResponse = {
  id: 7,
  name: "test_user",
  session_id: "efe51428-cb82-4aab-9369-fe30b0c515b3",
};
