"use client";
import TimeAgo from "timeago-react";
import { Button, UnstyledButton } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markRead,
  markUnread,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/notifications";
import type { Notification } from "@/types/notification";
import { Authenticated } from "@/app/_components/auth/Authenticated";
import { useRouter } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Notifications() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

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

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === "unread") {
      markReadMutation.mutate(notification.id);
    }
    router.push(buildNotificationUrl(notification));
  };

  function buildNotificationUrl(notification: Notification) {
    switch (notification.target_model) {
      case "posts":
        if (notification.group_id) {
          return `/post/${notification.target_model_id}`;
        } else {
          return `/post/${notification.target_model_id}`;
        }
      case "comments":
      case "mentions":
      case "reactions":
        if (notification.group_id) {
          return `/post/${notification.post_id}`;
        } else {
          return `/post/${notification.post_id}`;
        }
      case "triage_events":
        return `/triage/${notification.target_model_id}`;
      default:
        return "/notifications";
    }
  }

  return (
    <Authenticated>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto flex flex-row justify-between items-center">
          <div className="self-start">
            <div className="text-xl font-semibold theme-text">
              Notifications
            </div>
            <div className="mt-2 text-sm theme-text-subtle">
              Notifications from posts, comments, and events you subscribe to.
            </div>
          </div>
          {query.isSuccess && query.data.length > 0 ? (
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
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y theme-divide">
                {query.data && query.data.length > 0 ? (
                  <tbody className="divide-y theme-divide">
                    {query.data.map((notification) => (
                      <tr
                        key={notification.id}
                        className="hover:theme-bg-subtle"
                      >
                        <td className="whitespace-nowrap p-4 pr-3 text-sm sm:pl-6">
                          <div className="flex flex-row justify-items-stretch items-center">
                            <UnstyledButton
                              className="justify-self-start grow"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                            >
                              <div className="flex items-center text-sm">
                                <div className="flex h-10 items-center justify-items-center w-10 rounded-full flex-shrink-0">
                                  {notification.target_model === "reactions" ? (
                                    <div className="h-10 w-10 flex relative rounded-full text-2xl">
                                      <div className="absolute top-[5px] left-[7px]">
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
                                    <TimeAgo
                                      datetime={notification.created_at}
                                    />
                                  </div>
                                </div>
                              </div>
                            </UnstyledButton>
                            {notification.status === "unread" ? (
                              <Button
                                className="justify-self-end mr-2 shrink"
                                variant="subtle"
                                onClick={() =>
                                  markReadMutation.mutate(notification.id)
                                }
                              >
                                Mark as read
                              </Button>
                            ) : (
                              <Button
                                className="justify-self-end mr-2 shrink"
                                variant="subtle"
                                onClick={() =>
                                  markUnreadMutation.mutate(notification.id)
                                }
                              >
                                Mark as unread
                              </Button>
                            )}

                            <Button
                              className="justify-self-end shrink"
                              variant="subtle"
                              color="red"
                              onClick={() =>
                                deleteMutation.mutate(notification.id)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody className="divide-y theme-divide">
                    <tr>
                      <td>
                        <div className="p-4 text-center">
                          You don't have any notifications.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
