import { CurrentUser } from "@/types/user";
import axios from "@/libs/axios";

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const response = await axios.get("/api/users/current_user");
    return response.data;
  } catch (error) {
    return null;
  }
};
