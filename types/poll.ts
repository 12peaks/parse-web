export type Poll = {
  id: string;
  created_at: string;
  updated_at: string;
  content: string;
  user_id: string;
  group_id?: string;
  team_id: string;
  post_id: string;
  allow_multiple: boolean;
  poll_options: PollOption[];
};

export type PollOption = {
  id: number;
  created_at: number;
  updated_at: number;
  poll_id: string;
  text: string;
};

export type PollVote = {
  id: string;
  created_at: string;
  updated_at: string;
  voter_id: string;
  poll_id: string;
  poll_option_id: string;
  voter_profile_id: string;
};

export interface PollVoteWithAvatar extends PollVote {
  slack_profiles: {
    avatar_url: string;
  };
}

export type CreatePollDTO = {
  content: string;
  poll_options: PollOptionDTO[];
  allow_multiple: boolean;
  group_id: string | null;
};

export type PollOptionDTO = {
  text: string;
  poll_id: string | null;
};
