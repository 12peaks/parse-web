import TimeAgo from "timeago-react";
import { UnstyledButton, Button } from "@mantine/core";
import type { Notification } from "@/types/notification";

type NotificationRowProps = {
  notification: Notification;
  markNotificationRead: (notification_id: string) => void;
  markNotificationUnread: (notification_id: string) => void;
  deleteNotification: (notification_id: string) => void;
  handleNotificationClick: (notification: Notification) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const NotificationRow = ({
  notification,
  handleNotificationClick,
  markNotificationRead,
  markNotificationUnread,
  deleteNotification,
}: NotificationRowProps) => {
  return (
    <tr key={notification.id} className="hover:theme-bg-subtle">
      <td className="whitespace-nowrap p-4 pr-3 text-sm sm:pl-6">
        <div className="flex flex-row justify-items-stretch items-center">
          <UnstyledButton
            className="justify-self-start grow"
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-center text-sm">
              <div className="flex h-10 items-center justify-items-center w-10 rounded-full flex-shrink-0">
                {notification.target_model === "reaction" ? (
                  <div className="h-10 w-10 flex relative rounded-full text-2xl bg-white items-center justify-center">
                    <div className="text-center mt-1">
                      {notification.image_url}
                    </div>
                  </div>
                ) : (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={notification.image_url}
                    alt=""
                  />
                )}
              </div>
              <div className="ml-4">
                <div
                  className={classNames(
                    notification.status === "unread"
                      ? "font-bold theme-text"
                      : "font-normal theme-text-subtle",
                    ""
                  )}
                >
                  {notification.text}
                </div>
                <div className="theme-text-subtle text-xs">
                  <TimeAgo datetime={notification.created_at} />
                </div>
              </div>
            </div>
          </UnstyledButton>
          {notification.status === "unread" ? (
            <Button
              className="justify-self-end mr-2 shrink"
              variant="subtle"
              onClick={() => markNotificationRead(notification.id)}
            >
              Mark as read
            </Button>
          ) : (
            <Button
              className="justify-self-end mr-2 shrink"
              variant="subtle"
              onClick={() => markNotificationUnread(notification.id)}
            >
              Mark as unread
            </Button>
          )}

          <Button
            className="justify-self-end shrink"
            variant="subtle"
            color="red"
            onClick={() => deleteNotification(notification.id)}
          >
            Remove
          </Button>
        </div>
      </td>
    </tr>
  );
};
