/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Feed } from "@/app/_components/feed/Feed";
import { EditProfileButton } from "@/app/_components/profile/EditProfileButton";
import { ProfileSidebar } from "@/app/_components/profile/ProfileSidebar";
import { getCurrentUser } from "@/api/users";
import { followUser, unfollowUser, getTeamUser } from "@/api/teams";
import { Button } from "@mantine/core";
import profilePlaceholderImage from "@/public/sunglasses.png";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { data: profile, isLoading: profileIsLoading } = useQuery({
    queryKey: ["profile", params.id],
    queryFn: () => getTeamUser(params.id),
    enabled: !!params.id,
  });

  const headerPlaceholder =
    "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80";
  const profilePlaceholder = profilePlaceholderImage;

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", params.id],
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", params.id],
      });
    },
  });

  const handleFollowProfile = async () => {
    if (profile) {
      followMutation.mutate(profile.id);
    }
  };

  const handleUnfollowProfile = async () => {
    if (profile) {
      unfollowMutation.mutate(profile.id);
    }
  };

  if (userIsLoading || profileIsLoading) {
    return null;
  }

  return (
    <>
      {profile && user ? (
        <>
          <div>
            <div>
              <img
                className="h-32 w-full object-cover lg:h-48"
                src={headerPlaceholder}
                alt="header"
              />
            </div>
            <div className="mx-auto">
              <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                <div className="flex px-2 sm:px-6 lg:px-8 mb-4">
                  <img
                    className="h-24 w-24 bg-white rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                    src={
                      profile.avatar_url
                        ? profile.avatar_url
                        : profilePlaceholder.src
                    }
                    alt="profile"
                  />
                  <div className="hidden sm:inline-block mt-4 min-w-0 px-2 lg:px-4 self-end">
                    <div className="text-2xl font-bold truncate theme-text">
                      {profile?.name}
                    </div>
                  </div>
                  <div className="sm:hidden mt-6 min-w-0 flex-1 px-4 sm:px-6 lg:px-8 mb-2">
                    <div className="text-2xl font-bold theme-text">
                      {profile.name}
                    </div>
                  </div>
                </div>
                <div className="sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="mt-4 sm:mt-0 sm:mb-4 sm:px-0 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    {user.id === profile.id ? (
                      <EditProfileButton profile={profile} />
                    ) : null}
                    {user.id !== profile.id ? (
                      <Button
                        type="button"
                        onClick={() => handleFollowProfile()}
                      >
                        <span>Follow</span>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:inline-block overflow-x-hidden min-w-[320px] max-w-[380px] xl:max-w-[360px] sticky flex-shrink-0 top-20 float-right w-auto h-auto">
            <div
              id="home-sidebar-container"
              className="overflow-y-auto overflow-x-hidden pr-4 -mr-4 pt-4"
            >
              <ProfileSidebar profile={profile} />
            </div>
          </div>
          {profile && profile.id ? (
            <div className="grid grid-cols-12 gap-4 relative lg:pr-4">
              <div className="col-span-12 pt-4 xl:col-span-10 lg:col-start-1 2xl:col-span-8 xl:col-start-2 2xl:col-start-4">
                <Feed
                  userId={profile.id}
                  teamId={""}
                  homeFeed={false}
                  groupId={null}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}
