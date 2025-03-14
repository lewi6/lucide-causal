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
  fromName,
}: {
  userId: string;
  message: string;
  fromName: string;
}) => {
  const response = await axiosInstance.post(
    `${VITE_API_URL}/push-notifications/send`,
    {
      userId,
      message,
      fromId: fromName,
    }
  );
  return response.data;
};
