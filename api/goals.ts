import axios from "@/libs/axios";
import type { CreateGoalDTO, Goal } from "@/types/goal";

export const getGoals = async (): Promise<Goal[]> => {
  const response = await axios.get("/api/goals");
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
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
    return {} as Goal;
  }
};

export const getGoal = async (goalId: string): Promise<Goal> => {
  const response = await axios.get(`/api/goals/${goalId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Goal;
  }
};

export const updateGoal = async ({ goal }: { goal: Goal }): Promise<Goal> => {
  const response = await axios.put(`/api/goals/${goal.id}`, {
    goal: goal,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Goal;
  }
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  const response = await axios.delete(`/api/goals/${goalId}`);
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};
