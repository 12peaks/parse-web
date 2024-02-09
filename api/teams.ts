import axios from "@/libs/axios";
import type { TeamUser } from "@/types/user";

export const getTeamUsers = async (): Promise<TeamUser[]> => {
  const response = await axios.get(`/api/teams/users`);
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};
