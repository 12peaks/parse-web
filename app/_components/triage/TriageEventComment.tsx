import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TimeAgo from "timeago-react";
import { Avatar, Button } from "@mantine/core";
import { deleteTriageEventComment } from "@/api/triageEventComments";
import type { TriageEventComment as TriageEventCommentType } from "@/types/triageEvent";
import type { CurrentUser } from "@/types/user";

type TriageEventCommentProps = {
  comment: TriageEventCommentType;
  eventId: string;
  user: CurrentUser;
};

export const TriageEventComment = ({
  comment,
  eventId,
  user,
}: TriageEventCommentProps) => {
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: deleteTriageEventComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });
    },
  });
  const handleCommentDelete = (comment: TriageEventCommentType) => {
    deleteCommentMutation.mutate({
      comment_id: comment.id,
    });
  };

  return (
    <li>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Avatar
            className="bg-white border theme-border"
            size="md"
            src={comment.user.avatar_image_url}
            alt="user avatar"
          />
        </div>
        <div>
          <div className="text-sm flex flex-column items-center">
            <Link
              href={`/team/${comment.user.id}`}
              className="font-medium theme-text"
            >
              {comment.user.name}
            </Link>
          </div>
          <div className="mt-1 text-sm theme-text-subtle">
            <p>{comment.text}</p>
          </div>
          <div className="mt-2 text-sm space-x-2">
            <span className="theme-text-subtle font-medium">
              <TimeAgo datetime={comment.created_at} />
            </span>
            {comment.user.id === user?.id ? (
              <Button
                variant="subtle"
                size="compact-xs"
                color="red"
                onClick={() => handleCommentDelete(comment)}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
};
