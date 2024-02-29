import axios from "@/libs/axios";
import type {
  CreateCommentDTO,
  EditCommentDTO,
  Comment,
} from "@/types/comment";

export const createComment = async ({
  commentContent,
  postId,
}: CreateCommentDTO): Promise<Comment> => {
  const response = await axios.post("/api/comments", {
    content: commentContent,
    post_id: postId,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to create comment");
  }
};

export const editComment = async ({
  commentContent,
  commentId,
}: EditCommentDTO): Promise<Comment> => {
  const response = await axios.put(`/api/comments/${commentId}`, {
    content: commentContent,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to save edited comment");
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const response = await axios.delete(`/api/comments/${commentId}`);
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete comment");
  }
};
