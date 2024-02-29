import { CurrentUser, TeamUser } from "@/types/user";
import axios from "@/libs/axios";

type UpdateUserDTO = {
  name: string;
  avatar?: File;
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const response = await axios.get("/api/users/current_user");
    return response.data;
  } catch (error) {
    throw new Error("Failed to get current user")
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await axios.delete("/api/users/sign_out");
  } catch (err) {
    throw new Error("Failed to sign out")
  }
};

export const updateUser = async ({
  name,
  avatar,
}: UpdateUserDTO): Promise<CurrentUser | null> => {
  const formData = new FormData();
  formData.append("user[name]", name);
  avatar ? formData.append("user[avatar]", avatar) : null;
  const response = await axios.put("/api/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to update user");
  }
};
