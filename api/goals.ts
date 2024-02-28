import axios from "@/libs/axios";
import type {
  CreateGoalDTO,
  UpdateGoalDTO,
  CreateGoalUpdateDTO,
  Goal,
  GoalUpdate,
  UpdateGoalUpdateDTO,
} from "@/types/goal";

export const getGoals = async (): Promise<Goal[]> => {
  const response = await axios.get("/api/goals");
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get goals")
  }
};

export const createGoal = async ({
  goal,
}: {
  goal: CreateGoalDTO;
}): Promise<Goal> => {
  const response = await axios.post("/api/goals", {
    goal: goal,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to create goal");
  }
};

export const getGoal = async (goalId: string): Promise<Goal> => {
  const response = await axios.get(`/api/goals/${goalId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get goal")
  }
};

export const updateGoal = async ({
  goal,
}: {
  goal: UpdateGoalDTO;
}): Promise<Goal> => {
  const response = await axios.put(`/api/goals/${goal.id}`, {
    goal: goal,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to update goal")
  }
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  const response = await axios.delete(`/api/goals/${goalId}`);
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete goal")
  }
};

export const createGoalUpdate = async (
  update: CreateGoalUpdateDTO
): Promise<GoalUpdate> => {
  const response = await axios.post(`/api/goal_updates`, update);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to save goal update")
  }
};

export const updateGoalUpdate = async (
  update: UpdateGoalUpdateDTO
): Promise<GoalUpdate> => {
  const response = await axios.put(`/api/goal_updates/${update.id}`, {
    update,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to save goal progress update")
  }
};

export const deleteGoalUpdate = async (updateId: string): Promise<void> => {
  const response = await axios.delete(`/api/goal_updates/${updateId}`);
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete goal progress update")
  }
};
