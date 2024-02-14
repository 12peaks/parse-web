import axios from "@/libs/axios";
import type { Reaction, CreateReactionDTO } from "@/types/reaction";

export const createReaction = async ({
  post_id,
  emoji_text,
  emoji_code,
}: CreateReactionDTO): Promise<Reaction> => {
  const response = await axios.post(`/api/posts/${post_id}/reactions`, {
    emoji_text,
    emoji_code,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Reaction;
  }
};

export const deleteReaction = async ({
  reaction_id,
}: {
  reaction_id: string;
}): Promise<void> => {
  await axios.delete(`/api/reactions/${reaction_id}`);
};
