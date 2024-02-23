/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionIcon, Menu, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import TimeAgo from "timeago-react";
import Linkify from "react-linkify";
import { IconEdit, IconTrash, IconDots } from "@tabler/icons-react";
import { deleteComment } from "@/api/comments";
import { CommentComposer } from "@/app/_components/comments/CommentComposer";
import type { CurrentUser } from "@/types/user";
import type { FeedPost } from "@/types/post";
import type { Comment } from "@/types/comment";

type CommentDisplayProps = {
  user: CurrentUser;
  comment: Comment;
  post: FeedPost;
  groupId: string | null;
  homeFeed: boolean;
  profileId: string | null;
};

export function CommentDisplay({
  post,
  comment,
  user,
  groupId,
  homeFeed,
  profileId,
}: CommentDisplayProps) {
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();
  const modals = useModals();

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed", post.group_id, post.group_id ? false : true],
      });
    },
  });

  const handleCommentDelete = async (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  const toggleCommentEdit = () => {
    setEditing(!editing);
  };

  const openDeleteModal = (commentId: string) =>
    modals.openConfirmModal({
      title: "Delete this comment",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this comment?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancelled"),
      onConfirm: () => handleCommentDelete(commentId),
    });

  return (
    <div key={comment.id} className="text-sm mb-4 flex flex-row">
      <div className="mr-2 min-w-[32px]">
        <img
          className="inline-block h-8 w-8 rounded-full bg-white"
          src={comment.user.avatar_image_url}
          alt="profile"
        />
      </div>
      {editing ? (
        <div className="flex-grow">
          <CommentComposer
            post={post}
            user={user}
            toggleCommentEdit={toggleCommentEdit}
            comment={comment}
            groupId={groupId}
            homeFeed={homeFeed}
            profileId={profileId}
          />
        </div>
      ) : (
        <>
          <div
            className="px-4 py-2 rounded-lg theme-bg-subtle inline-block"
            style={{ wordBreak: "break-word" }}
          >
            <div className="font-medium">
              <span className="mr-4 theme-text">{comment.user.name}</span>
              <span>
                {comment.created_at === comment.updated_at ? (
                  <TimeAgo
                    className="theme-text-subtle ml-1 font-normal"
                    datetime={comment.updated_at}
                  />
                ) : (
                  <span className="theme-text-subtle font-normal ml-1">
                    edited:
                    <TimeAgo
                      className="theme-text-subtle ml-1 font-normal"
                      datetime={comment.updated_at}
                    />
                  </span>
                )}
              </span>
            </div>
            <div className="mt-1">
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <a
                    className="text-blue-500 font-semibold"
                    target="blank"
                    href={decoratedHref}
                    key={key}
                  >
                    {decoratedText}
                  </a>
                )}
              >
                {comment.content}
              </Linkify>
            </div>
          </div>
        </>
      )}

      {user.id === comment.user_id ? (
        <div>
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
              {editing ? (
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => {
                    toggleCommentEdit();
                  }}
                >
                  Cancel
                </Menu.Item>
              ) : (
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => {
                    toggleCommentEdit();
                  }}
                >
                  Edit comment
                </Menu.Item>
              )}

              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={() => openDeleteModal(comment.id)}
              >
                Delete comment
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ) : null}
    </div>
  );
}
