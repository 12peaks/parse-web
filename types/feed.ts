import { FeedPost } from "@/types/post";
import { Poll } from "@/types/poll";

export type FeedItem =
  | (FeedPost & { type: "post" })
  | (Poll & { type: "poll" });
