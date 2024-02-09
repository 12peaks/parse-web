export type CurrentUser = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name?: string;
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
  github_image?: string;
  github_username?: string;
  x_username?: string;
};
