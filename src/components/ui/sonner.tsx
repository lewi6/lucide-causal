import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
      const audio = new Audio(event.data.soundUrl);
      audio
        .play()
        .catch((error) => console.error("Failed to play sound:", error));
    }
  });

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",
          "--error-border": "var(--destructive-border)",
          "--success-bg": "var(--success)",
          "--success-text": "var(--success-foreground)",
          "--success-border": "var(--success-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
