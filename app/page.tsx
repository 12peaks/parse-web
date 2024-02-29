"use client";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/users";
import { getFeedItems } from "@/api/feed";
import { Loader } from "@mantine/core";
import { CompositeFeed } from "./_components/feed/CompositeFeed";

export default function Home() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const {
    data: feedItems,
    isLoading: feedItemsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["feedItems"],
    queryFn: getFeedItems,
  });

  if (isError) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }

  if (isLoading || !user || feedItemsLoading || !feedItems) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Loader type="dots" size={48} color="blue" />
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="relative">
        <div className="hidden lg:inline-block overflow-x-hidden lg:min-w-[280px] max-w-[280px] xl:max-w-[360px] xl:min-w-[280px] sticky flex-shrink-0 top-20 float-right w-auto h-auto">
          <div
            id="home-sidebar-container"
            className="overflow-y-auto overflow-x-hidden pr-4 -mr-4"
          >
            <div className=" min-w-[280px] rounded px-4 mb-4 pb-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 relative lg:pr-4">
          <div className="col-span-12 xl:col-span-10 lg:col-start-1 2xl:col-span-8 xl:col-start-2 2xl:col-start-4">
            {user && (
              <CompositeFeed
                feedItems={feedItems}
                user={user}
                homeFeed={true}
                teamId={user?.current_team.id}
                groupId={null}
                userId={null}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
