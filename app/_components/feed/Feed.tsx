import { FeedPost } from "@/app/_components/feed/FeedPost";
import { CreatePostWidget } from "./CreatePostWidget";
import { useQuery } from "@tanstack/react-query";
import { getPosts, getGroupPosts, getUserPosts } from "@/api/posts";
import { getCurrentUser } from "@/api/users";

type FeedProps = {
  userId: string | null;
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
};

export const Feed = ({ groupId, teamId, homeFeed, userId }: FeedProps) => {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["feed", groupId, homeFeed, userId],
    queryFn: (() => {
      switch (true) {
        case homeFeed:
          return getPosts;
        case !!groupId:
          return () => getGroupPosts(groupId);
        case !!userId:
          return () => getUserPosts(userId);
        default:
          return undefined;
      }
    })(),
  });

  return (
    <>
      <main>
        <div className="mx-auto max-w-[800px]">
          {postsLoading || userLoading || !user ? null : (
            <>
              <div className="mb-4">
                <CreatePostWidget
                  teamId={teamId}
                  groupId={groupId ?? null}
                  homeFeed={homeFeed}
                  user={user}
                />
              </div>

              {/* {homeFeed ? <FeedGoals /> : null} */}

              {user && posts && posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <FeedPost
                      key={post.id}
                      post={post}
                      teamId={teamId}
                      groupId={post.group_id}
                      homeFeed={homeFeed}
                      profileId={userId}
                      user={user}
                    />
                  ))}
                </>
              ) : null}
            </>
          )}
        </div>
      </main>
    </>
  );
};
