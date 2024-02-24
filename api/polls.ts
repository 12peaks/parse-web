import axios from "@/libs/axios";
import type { Poll, CreatePollDTO } from "@/types/poll";

export const createPoll = async (poll: CreatePollDTO): Promise<Poll> => {
  const response = await axios.post("/api/polls", {
    poll: poll,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Poll;
  }
};

export const getPoll = async (pollId: string): Promise<Poll> => {
  const response = await axios.get(`/api/polls/${pollId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as Poll;
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
    return {} as Poll;
  }
};

export const removePollVote = async ({
  poll_option_id,
}: {
  poll_option_id: string;
}): Promise<void> => {
  const response = await axios.delete(`/api/poll_votes`, {
    data: {
      poll_option_id,
    },
  });
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};
