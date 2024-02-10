export type Comment = {
  id: string;
  created_at: string;
  updated_at: string;
  content: string;
  post_id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
};

export type CreateCommentDTO = {
  commentContent: string;
  postId: string;
};

export type EditCommentDTO = {
  commentContent: string;
  commentId: string;
};
