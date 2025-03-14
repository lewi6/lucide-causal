import { UserCircle2 } from "lucide-react";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import { Button } from "./ui/button";
import useLogout from "@/hooks/useLogout";
import { Spinner } from "./ui/spinner";

import useNotificationStore from "@/stores/useNotificationStores";
import PushNotificationToggle from "./NotificationToggle";

import useWhoAmi from "@/hooks/useWhoAmi";
import Message from "./Message";

function UserList() {
  const { data, isLoading, error } = useGetAllUsers();

  const { mutate: logout, isPending } = useLogout();

  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useWhoAmi();

  // In your component:
  const { setSubscriptionJson } = useNotificationStore();

  // To set the subscription:

  // To read the subscription:
  // console.log(subscriptionJson);

  if (isLoading || userLoading) {
    return <div>Loading...</div>;
  }
  if (error || userError) {
    return <div>Error: {error?.message || userError?.message}</div>;
  }
  if (data?.length === 0 || !data) {
    return <div>No users found</div>;
  }

  const handleLogout = () => {
    logout(
      { session_id: localStorage.getItem("session_id") as string },
      {
        onSuccess: () => {
          localStorage.removeItem("session_id");
          setSubscriptionJson(null);
          window.location.reload();
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <PushNotificationToggle />

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between bg-indigo-300 px-6 py-4">
          <div className="text-2xl font-bold text-white">
            Hi {userInfo?.name}
          </div>
          <div className="flex items-center gap-4">
            {/* 
            {subscriptionJson === null ? (
              <Button variant={"outline"} onClick={handleActivateNotification}>
                {isActivating ? (
                  <Spinner />
                ) : (
                  <>
                    <Bell className="h-4 w-4" /> {"Activate Notification"}
                  </>
                )}
              </Button>
            ) : (
              <div>
                <Bell className="h-4 w-4 text-white" />
              </div>
            )}
               */}
            <Button variant={"outline"} onClick={handleLogout}>
              {isPending ? <Spinner /> : "Logout"}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Subscription
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data
                .filter((user) => user.id !== userInfo?.id)
                .map((user, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <UserCircle2 className="h-8 w-8 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.subscribed ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Subscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Not Subscribed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.subscribed && <Message user={user} />}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <img
          src="https://i.postimg.cc/nrJZRVhM/teachers-team.jpg"
          alt="Vite"
          className="h-10 w-10"
        />
      </div>
    </div>
  );
}

export default UserList;
