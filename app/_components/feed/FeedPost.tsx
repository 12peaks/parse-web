/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import { Link as RTELink, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { CommentComposer } from "@/app/_components/comments/CommentComposer";
import { CommentsDisplay } from "@/app/_components/comments/CommentsDisplay";
import { Reactions } from "@/app/_components/reactions/Reactions";
import TimeAgo from "timeago-react";
import { Menu, Button, Text, ActionIcon, Avatar } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconEdit,
  IconTrash,
  IconLink,
  IconPinned,
  IconDots,
  IconMessage2,
} from "@tabler/icons-react";
import { useModals } from "@mantine/modals";
import Link from "next/link";
import { useClipboard } from "@mantine/hooks";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import ts from "highlight.js/lib/languages/typescript";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updatePost, deletePost } from "@/api/posts";
import { FeedPost as FeedPostType } from "@/types/post";
import { CurrentUser } from "@/types/user";

const lowlight = createLowlight();
lowlight.register({ ts });

type FeedPostProps = {
  post: FeedPostType;
  teamId: string;
  groupId: string | null;
  homeFeed: boolean;
  profileId: string | null;
  user: CurrentUser;
};

export const FeedPost = ({
  post,
  teamId,
  groupId,
  homeFeed,
  profileId,
  user,
  ...props
}: FeedPostProps) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post?.content);
  const [loading, setLoading] = useState(false);
  const [postContentHidden, setPostContentHidden] = useState(false);

  const clipboard = useClipboard();
  const queryClient = useQueryClient();

  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["posts", groupId, teamId, homeFeed],
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
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["posts", groupId, teamId, homeFeed],
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      RTELink,
      TextAlign,
      Highlight,
      Superscript,
      Subscript,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: post.content,
  });

  const modals = useModals();

  const handleCommentFocus = () => {
    document.getElementById(`comment-composer-field-${post.id}`)?.focus();
  };

  const togglePostEdit = () => {
    setEditing(!editing);
  };

  const handleImageUpload = useCallback(async (file: File) => {
    // TODO: Replace with file upload

    return "https://via.placeholder.com/150";
  }, []);

  const handlePostUpdate = async () => {
    if (user) {
      updatePostMutation.mutate({
        id: post.id,
        user_id: user.id,
        content: content || "",
      });
    }
  };

  const handlePostDelete = async () => {
    deletePostMutation.mutate(post.id);
  };

  const handleCopyLink = () => {
    const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/?post_id=${post.id}`;
    clipboard.copy(url);
    showNotification({
      title: "Link copied",
      message: "Post link copied to clipboard.",
      color: "green",
      autoClose: 3000,
    });
  };

  const handlePinPost = async () => {
    if (user) {
      updatePostMutation.mutate({
        id: post.id,
        is_pinned: true,
        user_id: user.id,
      });
    }
  };

  const handleUnpinPost = async () => {
    if (user) {
      updatePostMutation.mutate({
        id: post.id,
        is_pinned: false,
        user_id: user.id,
      });
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Delete this post",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this post?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => modals.closeModal("confirm-modal"),
      onConfirm: () => handlePostDelete(),
    });

  return (
    <>
      {post && post.user && user ? (
        <div id={post.id.toString()}>
          <div className="mb-2 px-4 pt-4 shadow border theme-border rounded">
            <div className="text-start font-medium flex items-center justify-between feed-header-bg -mx-4 -mt-4 p-4 rounded-tr-md rounded-tl-md">
              <div className="flex items-center">
                <Link href={`/team/${post.user_id}`}>
                  <Avatar
                    className="border theme-border"
                    src={post.user.avatar_image_url}
                    size={40}
                    variant="default"
                    radius="xl"
                  />
                </Link>

                <div className="ml-4">
                  <div className="font-medium theme-text">
                    <Link href={`/team/${post.user_id}`}>{post.user.name}</Link>
                    {post.group ? (
                      <span className="text-blue-600 text-sm ml-2">
                        <Link href={`/groups/${post.group.url_slug}`}>
                          {`#${post.group.name}`}
                        </Link>
                      </span>
                    ) : null}
                    {post.is_pinned ? (
                      <span className="ml-1 text-sm">📌</span>
                    ) : null}
                  </div>
                  <div className="theme-text-subtle text-sm font-normal">
                    {" "}
                    <TimeAgo datetime={post.updated_at} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center">
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
                        {clipboard.copied
                          ? "Copied to clipboard!"
                          : "Copy link"}
                      </Menu.Item>

                      {groupId && user.id === post.user_id ? (
                        <>
                          {post.is_pinned ? (
                            <Menu.Item
                              color="red"
                              leftSection={<IconPinned size={14} />}
                              onClick={() => handleUnpinPost()}
                            >
                              Unpin post
                            </Menu.Item>
                          ) : (
                            <Menu.Item
                              leftSection={<IconPinned size={14} />}
                              onClick={() => handlePinPost()}
                            >
                              Pin post
                            </Menu.Item>
                          )}
                        </>
                      ) : null}
                      {user.id === post.user_id ? (
                        <>
                          {postContentHidden ? null : (
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => {
                                togglePostEdit();
                              }}
                            >
                              Edit post
                            </Menu.Item>
                          )}

                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => openDeleteModal()}
                          >
                            Delete post
                          </Menu.Item>
                        </>
                      ) : null}
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </div>
            </div>
            {post ? (
              <>
                <RichTextEditor
                  editor={editor}
                  className={
                    editing ? "mt-2" : "!border-0 -mx-4 mb-2 break-words"
                  }
                  styles={{
                    toolbar: {
                      borderBottom: editing ? "" : "none !important",
                      display: editing ? "" : "none",
                    },
                  }}
                  style={{ listStyleType: "disc" }}
                >
                  <RichTextEditor.Toolbar>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Highlight />
                      <RichTextEditor.CodeBlock />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                      <RichTextEditor.Superscript />
                      <RichTextEditor.Subscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.AlignLeft />
                      <RichTextEditor.AlignCenter />
                      <RichTextEditor.AlignJustify />
                      <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Undo />
                      <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>
                  <RichTextEditor.Content />
                </RichTextEditor>
                {editing ? (
                  <div className="bottom-row my-4 grid grid-cols-2 gap-4">
                    <Button
                      color="gray"
                      variant="light"
                      className="col-span-1"
                      onClick={() => togglePostEdit()}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="col-span-1"
                      disabled={loading}
                      onClick={() => handlePostUpdate()}
                    >
                      Save
                    </Button>
                  </div>
                ) : null}
                <>
                  <div className="text-sm theme-text flex flex-column flex-wrap items-center">
                    <div
                      className="border rounded-full mt-2 theme-border hover:theme-border-dark hover:cursor-pointer py-1.5 px-4 text-xs items-center flex flex-column"
                      onClick={() => handleCommentFocus()}
                    >
                      <IconMessage2 size={16} className="mr-2 theme-text" />{" "}
                      <span className="theme-text">Comment</span>
                    </div>

                    <Reactions
                      homeFeed={homeFeed}
                      postId={post.id}
                      profileId={profileId}
                      groupId={post.group_id}
                      user={user}
                      reactions={post.reactions}
                    />
                  </div>
                  <div className="my-4">
                    <CommentsDisplay
                      post={post}
                      user={user}
                      groupId={groupId}
                      homeFeed={homeFeed}
                      profileId={profileId}
                    />

                    <CommentComposer
                      user={user}
                      post={post}
                      homeFeed={homeFeed}
                      groupId={groupId}
                      profileId={profileId}
                    />
                  </div>
                </>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};
