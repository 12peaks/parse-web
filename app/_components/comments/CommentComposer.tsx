import { useState, useEffect } from "react";
import { Avatar, ActionIcon } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MentionsInput, Mention } from "react-mentions";
import { createComment, editComment } from "@/api/comments";
import type { Comment } from "@/types/comment";
import type { CurrentUser } from "@/types/user";
import type { FeedPost } from "@/types/post";
import { getTeamUsers } from "@/api/teams";
import placeholderAvatar from "@/public/sunglasses.png";

type CommentComposerProps = {
  post: FeedPost;
  user: CurrentUser;
  toggleCommentEdit?: () => void;
  comment?: Comment;
};

type MentionUserDTO = {
  id: string;
  display: string;
  avatar: string;
  uid: string;
};

export function CommentComposer({
  post,
  toggleCommentEdit,
  comment,
  user,
}: CommentComposerProps) {
  const [commentContent, setCommentContent] = useState(
    comment ? comment.content : ""
  );
  const [commentMentions, setCommentMentions] = useState<string[]>([]);
  const [userList, setUserList] = useState<MentionUserDTO[]>([]);

  const queryClient = useQueryClient();

  const teamQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: getTeamUsers,
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (data) => {
      setCommentContent("");
      queryClient.invalidateQueries({
        queryKey: ["feed", post.group_id, post.group_id ? false : true],
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: editComment,
    onSuccess: async (data: Comment) => {
      setCommentContent("");
      toggleCommentEdit && toggleCommentEdit();
      queryClient.invalidateQueries({
        queryKey: ["feed", post.group_id, post.group_id ? false : true],
      });
    },
  });

  const postComment = async () => {
    if (commentContent.length > 0) {
      createCommentMutation.mutate({
        commentContent: commentContent,
        postId: post.id,
      });
    }
  };

  const handleCommentUpdate = async () => {
    if (comment) {
      updateCommentMutation.mutate({
        commentContent: commentContent,
        commentId: comment.id,
      });
    }
  };

  const handleSubmit = () => {
    comment ? handleCommentUpdate() : postComment();
  };

  const handleKeyPress = (e: any) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.altKey &&
      !e.ctrlKey &&
      document.activeElement ===
        document.getElementById(`comment-composer-field-${post.id}`)
    ) {
      const suggestionsList = document.getElementsByClassName(
        "mentions-input__suggestions"
      );
      if (!suggestionsList || suggestionsList.length === 0) {
        e.preventDefault();
        handleSubmit();
        e.target.blur();
      }
    }
  };

  const handleMentionsChange = (
    event: any,
    newValue: any,
    newPlainTextValue: any,
    mentions: any
  ) => {
    setCommentContent(newPlainTextValue);
  };

  useEffect(() => {
    let isMounted = true;
    if (teamQuery.data && teamQuery.data.length > 0) {
      let mentionUsers: MentionUserDTO[] = [];
      for (const teamUser of teamQuery.data) {
        let mentionUser = {
          id: teamUser.id,
          display: teamUser.name ?? teamUser.email,
          avatar: teamUser.avatar_url ?? placeholderAvatar.src,
          uid: teamUser.id,
        };
        mentionUsers.push(mentionUser);
      }
      if (isMounted) {
        setUserList(mentionUsers);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [teamQuery.data]);

  return (
    <div className="w-full flex flex-row">
      {!comment && (
        <Avatar
          src={user.avatar_url}
          alt="profile image"
          radius="xl"
          size={32}
          className="mr-2"
        />
      )}
      <MentionsInput
        id={`comment-composer-field-${post.id}`}
        className="mentions-input w-full text-sm"
        placeholder="Leave a comment..."
        value={commentContent}
        onKeyUp={handleKeyPress}
        onChange={handleMentionsChange}
      >
        <Mention
          trigger="@"
          data={userList}
          appendSpaceOnAdd={true}
          onAdd={(id, _) =>
            setCommentMentions([...commentMentions, id as string])
          }
          displayTransform={(_, display) => `@${display}`}
        />
      </MentionsInput>

      <ActionIcon
        onClick={() => handleSubmit()}
        className="ml-2"
        size={32}
        color="blue"
        variant="filled"
        radius="xl"
      >
        <IconArrowUp size={18} />
      </ActionIcon>
    </div>
  );
}
