import axios from "@/libs/axios";
import type { Mention, CreateMentionDTO } from "@/types/mention";

export const createMention = async (
  mentions: CreateMentionDTO[],
): Promise<Mention> => {
  const responses = await Promise.all(
    mentions.map((mention) => axios.post("/api/mentions", mention)),
  );
  const response = responses[0];
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to create mention");
  }
};
