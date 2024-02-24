import { TeamUser } from "./user";

export type Poll = {
  id: string;
  created_at: string;
  updated_at: string;
  content: string;
  user_id: string;
  group_id?: string;
  team_id: string;
  post_id: string;
  user: {
    id: string;
    name: string;
    avatar_image_url?: string;
  };
  poll_options: PollOption[];
};

export type PollOption = {
  id: string;
  created_at: string;
  updated_at: string;
  poll_id: string;
  text: string;
  poll_votes: PollVote[];
};

export type PollVote = {
  id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    avatar_image_url?: string;
  };
  poll_id: string;
  poll_option_id: string;
};

export type CreatePollDTO = {
  content: string;
  poll_options_attributes: PollOptionDTO[];
  group_id: string | null;
};

export type PollOptionDTO = {
  text: string;
  //poll_id: string | null;
};
