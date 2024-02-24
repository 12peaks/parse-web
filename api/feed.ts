import axios from "@/libs/axios";
import type { FeedItem } from "@/types/feed";

export const getFeedItems = async (): Promise<FeedItem[]> => {
  const response = await axios.get("/api/feed");
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};
