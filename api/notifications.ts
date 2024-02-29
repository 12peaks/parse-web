import axios from "@/libs/axios";
import type { Notification } from "@/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get("/api/notifications");
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to fetch notifications");
  }
};

export const getUnreadNotificationCount = async (): Promise<{
  count: number;
}> => {
  const response = await axios.get("/api/notifications/unread_count");
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to fetch unread notification count");
  }
};

export const markRead = async (notification_id: string): Promise<void> => {
  const response = await axios.put(`/api/notifications/${notification_id}`, {
    status: "read",
  });
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to mark notification as read");
  }
};

export const markUnread = async (notification_id: string): Promise<void> => {
  const response = await axios.put(`/api/notifications/${notification_id}`, {
    status: "unread",
  });
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to mark notification as unread");
  }
};

export const markAllRead = async (): Promise<void> => {
  const response = await axios.post("/api/notifications/mark_all_as_read", {});
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to mark all notifications as read");
  }
};

export const deleteNotification = async (
  notification_id: string,
): Promise<void> => {
  const response = await axios.delete(`/api/notifications/${notification_id}`);
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete notification");
  }
};

export const deleteAllNotifications = async (): Promise<void> => {
  const response = await axios.post("/api/notifications/remove_all", {});
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete all notifications");
  }
};
