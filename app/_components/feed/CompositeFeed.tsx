import type { FeedItem } from "@/types/feed";
import type { CurrentUser } from "@/types/user";
import { CreatePostWidget } from "@/app/_components/feed/CreatePostWidget";
import { FeedPost } from "@/app/_components/feed/FeedPost";
import { FeedPoll } from "@/app/_components/polls/FeedPoll";

type CompositeFeedProps = {
  feedItems: FeedItem[];
  user: CurrentUser;
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
  userId: string | null;
};

export const CompositeFeed = ({
  feedItems,
  user,
  userId,
  groupId,
  teamId,
  homeFeed,
}: CompositeFeedProps) => {
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
