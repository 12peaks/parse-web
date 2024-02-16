import axios from "@/libs/axios";
import type { TeamUser, PendingUser } from "@/types/user";

export const getTeamUsers = async (): Promise<TeamUser[]> => {
  const response = await axios.get(`/api/teams/users`);
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  return [];
};

export const followUser = async (user_id: string): Promise<void> => {
  return;
};

export const unfollowUser = async (user_id: string): Promise<void> => {
  return;
};
