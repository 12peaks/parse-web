import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu, Button, ActionIcon, Avatar, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { votePoll, removePollVote, deletePoll } from "@/api/polls";
import {
  IconCheck,
  IconX,
  IconEdit,
  IconTrash,
  IconLink,
  IconDots,
} from "@tabler/icons-react";
import pluralize from "pluralize";
import type { Poll, PollOption } from "@/types/poll";
import type { CurrentUser } from "@/types/user";
import TimeAgo from "timeago-react";

type FeedPollProps = {
  poll: Poll;
  user: CurrentUser;
};

export const FeedPoll = ({ poll, user }: FeedPollProps) => {
  const clipboard = useClipboard();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: votePoll,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedItems"],
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: removePollVote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedItems"],
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const deletePollMutation = useMutation({
    mutationFn: deletePoll,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedItems"],
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const handlePollVote = (option: PollOption) => {
    if (poll && user) {
      voteMutation.mutate({
        poll_option_id: option.id,
      });
    }
  };

  const handleRemoveVote = (option: PollOption) => {
    const poll_vote_id = option.poll_votes.find(
      (v) => v.user.id === user.id,
    )?.id;
    if (poll && user && poll_vote_id) {
      removeVoteMutation.mutate({
        poll_vote_id,
      });
    }
  };

  const handleCopyLink = () => {
    clipboard.copy(`${window.location.origin}/polls/${poll.id}`);
  };

  const togglePollEdit = () => {
    console.log("REPLACE TOGGLE POLL EDIT");
  };

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: "Delete poll",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this poll?</Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        deletePollMutation.mutate(poll.id);
      },
      onCancel: () => {},
    });
  };

  const hasVoted = poll.poll_options.some((option) =>
    option.poll_votes.map((v) => v.user.id).includes(user.id),
  );

  return (
    <>
      {poll ? (
        <div className="my-4 border theme-border rounded-md p-4">
          <div className="p-4 -mx-4 -mt-4 mb-4 space-x-4 flex flex-row items-center feed-header-bg rounded-tr-md rounded-tl-md">
            <Avatar
              className="border theme-border"
              src={poll.user.avatar_image_url}
              size={40}
              radius="xl"
            />
            <div className="flex flex-col grow">
              <div className="font-medium theme-text">{poll.user.name}</div>
              <div className="text-sm">
                <TimeAgo datetime={poll.updated_at} />
              </div>
            </div>
            <div className="justify-self-end">
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    aria-label="Post options"
                  >
                    <IconDots size={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconLink size={14} />}
                    onClick={() => {
                      handleCopyLink();
                    }}
                  >
                    {clipboard.copied ? "Copied to clipboard!" : "Copy link"}
                  </Menu.Item>

                  {user.id === poll.user_id ? (
                    <>
                      {false ? null : (
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={() => {
                            togglePollEdit();
                          }}
                        >
                          Edit poll
                        </Menu.Item>
                      )}

                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => openDeleteModal()}
                      >
                        Delete poll
                      </Menu.Item>
                    </>
                  ) : null}
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
          <div className="mb-2">{poll.content}</div>
          {poll.poll_options.map((option) => (
            <div
              key={option.id}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <div
                className={`col-span-7 col-start-1 px-4 py-2 text-sm flex flex-column justify-between items-center ${
                  option.poll_votes.map((v) => v.user.id).includes(user.id)
                    ? "theme-bg-subtle rounded-lg"
                    : null
                }`}
              >
                <span>{option.text}</span>
                {option.poll_votes.map((v) => v.user.id).includes(user.id) ? (
                  <div className="bg-green-500 rounded-full p-1">
                    <IconCheck size={16} color="white" />
                  </div>
                ) : null}
              </div>
              <div className="col-span-3 justify-center col-start-8 py-0.5">
                {option.poll_votes && option.poll_votes.length > 0 ? (
                  <>
                    <div className="flex -space-x-1 relative z-0 justify-center">
                      <Avatar.Group>
                        {option.poll_votes.map((vote, idx) => (
                          <div key={vote.id}>
                            {idx < 3 ? (
                              <Avatar
                                className="border theme-border"
                                key={vote.id}
                                src={vote.user.avatar_image_url}
                                size="md"
                                radius="xl"
                              />
                            ) : (
                              <Avatar
                                radius="xl"
                                size="md"
                                className="relative z-50 border theme-border"
                              >
                                +{option.poll_votes.length - 3}
                              </Avatar>
                            )}
                          </div>
                        ))}
                      </Avatar.Group>
                    </div>

                    <div className="text-xs w-full text-center">
                      {pluralize("vote", option.poll_votes.length, true)}
                    </div>
                  </>
                ) : null}
              </div>
              <div className="col-span-2 col-start-11 flex justify-end">
                {option.poll_votes.map((v) => v.user.id).includes(user.id) ? (
                  <div
                    className="p-1 rounded-full border theme-border flex justify-center items center hover:shadow hover:cursor-pointer"
                    onClick={() => handleRemoveVote(option)}
                  >
                    <IconX size={16} />
                  </div>
                ) : (
                  <>
                    {hasVoted ? null : (
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
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};
