import type { CurrentUser } from "@/types/user";
import { CreatePostWidget } from "@/app/_components/feed/CreatePostWidget";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { getFeedItems, getGroupFeedItems, getUserFeedItems } from "@/api/feed";
import { FeedPost } from "@/app/_components/feed/FeedPost";
import { FeedPoll } from "@/app/_components/polls/FeedPoll";

type CompositeFeedProps = {
  user: CurrentUser;
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
  userId: string | null;
};

export const CompositeFeed = ({
  user,
  userId,
  groupId,
  teamId,
  homeFeed,
}: CompositeFeedProps) => {
  const {
    data: feedItems,
    isLoading: feedIsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["feed", groupId, homeFeed, userId],
    queryFn: (() => {
      switch (true) {
        case homeFeed:
          return getFeedItems;
        case !!groupId:
          return () => getGroupFeedItems(groupId);
        case !!userId:
          return () => getUserFeedItems(userId);
        default:
          return undefined;
      }
    })(),
  });

  if (isError) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }

  if (feedIsLoading || !feedItems) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[680px]">
      <div className="mb-4">
        <CreatePostWidget
          teamId={teamId}
          groupId={groupId ?? null}
          homeFeed={homeFeed}
          user={user}
        />
      </div>
      {feedItems.map((item) => (
        <div key={item.id}>
          {item.type === "post" && (
            <FeedPost
              post={item}
              teamId={teamId}
              groupId={groupId}
              homeFeed={homeFeed}
              profileId={userId}
              user={user}
            />
          )}
          {item.type === "poll" && <FeedPoll poll={item} user={user} />}
        </div>
      ))}
    </section>
  );
};
