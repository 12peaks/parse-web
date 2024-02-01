export type Group = {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  description?: string;
  is_private: boolean;
  is_visible: boolean;
  team_id: string;
  group_image?: string;
  slack_channel_id?: string;
  header_image: string;
  url_name: string;
  group_members?: GroupMember[];
};

export type GroupMember = {
  id: number;
  created_at: number;
  updated_at: number;
  group_id: number;
  user_id: string;
  slack_profile_id: number;
};

export type SharedFile = {
  id: number;
  created_at: number;
  updated_at: number;
  file_created: number;
  name: string;
  file_type: string;
  mime_type: string;
  access_url: string;
  source: string;
  source_id: string;
  slack_channel_id: string;
  slack_user_id: string;
  comment_count: number | null;
  slack_team_id: string;
};
