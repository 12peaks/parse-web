import axios from "@/libs/axios";
import type { FeedItem } from "@/types/feed";

export const getFeedItems = async (): Promise<FeedItem[]> => {
  const response = await axios.get("/api/feed");
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get feed items");
  }
};

export const getGroupFeedItems = async (
  groupId: string,
): Promise<FeedItem[]> => {
  const response = await axios.get(`/api/feed?group_id=${groupId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get feed items for group");
  }
};

export const getUserFeedItems = async (userId: string): Promise<FeedItem[]> => {
  const response = await axios.get(`/api/feed?user_id=${userId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get feed items for group");
  }
};
