"use client";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/api/notifications";
import { NotificationPageHeader } from "@/app/_components/notifications/NotificationPageHeader";
import { NotificationTable } from "@/app/_components/notifications/NotificationTable";

export default function Notifications() {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  return (
    <>
      <NotificationPageHeader
        notificationsLoading={query.isLoading}
        notifications={query.data}
      />
      <NotificationTable notifications={query.data} />
    </>
  );
}
