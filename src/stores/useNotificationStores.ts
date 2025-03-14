import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const NOTIFICATION_SOUND_URL =
  "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

// PushSubscription

interface NotificationStore {
  subscriptionJson: PushSubscription | null;
  setSubscriptionJson: (subscription: PushSubscription | null) => void;
  playNotificationSound: () => void;
  audio: HTMLAudioElement | null;
}

const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      subscriptionJson: null,
      audio:
        typeof window !== "undefined"
          ? new Audio(NOTIFICATION_SOUND_URL)
          : null,
      setSubscriptionJson: (subscription) =>
        set({ subscriptionJson: subscription }),
      playNotificationSound: () => {
        const audio = get().audio;
        if (audio) {
          audio.currentTime = 0; // Reset the audio to start
          audio
            .play()
            .catch((error) =>
              console.error("Error playing notification sound:", error)
            );
        }
      },
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ subscriptionJson: state.subscriptionJson }), // Only persist subscription data, not audio
    }
  )
);

export default useNotificationStore;
