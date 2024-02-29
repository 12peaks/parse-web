import axios from "@/libs/axios";
import type {
  Post,
  FeedPost,
  CreatePostDTO,
  UpdatePostDTO,
} from "@/types/post";

export const getPosts = async (): Promise<FeedPost[]> => {
  const response = await axios.get("/api/posts");
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get posts")
  }
};

export const getGroupPosts = async (group_id: string): Promise<FeedPost[]> => {
  const response = await axios.get(`/api/posts?group_id=${group_id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get posts for group")
  }
};

export const getUserPosts = async (user_id: string): Promise<FeedPost[]> => {
  const response = await axios.get(`/api/posts?user_id=${user_id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get posts for profile")
  }
};

export const createPost = async ({
  content,
  text_content,
  group_id,
}: CreatePostDTO): Promise<Post> => {
  const response = await axios.post("/api/posts", {
    content,
    text_content,
    group_id,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to create post")
  }
};

export const updatePost = async ({
  id,
  content,
  text_content,
  is_pinned,
}: UpdatePostDTO): Promise<Post> => {
  const response = await axios.put(`/api/posts/${id}`, {
    content,
    text_content,
    is_pinned,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to update post")
  }
};

export const deletePost = async (id: string): Promise<void> => {
  return;
};
