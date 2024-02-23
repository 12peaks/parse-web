export type CurrentUser = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  avatar_image_url?: string;
  github_image?: string;
  github_username?: string;
  x_username?: string;
  current_team: {
    id: string;
    name: string;
  };
};

export type TeamUser = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  avatar_image_url?: string;
  github_image?: string;
  github_username?: string;
  x_username?: string;
  invitation_created_at?: string;
  last_sign_in_at?: string;
};

export type PendingUser = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  invited_at: string;
};
