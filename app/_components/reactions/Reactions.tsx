import { useState } from "react";
import { Popover } from "@mantine/core";
import EmojiPicker from "./EmojiPicker";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createReaction, deleteReaction } from "@/api/reactions";
import type { DisplayReaction, Reaction } from "@/types/reaction";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type ReactionsProps = {
  user_id: string;
  post_id: string;
  group_id: string | null;
  reactions: Reaction[];
};

export const Reactions = ({
  user_id,
  post_id,
  group_id,
  reactions,
}: ReactionsProps) => {
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();

  const addReactionMutation = useMutation({
    mutationFn: createReaction,
    onSuccess: () => {
      setOpened(false);
      queryClient.invalidateQueries({
        queryKey: ["feed", group_id, group_id ? false : true],
      });
    },
  });

  const deleteReactionMutation = useMutation({
    mutationFn: deleteReaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["home-feed-posts"],
      });
    },
  });

  const handleAddReaction = async (emoji_text: string, emoji_code: string) => {
    addReactionMutation.mutate({
      post_id,
      emoji_text,
      emoji_code,
    });
  };

  const handleReactionDelete = async (reaction_id: string) => {
    deleteReactionMutation.mutate({ reaction_id });
  };

  const handleReactionClick = async (reaction: DisplayReaction) => {
    if (reaction.has_reacted) {
      handleReactionDelete(reaction.id);
    } else {
      handleAddReaction(reaction.emoji_text, reaction.emoji_code);
    }
  };

  const summarizeReactions = (reactions: Reaction[]): DisplayReaction[] => {
    let reactionsToDisplay: DisplayReaction[] = [];

    reactions.forEach((reaction) => {
      let reactionInArray = reactionsToDisplay.find((el) => {
        if (el.emoji_text === reaction.emoji_text) {
          return true;
        }
        return false;
      });
      if (reactionInArray) {
        if (reaction?.user_id === user_id) {
          reactionInArray.has_reacted = true;
          reactionInArray.my_reaction = reaction;
        }
        reactionInArray.count++;
      } else {
        reactionsToDisplay.push({
          id: reaction.id,
          emoji_text: reaction.emoji_text,
          emoji_code: reaction.emoji_code,
          count: 1,
          has_reacted: reaction.user_id === user_id ? true : false,
          my_reaction: reaction.user_id === user_id ? reaction : null,
        });
      }
    });
    return reactionsToDisplay;
  };

  return (
    <>
      <Popover opened={opened} onClose={() => setOpened(false)} position="top">
        <Popover.Target>
          <div
            className="border rounded-full mt-2 theme-border hover:theme-border-dark hover:cursor-pointer py-1 px-3 ml-2 mr-1 text-xs"
            onClick={() => setOpened(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                vectorEffect="non-scaling-stroke"
                d="M13.394 4.63a7.5 7.5 0 106.05 6.45M9 13.5s1.125 1.5 3 1.5 3-1.5 3-1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                vectorEffect="non-scaling-stroke"
                d="M9.75 9.75h.008M14.25 9.75h.008"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                vectorEffect="non-scaling-stroke"
                d="M18.75 3v5.25M16.125 5.625h5.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <EmojiPicker
            onEmojiSelect={(e: any) => handleAddReaction(e.native, e.id)}
          />
        </Popover.Dropdown>
      </Popover>

      {reactions && reactions.length > 0 ? (
        <>
          {summarizeReactions(reactions).map((reaction) => (
            <span
              key={reaction.emoji_text}
              onClick={() => handleReactionClick(reaction)}
              className={classNames(
                reaction.has_reacted
                  ? "border-blue-300 theme-reaction-bg hover:border-blue-400"
                  : "theme-border hover:theme-border-dark",
                "ml-1 mt-2 py-1.5 pl-4 pr-3 text-center text-xs border rounded-full hover:cursor-pointer"
              )}
            >
              <span className="-ml-1">{reaction.emoji_text}</span>{" "}
              <span className="ml-1 font-medium">{reaction.count}</span>
            </span>
          ))}
        </>
      ) : null}
    </>
  );
};
