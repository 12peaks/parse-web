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
  goal_updates: GoalUpdate[];
  goal_collaborators: GoalCollaborator[];
};

export type CreateGoalDTO = {
  name: string;
  description?: string;
  format: string;
  start_date: Date;
  end_date: Date;
  initial_value: number;
  target_value: number;
};

export type UpdateGoalDTO = {
  id: string;
  name: string;
  description?: string;
  format: string;
  start_date: Date;
  end_date: Date;
  initial_value: number;
  target_value: number;
};

export type GoalUpdate = {
  id: string;
  created_at: string; // ;
  updated_at: string;
  note: string;
  status: string;
  value: number;
  user: {
    id: string;
    name: string;
    avatar_image_url?: string;
  };
};

export type CreateGoalUpdateDTO = {
  goal_id: string;
  note: string;
  status: string;
  value: number;
};

export type UpdateGoalUpdateDTO = {
  id: string;
  note: string;
  status: string;
  value: number;
};

export type GoalCollaborator = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar_image_url?: string;
  };
};
