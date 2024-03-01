import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { markRead, markUnread, deleteNotification } from "@/api/notifications";
import type { Notification } from "@/types/notification";
import { NotificationRow } from "@/app/_components/notifications/NotificationRow";
import { NotificationsEmptyState } from "@/app/_components/notifications/NotificationsEmptyState";

type NotificationTableProps = {
  notifications: Notification[] | undefined;
};

export const NotificationTable = ({
  notifications,
}: NotificationTableProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications"],
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const markUnreadMutation = useMutation({
    mutationFn: markUnread,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications"],
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === "unread") {
      markReadMutation.mutate(notification.id);
    }
    router.push(buildNotificationUrl(notification));
  };

  function buildNotificationUrl(notification: Notification) {
    switch (notification.target_model) {
      case "post":
        if (notification.group_id) {
          return `/post/${notification.target_model_id}`;
        } else {
          return `/post/${notification.target_model_id}`;
        }
      case "comment":
      case "mention":
      case "reaction":
        if (notification.group_id) {
          return `/post/${notification.post_id}`;
        } else {
          return `/post/${notification.post_id}`;
        }
      case "triage_event":
        return `/triage/${notification.target_model_id}`;
      default:
        return "/notifications";
    }
  }

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow border theme-border ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y theme-divide">
              {notifications && notifications.length > 0 ? (
                <tbody className="divide-y theme-divide">
                  {notifications.map((notification) => (
                    <NotificationRow
                      key={notification.id}
                      notification={notification}
                      markNotificationRead={markReadMutation.mutate}
                      markNotificationUnread={markUnreadMutation.mutate}
                      deleteNotification={deleteMutation.mutate}
                      handleNotificationClick={handleNotificationClick}
                    />
                  ))}
                </tbody>
              ) : (
                <NotificationsEmptyState />
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
