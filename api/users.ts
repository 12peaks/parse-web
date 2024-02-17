import { CurrentUser, TeamUser } from "@/types/user";
import axios from "@/libs/axios";

type UpdateUserDTO = {
  name: string;
  email: string;
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const response = await axios.get("/api/users/current_user");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await axios.delete("/api/users/sign_out");
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async ({
  name,
  email,
}: UpdateUserDTO): Promise<CurrentUser | null> => {
  const response = await axios.put("/api/users", {
    name,
    email,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return null;
  }
};
