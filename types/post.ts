export type Post = {
  id: string;
  created_at: number;
  updated_at: number;
  content: string;
  text_content?: string;
  user_id: string;
  group_id: string | null;
  is_pinned: boolean;
};

export interface FeedPost extends Post {
  group: {
    id: string;
    name: string;
    url_slug: string;
  } | null;
  user: {
    id: string;
    name: string;
    github_image: string;
    avatar_url: string;
  };
}

export type HiddenPost = {
  id: number;
  created_at: number;
  updated_at: number;
  post_id: number;
  user_id: string;
};

export type GetFeedPostsDTO = {
  group_id: string | null;
  team_id: string;
  home_feed: boolean;
  range: number[] | null;
};

export type FeedPostResults = {
  posts: FeedPost[];
  count: number;
};

export type CreatePostDTO = {
  content: string;
  text_content?: string;
  group_id: string | null;
};

export type UpdatePostDTO = {
  id: string;
  content?: string;
  text_content?: string;
  is_pinned?: boolean;
  user_id?: string;
};

export type GetPostsParams = {
  group_id: string | null;
  team_id: string;
  home_feed: boolean;
  range: number[] | null;
};

export const PAGE_SIZE = 20;
