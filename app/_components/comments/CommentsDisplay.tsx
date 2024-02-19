import { CommentDisplay } from "@/app/_components/comments/CommentDisplay";
import { useQuery } from "@tanstack/react-query";
import type { FeedPost } from "@/types/post";
import type { CurrentUser } from "@/types/user";

export function CommentsDisplay({
  post,
  user,
  groupId,
  homeFeed,
  profileId,
}: {
  post: FeedPost;
  user: CurrentUser;
  groupId: string | null;
  homeFeed: boolean;
  profileId: string | null;
}) {
  return (
    <div className="mb-4">
      {post.comments &&
        post.comments.map((comment) => (
          <CommentDisplay
            key={comment.id}
            post={post}
            comment={comment}
            user={user}
            groupId={post.group_id}
            homeFeed={post.group_id ? false : true}
            profileId={post.user_id}
          />
        ))}
    </div>
  );
}
