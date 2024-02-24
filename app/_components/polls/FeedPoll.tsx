import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPoll, votePoll, removePollVote } from "@/api/polls";
import { Button } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import pluralize from "pluralize";
import type { Poll, PollOption, PollVote } from "@/types/poll";
import type { CurrentUser } from "@/types/user";

type FeedPollProps = {
  poll: Poll;
  user: CurrentUser;
};

export const FeedPoll = ({ poll, user }: FeedPollProps) => {
  const [myVote, setMyVote] = useState<PollVote | null>(null);
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: votePoll,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls"],
      });
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: removePollVote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls"],
      });
    },
  });

  const handlePollVote = (option: PollOption) => {
    if (poll && user) {
      voteMutation.mutate({
        poll_id: poll.id,
        poll_option_id: option.id,
      });
    }
  };

  const handleRemoveVote = (option: PollOption) => {
    if (poll && user) {
      removeVoteMutation.mutate({
        poll_id: poll.id,
        poll_option_id: option.id,
      });
    }
  };

  return (
    <>
      {poll ? (
        <div className="my-4">
          <div className="mb-2">{poll.content}</div>
          {poll.poll_options.map((option) => (
            <div
              key={option.id}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <div
                className={`col-span-7 col-start-1 px-4 py-2 text-sm flex flex-column justify-between items-center ${
                  myVote && myVote.poll_option_id === option.id
                    ? "theme-bg-subtle rounded-lg"
                    : null
                }`}
              >
                <span>{option.text}</span>
                {myVote && myVote.poll_option_id === option.id ? (
                  <div className="bg-green-500 rounded-full p-1">
                    <IconCheck size={16} color="white" />
                  </div>
                ) : null}
              </div>
              <div className="col-span-1 col-start-8 flex justify-center">
                {myVote && myVote.poll_option_id === option.id ? (
                  <div
                    className="p-1 rounded-full border theme-border flex justify-center items center hover:shadow hover:cursor-pointer"
                    onClick={() => handleRemoveVote(option)}
                  >
                    <IconX size={16} />
                  </div>
                ) : (
                  <>
                    {myVote ? null : (
                      <Button
                        variant="outline"
                        size="xs"
                        radius="xl"
                        onClick={() => handlePollVote(option)}
                      >
                        Vote
                      </Button>
                    )}
                  </>
                )}
              </div>
              <div className="col-span-3 col-start-9 py-0.5">
                {option.poll_votes && option.poll_votes.length > 0 ? (
                  <>
                    <div className="flex -space-x-1 relative z-0 overflow-hidden justify-center">
                      {option.poll_votes.map((vote, idx) => (
                        <div key={vote.id}>
                          {idx > 4 ? null : (
                            <img
                              key={idx}
                              className={`relative z-${
                                50 - 10 * idx
                              } inline-block h-6 w-6 rounded-full ring-2 ring-white`}
                              src={vote.user.avatar_image_url}
                              alt=""
                            />
                          )}
                        </div>
                      ))}
                      <>
                        {option.poll_votes.length > 5 ? (
                          <div className="inline-block h-6 w-6 bg-gray-300 rounded-full ring-2 ring-white text-xs items-center justify-center flex">
                            +{option.poll_votes.length - 5}
                          </div>
                        ) : null}
                      </>
                    </div>

                    <div className="text-xs w-full text-center">
                      {pluralize("vote", option.poll_votes.length, true)}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};
