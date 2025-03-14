import { usePushNotifications } from "../hooks/usePushNotifications";
import { Button } from "./ui/button";

const PushNotificationToggle = () => {
  const { permission, loading, error, requestPermission } =
    usePushNotifications();

  if (loading) {
    return <div>Loading notification service...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="push-notification-container">
      <h3>Push Notifications</h3>

      {permission === "default" && (
        <Button onClick={requestPermission} className="notification-btn">
          Enable Push Notifications
        </Button>
      )}

      {permission === "granted" && (
        <div className="notification-status">
          Push notifications are enabled ✅
        </div>
      )}

      {permission === "denied" && (
        <div className="notification-status denied">
          Push notifications are blocked. Please enable them in your browser
          settings.
        </div>
      )}
    </div>
  );
};

export default PushNotificationToggle;
