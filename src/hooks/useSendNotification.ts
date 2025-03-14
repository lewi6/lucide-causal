import { VITE_API_URL } from "@/util/apiRoute";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/util/axios";

const useSendNotification = () => {
  return useMutation({
    mutationKey: ["sendNotification"],
    mutationFn: sendNotification,
  });
};

export default useSendNotification;

const sendNotification = async ({
  userId,
  message,
}: {
  userId: string;
  message: string;
}) => {
  const response = await axiosInstance.post(
    `${VITE_API_URL}/push-notifications/send`,
    {
      userId,
      message,
    }
  );
  return response.data;
};
