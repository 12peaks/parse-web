import { FeedPost } from "@/app/_components/feed/FeedPost";
import { Loader } from "@mantine/core";
import CreatePostWidget from "./CreatePostWidget";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/posts";
import { getCurrentUser } from "@/api/users";

type FeedProps = {
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
};

export const Feed: React.FC<FeedProps> = ({ groupId, teamId, homeFeed }) => {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", groupId, teamId, homeFeed],
    queryFn: getPosts,
  });

  return (
    <>
      <main>
        <div className="mx-auto">
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
