import { useState, useEffect } from "react";
import { VITE_API_URL } from "@/util/apiRoute";
import useNotificationStore from "@/stores/useNotificationStores";
import useActivateNotification from "./useActivateNotification";
import { toast } from "sonner";
import { axiosInstance } from "@/util/axios";

export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const { mutate: activateNotification } = useActivateNotification();

  const { setSubscriptionJson } = useNotificationStore();

  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if (!("serviceWorker" in navigator)) {
          throw new Error("Service workers are not supported by this browser");
        }

        if (!("PushManager" in window)) {
          throw new Error(
            "Push notifications are not supported by this browser"
          );
        }

        const reg =
          await navigator.serviceWorker.register("/service-worker.js");
        setRegistration(reg);
        setPermission(Notification.permission);
        setLoading(false);

        // If already permitted, subscribe
        if (Notification.permission === "granted") {
          await subscribeUserToPush(reg);
        }
      } catch (err) {
        setError(
          JSON.stringify({
            message: "Error registering service worker",
            error: err,
          })
        );

        setLoading(false);
      }
    };

    registerServiceWorker();
  }, []);

  const handleActivateNotification = (newSubscription: PushSubscription) => {
    activateNotification(
      {
        session_id: localStorage.getItem("session_id") as string,
        subscription: newSubscription,
      },
      {
        onSuccess: () => {
          setSubscriptionJson(newSubscription);
          setLoading(false);

          toast.success("Notification activated");
        },
        onError: () => {
          toast.error("Failed to activate notification");
        },
      }
    );
  };

  const subscribeUserToPush = async (reg: ServiceWorkerRegistration) => {
    try {
      setLoading(true);

      // Get public VAPID key from server
      const vapidResponse = await axiosInstance.get(
        `${VITE_API_URL}/push-notifications/vapid-public-key`
      );
      const vapidPublicKey = vapidResponse.data.publicKey;

      // Convert VAPID key to Uint8Array
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      // Get push subscription
      const existingSubscription = await reg.pushManager.getSubscription();

      if (existingSubscription) {
        setSubscription(existingSubscription);
        handleActivateNotification(existingSubscription);

        setLoading(false);
        return existingSubscription;
      }

      const newSubscription = await reg.pushManager.subscribe({
        applicationServerKey: convertedVapidKey,
        userVisibleOnly: true,
      });

      setSubscription(newSubscription);

      handleActivateNotification(newSubscription);
      return newSubscription;
    } catch (err) {
      setError(JSON.stringify(err));
      setLoading(false);
      return null;
    }
  };

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted" && registration) {
        await subscribeUserToPush(registration);
      }

      return result;
    } catch (err) {
      setError(JSON.stringify(err));

      return null;
    }
  };

  return {
    subscription,
    permission,
    loading,
    error,
    requestPermission,
  };
};

// Helper function to convert base64 to Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
