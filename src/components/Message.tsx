import useSendNotification from "@/hooks/useSendNotification";
import { User } from "@/services/crud";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { MessageCircle } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

const Message = ({ user, myName }: { user: User; myName: string }) => {
  const { mutate: sendNotification, isPending: isSendingNotification } =
    useSendNotification();

  const [message, setMessage] = useState("");

  const handleSendNotification = () => {
    sendNotification(
      {
        userId: String(user.id),
        message: message,
        fromName: myName,
      },
      {
        onSuccess: () => {
          toast.success("Notification sent successfully");
          setMessage("");
        },
      }
    );
  };
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendNotification();
          }
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        key={user.id}
        onClick={handleSendNotification}
        disabled={isSendingNotification}
        className="inline-flex items-center space-x-1 rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-indigo-700"
      >
        {isSendingNotification ? (
          <Spinner />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default Message;
