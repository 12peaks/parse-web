"use client";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/api/notifications";
import { NotificationPageHeader } from "@/app/_components/notifications/NotificationPageHeader";
import { NotificationTable } from "@/app/_components/notifications/NotificationTable";

export default function Notifications() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

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
