import { VITE_API_URL } from "@/util/apiRoute";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { APIError } from "@/lib/utils";

const useActivateNotification = () => {
  return useMutation<string, APIError, NotificationPayload>({
    mutationKey: ["activateNotification"],
    mutationFn: activateNotification,
  });
};

export default useActivateNotification;

const activateNotification = async (payload: NotificationPayload) => {
  const response = await axios.post(
    `${VITE_API_URL}/users/activate-notification`,
    payload
  );
  return response.data as string;
};

interface NotificationPayload {
  subscription: PushSubscription;
  session_id: string;
}
