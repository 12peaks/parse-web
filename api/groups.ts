import { Group, GroupUser } from "@/types/group";
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

type GroupMemberMutationDTO = {
  group_id: string;
  user_id: string;
};

export const getAllGroups = async (searchTerm: string): Promise<Group[]> => {
  const response = await axios.get(
    `/api/groups?search=${encodeURIComponent(searchTerm)}`
  );
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getJoinedGroups = async (): Promise<Group[]> => {
  const response = await axios.get("/api/groups?joined=true");
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getGroupById = async (groupId: string): Promise<Group> => {
  const response = await axios.get(`/api/groups/${groupId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Group;
  }
};

export const getGroupBySlug = async (groupSlug: string): Promise<Group> => {
  const response = await axios.get(`/api/groups?slug=${groupSlug}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Group;
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
  const response = await axios.put(`/api/groups/${id}`, {
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

export const joinGroup = async (groupId: string): Promise<GroupUser> => {
  const response = await axios.post(`/api/groups/${groupId}/join`);
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as GroupUser;
  }
};

export const leaveGroup = async (groupId: string): Promise<void> => {
  const response = await axios.post(`/api/groups/${groupId}/leave`);
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};

export const addToGroup = async ({
  group_id,
  user_id,
}: GroupMemberMutationDTO): Promise<GroupUser> => {
  const response = await axios.post("/api/group_users", {
    group_id,
    user_id,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as GroupUser;
  }
};

export const removeFromGroup = async ({
  group_id,
  user_id,
}: GroupMemberMutationDTO): Promise<void> => {
  const response = await axios.delete("/api/group_users", {
    data: {
      group_id,
      user_id,
    },
  });
};
