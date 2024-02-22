import type { CurrentUser, TeamUser } from "@/types/user";
import { FileWithPath } from "@mantine/dropzone";

export type TriageEvent = {
  id: string;
  created_at: string;
  updated_at: string;
  description: string;
  status: string;
  severity: string;
  user_id: string;
  user: TeamUser;
  team_id: string;
  owner_id: string;
  owner: TeamUser;
  event_number: number;
  attachments_data: TriageFile[];
};

export type TriageFile = {
  id: number;
  name: string;
  url: string;
};

export type CreateTriageEventDTO = {
  description: string;
  status: string;
  severity: string;
  team_id?: string;
  owner_id: string;
  attachments?: FileWithPath[];
};

export type UpdateTriageEventDTO = {
  id: string;
  description?: string;
  status?: string;
  severity?: string;
  user_id?: string;
  team_id?: string;
  owner_id?: string;
  attachments?: FileWithPath[];
};

export type CreateTimelineEventDTO = {
  oldValue?: string | null;
  newValue: string | number;
  field: string;
  triageEventId: string;
};

export type TriageTimelineEvent = {
  id: string;
  created_at: string;
  updated_at: string;
  old_value?: string;
  new_value: string;
  updated_by: string;
  triage_event_id: string;
  updater_id: string;
  field: string;
  updater: CurrentUser;
};

export type TriageEventComment = {
  id: number;
  created_at: number;
  updated_at: number;
  text: string;
  user_id: string;
  profile_id: number;
  triage_event_id: number;
  profile: {
    id: number;
    real_name: string;
    avatar_url: string;
  };
};
