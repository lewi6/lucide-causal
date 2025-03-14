import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useWebPushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications not supported");
      return;
    }

    const registerServiceWorker = async () => {
      try {
        // Register service worker
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          type: "module",
        });
        setRegistration(reg);

        // Check if already subscribed
        const existingSub = await reg.pushManager.getSubscription();
        console.log("existingSub", existingSub);
        if (existingSub) {
          setSubscription(existingSub);
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error);
        toast.error("Failed to setup notifications");
      }
    };

    registerServiceWorker();
  }, []);

  const subscribeToNotifications = async () => {
    try {
      if (!registration) {
        throw new Error("Service Worker not registered");
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Get VAPID public key from your server
      const response = await fetch("/api/vapid-public-key");
      const vapidPublicKey = await response.text();

      // Convert VAPID key to Uint8Array
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      setSubscription(newSubscription);

      // Send subscription to server
      await fetch("/api/push-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubscription),
      });

      toast.success("Notifications Enabled");
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);

      toast.error("Failed to enable notifications");
    }
  };

  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return {
    subscription,
    subscribeToNotifications,
    isSupported: "serviceWorker" in navigator && "PushManager" in window,
  };
}
