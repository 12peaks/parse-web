"use client";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/api/notifications";
import { NotificationPageHeader } from "@/app/_components/notifications/NotificationPageHeader";
import { NotificationTable } from "@/app/_components/notifications/NotificationTable";

export default function Notifications() {
  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  if (isError) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }

  return (
    <>
      <NotificationPageHeader
        notificationsLoading={isLoading}
        notifications={notifications}
      />
      <NotificationTable notifications={notifications} />
    </>
  );
}
