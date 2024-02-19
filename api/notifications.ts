import axios from "@/libs/axios";
import type { Notification } from "@/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get("/api/notifications");
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getUnreadNotificationCount = async (): Promise<{
  count: number;
}> => {
  const response = await axios.get("/api/notifications/unread_count");
  if (response.status === 200) {
    return response.data;
  } else {
    return { count: 0 };
  }
};

export const markRead = async (notification_id: string): Promise<void> => {
  const response = await axios.put(`/api/notifications/${notification_id}`, {
    status: "read",
  });
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};

export const markUnread = async (notification_id: string): Promise<void> => {
  const response = await axios.put(`/api/notifications/${notification_id}`, {
    status: "unread",
  });
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};

export const markAllRead = async (): Promise<void> => {
  const response = await axios.post("/api/notifications/mark_all_as_read", {});
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};

export const deleteNotification = async (
  notification_id: string
): Promise<void> => {
  const response = await axios.delete(`/api/notifications/${notification_id}`);
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};

export const deleteAllNotifications = async (): Promise<void> => {
  const response = await axios.post("/api/notifications/remove_all", {});
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};
