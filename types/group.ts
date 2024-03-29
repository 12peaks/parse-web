export type Group = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  is_private: boolean;
  is_visible: boolean;
  team_id: string;
  avatar_url?: string;
  cover_image_url?: string;
  url_slug: string;
  users: GroupUser[];
};

export type GroupUser = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  avatar_url?: string;
};
