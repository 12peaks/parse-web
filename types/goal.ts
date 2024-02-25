export type Goal = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  format: string;
  start_date: string;
  end_date: string;
  initial_value: number;
  target_value: number;
  user: {
    id: string;
    name: string;
    avatar_image_url?: string;
  };
};

export type CreateGoalDTO = {
  name: string;
  description?: string;
  format: string;
  start_date: string;
  end_date: string;
  initial_value: number;
  target_value: number;
};
