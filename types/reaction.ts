export type Reaction = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  post_id: string;
  emoji_text: string;
  emoji_code: string;
};

export type DisplayReaction = {
  id: string;
  emoji_text: string;
  emoji_code: string;
  count: number;
  has_reacted: boolean;
  my_reaction: Reaction | null;
};

export type CreateReactionDTO = {
  post_id: string;
  emoji_text: string;
  emoji_code: string;
};
