import { Group } from "@/types/group";
import axios from "@/libs/axios";

type CreateGroupDTO = {
  name: string;
  description?: string;
  is_private: boolean;
  is_visible: boolean;
};

type UpdateGroupDTO = {
  id: string;
  name?: string;
  description?: string;
  is_private?: boolean;
  is_visible?: boolean;
};

export const getJoinedGroups = async (): Promise<Group[]> => {
  const response = await axios.get("/api/groups?joined=true");
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const createGroup = async ({
  name,
  description,
  is_private,
  is_visible,
}: CreateGroupDTO): Promise<Group> => {
  const response = await axios.post("/api/groups", {
    name,
    description,
    is_private,
    is_visible,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Group;
  }
};

export const updateGroup = async ({
  id,
  name,
  description,
  is_private,
  is_visible,
}: UpdateGroupDTO): Promise<Group> => {
  return {} as Group;
};

export const getAllGroups = async (searchTerm: string): Promise<Group[]> => {
  const response = await axios.get("/api/groups");
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const joinGroup = async (groupId: string): Promise<Group[]> => {
  return [];
};

export const leaveGroup = async (groupId: string): Promise<Group[]> => {
  return [];
};
