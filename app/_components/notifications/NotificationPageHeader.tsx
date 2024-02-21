import { Button } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@/types/notification";
import { markAllRead, deleteAllNotifications } from "@/api/notifications";

type NotificationPageHeaderProps = {
  notificationsLoading: boolean;
  notifications: Notification[] | undefined;
};

export const NotificationPageHeader = ({
  notificationsLoading,
  notifications,
}: NotificationPageHeaderProps) => {
  const queryClient = useQueryClient();

  const markAllReadMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications"],
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications"],
      });
    },
  });

  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto flex flex-row justify-between items-center">
        <div className="self-start">
          <div className="text-xl font-semibold theme-text">Notifications</div>
          <div className="mt-2 text-sm theme-text-subtle">
            Notifications from posts, comments, and events you subscribe to.
          </div>
        </div>
        {!notificationsLoading && notifications && notifications.length > 0 ? (
          <div className="self-end space-x-2">
            <Button
              className="mr-2"
              variant="subtle"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
            >
              Mark all read
            </Button>
            <Button
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => deleteAllMutation.mutate()}
            >
              Remove all
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
