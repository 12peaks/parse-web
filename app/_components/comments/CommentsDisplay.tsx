import { CommentDisplay } from "@/app/_components/comments/CommentDisplay";
import { useQuery } from "@tanstack/react-query";
import type { FeedPost } from "@/types/post";
import type { CurrentUser } from "@/types/user";

export function CommentsDisplay({
  post,
  user,
}: {
  post: FeedPost;
  user: CurrentUser;
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
          />
        ))}
    </div>
  );
}
