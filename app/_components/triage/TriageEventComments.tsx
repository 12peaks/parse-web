import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button, Textarea } from "@mantine/core";
import TimeAgo from "timeago-react";
import {
  createTriageEventComment,
  deleteTriageEventComment,
} from "@/api/triageEventComments";
import type { TriageEventComment } from "@/types/triageEvent";
import type { CurrentUser } from "@/types/user";

type TriageEventCommentsProps = {
  eventComments: TriageEventComment[];
  eventId: string;
  avatarUrl: string;
  user: CurrentUser;
};

export const TriageEventComments = ({
  eventComments,
  eventId,
  avatarUrl,
  user,
}: TriageEventCommentsProps) => {
  const [commentText, setCommentText] = useState("");

  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: createTriageEventComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteTriageEventComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });
    },
  });

  const handleAddComment = () => {
    addCommentMutation.mutate({
      text: commentText,
      event_id: eventId,
    });
    setCommentText("");
  };

  const handleCommentDelete = (comment: TriageEventComment) => {
    deleteCommentMutation.mutate({
      comment_id: comment.id,
    });
  };

  return (
    <section aria-labelledby="notes-title">
      <div className="shadow border theme-border sm:rounded-lg sm:overflow-hidden">
        <div className="divide-y theme-divide">
          <div className="px-4 py-5 sm:px-6">
            <h2 id="notes-title" className="text-lg font-medium theme-text">
              Updates
            </h2>
          </div>
          <div className="px-4 py-6 sm:px-6">
            <ul className="space-y-4 !list-none">
              {eventComments.map((comment) => (
                <li key={comment.id}>
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full bg-white"
                        src={comment.user.avatar_url}
                        alt=""
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
                        <span className="text-gray-500 font-medium">
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
              ))}
              {eventComments.length === 0 ? (
                <div className="mx-auto text-center">
                  No comments on this event yet.
                </div>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="px-4 py-6 sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full bg-white mt-1"
                src={avatarUrl}
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <div>
                <Textarea
                  label="Comment"
                  placeholder="Add a comment..."
                  id="comment"
                  name="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.currentTarget.value)}
                  minRows={3}
                />
              </div>
              <div className="mt-3 flex items-center justify-end">
                <Button onClick={() => handleAddComment()}>Add Comment</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
