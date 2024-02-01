import { Group } from "@/types/group";
import axios from "@/libs/axios";

type CreateGroupDTO = {
  name: string;
  description?: string;
  group_image?: string;
  header_image?: string;
  is_private: boolean;
  is_visible: boolean;
  url_name: string;
};

type UpdateGroupDTO = {
  id: number;
  name?: string;
  description?: string;
  group_image?: string;
  header_image?: string;
  team_id?: string;
  is_private?: boolean;
  is_visible?: boolean;
  url_name?: string;
};

export const getJoinedGroups = async (): Promise<Group[]> => {
  return [];
};

export const createGroup = async ({
  name,
  description,
  group_image,
  header_image,
  is_private,
  is_visible,
  url_name,
}: CreateGroupDTO): Promise<Group[]> => {
  return [];
};

export const updateGroup = async ({
  id,
  name,
  description,
  group_image,
  header_image,
  is_private,
  is_visible,
  url_name,
}: UpdateGroupDTO): Promise<Group[]> => {
  return [];
};

export const getAllGroups = async (searchTerm: string): Promise<Group[]> => {
  return [];
};

export const joinGroup = async (groupId: number): Promise<Group[]> => {
  return [];
};

export const leaveGroup = async (groupId: number): Promise<Group[]> => {
  return [];
};
