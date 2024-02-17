/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroupBySlug, joinGroup, leaveGroup } from "@/api/groups";
import { getCurrentUser } from "@/api/users";
import { Feed } from "@/app/_components/feed/Feed";
import { Authenticated } from "@/app/_components/auth/Authenticated";
import { AddTeammatesModal } from "@/app/_components/groups/AddTeammatesModal";
import { EditGroupButton } from "@/app/_components/groups/EditGroupButton";
import { Button, Loader, Text, Popover, useMantineTheme } from "@mantine/core";
import TimeAgo from "timeago-react";
import pluralize from "pluralize";
import {
  IconInfoCircle,
  IconEye,
  IconEyeOff,
  IconWorld,
  IconLock,
} from "@tabler/icons-react";
import groupPlaceholder from "@/public/speech_balloon.png";
import { useModals } from "@mantine/modals";
import { Group } from "@/types/group";

const tabs = [
  { name: "Discussion", alias: "discussion" },
  { name: "Files", alias: "files" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function GroupPage() {
  const params = useParams<{ slug: string }>();
  const [privacyOpened, setPrivacyOpened] = useState(false);
  const [visibilityOpened, setVisibilityOpened] = useState(false);
  const headerPlaceholder =
    "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80";

  const modals = useModals();

  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const queryClient = useQueryClient();
  const { data: group, isLoading } = useQuery({
    queryKey: ["group", params.slug],
    queryFn: () => getGroupBySlug(params.slug),
    enabled: !!params.slug,
  });

  const groupId = group?.id;

  const joinGroupMutation = useMutation({
    mutationFn: joinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", params.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groups-joined"],
      });
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", params.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groups-joined"],
      });
    },
  });

  const handleJoinGroup = async () => {
    if (groupId) {
      joinGroupMutation.mutate(groupId);
    }
  };

  const handleLeaveGroup = async () => {
    if (groupId) {
      leaveGroupMutation.mutate(groupId);
    }
  };

  const openAddTeammatesModal = (group: Group) => {
    modals.openModal({
      title: "Manage group members",
      size: "lg",
      children: <AddTeammatesModal group={group} />,
    });
  };

  return (
    <Authenticated>
      {!group || !user || isLoading ? (
        <Loader className="mx-auto mt-48" size="xl" />
      ) : (
        <>
          <div>
            <div>
              <img
                className="h-32 w-full object-cover lg:h-48"
                src={
                  group?.cover_image_url
                    ? group.cover_image_url
                    : headerPlaceholder
                }
                alt="header"
              />
            </div>
            <div className="mx-auto">
              <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                <div className="flex justify-between px-4 sm:px-6 lg:px-8">
                  <div className="h-24 w-24 ring-4 ring-gray-200 sm:h-32 sm:w-32 flex items-center justify-center rounded-full bg-white">
                    <img
                      className="h-16 w-16 sm:h-20 sm:w-20 bg-white"
                      src={
                        group.avatar_url
                          ? group.avatar_url
                          : groupPlaceholder.src
                      }
                      alt="group"
                    />
                  </div>
                </div>
                <div className="sm:mt-4 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="sm:hidden 2xl:block mt-4 sm:mt-6 min-w-0 flex-1 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold">{group.name}</h1>
                  </div>
                  <div className="mt-4 sm:mt-6 px-4 sm:px-0 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    {group.users.find(
                      (group_user) => group_user.id === user.id
                    ) ? (
                      <Button
                        radius="md"
                        variant="light"
                        color="red"
                        onClick={() => handleLeaveGroup()}
                      >
                        <span>Leave group</span>
                      </Button>
                    ) : (
                      <Button radius="md" onClick={() => handleJoinGroup()}>
                        <span>Join group</span>
                      </Button>
                    )}
                    {group ? <EditGroupButton group={group} /> : null}
                  </div>
                </div>
              </div>
              <div className="hidden sm:block 2xl:hidden mt-4 min-w-0 flex-1 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold truncate">{group.name}</h1>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="hidden lg:inline-block overflow-x-hidden max-w-[280px] xl:max-w-[360px] xl:min-w-[280px] sticky flex-shrink-0 top-20 float-right w-auto h-auto">
              <div
                id="home-sidebar-container"
                className="overflow-y-auto overflow-x-hidden pr-4 -mr-4 pt-4"
              >
                <div className="p-4 rounded shadow border theme-border">
                  <div className="font-medium flex flex-row justify-between items-center">
                    <div>About</div>
                    <Button
                      variant="subtle"
                      size="compact-sm"
                      onClick={() => openAddTeammatesModal(group)}
                    >
                      Manage members
                    </Button>
                  </div>
                  <div className="mt-4 text-sm theme-text-subtle">
                    {group.description}
                  </div>
                  <div className="flex flex-column items-center text-sm mt-4">
                    {group.is_private ? (
                      <>
                        <IconLock className="h-5 w-5 mr-2 theme-text-subtle" />{" "}
                        <span className="mr-1">Private</span>
                        <Popover
                          opened={privacyOpened}
                          onClose={() => setPrivacyOpened(false)}
                          position="top"
                          withArrow
                          trapFocus={false}
                          closeOnEscape={false}
                          width={260}
                        >
                          <Popover.Target>
                            <IconInfoCircle
                              size={16}
                              onMouseEnter={() => setPrivacyOpened(true)}
                              onMouseLeave={() => setPrivacyOpened(false)}
                            />
                          </Popover.Target>
                          <Popover.Dropdown>
                            <div style={{ display: "flex" }}>
                              <Text size="sm">
                                Only members can see who is in the group and
                                what they post.
                              </Text>
                            </div>
                          </Popover.Dropdown>
                        </Popover>
                      </>
                    ) : (
                      <>
                        <IconWorld className="h-5 w-5 mr-2 theme-text-subtle" />{" "}
                        <span className="mr-1">Public</span>
                        <Popover
                          opened={privacyOpened}
                          onClose={() => setPrivacyOpened(false)}
                          position="top"
                          withArrow
                          trapFocus={false}
                          closeOnEscape={false}
                          width={260}
                        >
                          <Popover.Target>
                            <IconInfoCircle
                              size={16}
                              onMouseEnter={() => setPrivacyOpened(true)}
                              onMouseLeave={() => setPrivacyOpened(false)}
                            />
                          </Popover.Target>
                          <Popover.Dropdown>
                            <div style={{ display: "flex" }}>
                              <Text size="sm">
                                Anyone on your team can see who is in the group
                                and what they post.
                              </Text>
                            </div>
                          </Popover.Dropdown>
                        </Popover>
                      </>
                    )}
                  </div>
                  <div className="flex flex-column items-center text-sm mt-2">
                    {group.is_visible ? (
                      <>
                        <IconEye className="h-5 w-5 mr-2 theme-text-subtle" />{" "}
                        <span className="mr-1">Visible</span>
                        <Popover
                          opened={visibilityOpened}
                          onClose={() => setVisibilityOpened(false)}
                          position="top"
                          withArrow
                          trapFocus={false}
                          closeOnEscape={false}
                          width={260}
                        >
                          <Popover.Target>
                            <IconInfoCircle
                              size={16}
                              onMouseEnter={() => setVisibilityOpened(true)}
                              onMouseLeave={() => setVisibilityOpened(false)}
                            />
                          </Popover.Target>
                          <Popover.Dropdown>
                            <div style={{ display: "flex" }}>
                              <Text size="sm">
                                Anyone on your team can find this group.
                              </Text>
                            </div>
                          </Popover.Dropdown>
                        </Popover>
                      </>
                    ) : (
                      <>
                        <IconEyeOff className="h-5 w-5 mr-2 theme-text-subtle" />{" "}
                        <span className="mr-1">Not visible</span>
                        <Popover
                          opened={visibilityOpened}
                          onClose={() => setVisibilityOpened(false)}
                          position="top"
                          withArrow
                          trapFocus={false}
                          closeOnEscape={false}
                          width={260}
                        >
                          <Popover.Target>
                            <IconInfoCircle
                              size={16}
                              onMouseEnter={() => setVisibilityOpened(true)}
                              onMouseLeave={() => setVisibilityOpened(false)}
                            />
                          </Popover.Target>
                          <Popover.Dropdown>
                            <div style={{ display: "flex" }}>
                              <Text size="sm">
                                Only members can find this group.
                              </Text>
                            </div>
                          </Popover.Dropdown>
                        </Popover>
                      </>
                    )}
                  </div>

                  <div className="mt-4 text-sm theme-text-subtle">
                    Created <TimeAgo datetime={group.created_at} />
                  </div>

                  <div className="text-sm theme-text-subtle mt-4">
                    {pluralize("member", group.users.length, true)}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 relative lg:pr-4">
              <div className="col-span-12 pt-4 xl:col-span-10 lg:col-start-1 2xl:col-span-8 xl:col-start-2 2xl:col-start-4">
                <Feed
                  userId={null}
                  groupId={group.id}
                  teamId={group.team_id}
                  homeFeed={false}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Authenticated>
  );
}
