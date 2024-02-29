import axios from "@/libs/axios";
import type { Poll, CreatePollDTO } from "@/types/poll";

export const createPoll = async (poll: CreatePollDTO): Promise<Poll> => {
  const response = await axios.post("/api/polls", {
    poll: poll,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get polls")
  }
};

export const getPoll = async (pollId: string): Promise<Poll> => {
  const response = await axios.get(`/api/polls/${pollId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to get poll")
  }
};

export const votePoll = async ({
  poll_option_id,
}: {
  poll_option_id: string;
}): Promise<Poll> => {
  const response = await axios.post(`/api/poll_votes`, {
    poll_option_id,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to save vote")
  }
};

export const removePollVote = async ({
  poll_vote_id,
}: {
  poll_vote_id: string;
}): Promise<void> => {
  const response = await axios.delete(`/api/poll_votes/${poll_vote_id}`);
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to remove vote")
  }
};

export const deletePoll = async (pollId: string): Promise<void> => {
  const response = await axios.delete(`/api/polls/${pollId}`);
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete poll")
  }
};
