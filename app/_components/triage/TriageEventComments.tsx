import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Textarea } from "@mantine/core";
import { createTriageEventComment } from "@/api/triageEventComments";
import type { TriageEventComment as TriageEventCommentType } from "@/types/triageEvent";
import type { CurrentUser } from "@/types/user";
import { TriageEventComment } from "./TriageEventComment";

type TriageEventCommentsProps = {
  eventComments: TriageEventCommentType[];
  eventId: string;
  user: CurrentUser;
};

export const TriageEventComments = ({
  eventComments,
  eventId,
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

  const handleAddComment = () => {
    addCommentMutation.mutate({
      text: commentText,
      event_id: eventId,
    });
    setCommentText("");
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
                <TriageEventComment
                  key={comment.id}
                  comment={comment}
                  eventId={eventId}
                  user={user}
                />
              ))}
              {eventComments.length === 0 ? (
                <div className="mx-auto text-center">
                  No comments on this event yet.
                </div>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="px-4 py-4 border-t theme-border sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full bg-white mt-1"
                src={user.avatar_image_url}
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <div>
                <Textarea
                  placeholder="Add a new comment..."
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
