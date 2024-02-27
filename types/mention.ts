export type Mention = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  post_id: string;
  comment_id: string | null;
  group_id: string | null;
};

export type CreateMentionDTO = {
  post_id: string;
  mentioned_user_id: string;
  comment_id: string | null;
  group_id: string | null;
};
