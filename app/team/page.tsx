/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Loader, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import type { TeamUser } from "@/types/user";
import {
  getTeamUsers,
  getPendingUsers,
  followUser,
  unfollowUser,
} from "@/api/teams";
import { getCurrentUser } from "@/api/users";
import { InviteUsers } from "@/app/_components/team/InviteUsers";
import { PendingUsersTable } from "@/app/_components/team/PendingUsersTable";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500);

  const modals = useModals();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { data: teamMembers, isLoading } = useQuery<TeamUser[]>({
    queryKey: ["team", debouncedSearchTerm],
    queryFn: () => getTeamUsers(),
  });

  const pendingUserQuery = useQuery({
    queryKey: ["pending-users"],
    queryFn: () => getPendingUsers(),
    enabled: !!user,
  });

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["team", debouncedSearchTerm],
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["team", debouncedSearchTerm],
      });
    },
  });

  const handleFollowUser = async (user_id: string) => {
    if (user) {
      followMutation.mutate(user_id);
    }
  };

  const handleUnfollowUser = async (user_id: string) => {
    if (user) {
      unfollowMutation.mutate(user_id);
    }
  };

  const userStatus = (user: TeamUser) => {
    if (user.invitation_created_at && user.last_sign_in_at === null) {
      return "Pending";
    } else if (user.last_sign_in_at) {
      return "Active";
    } else {
      return "Inactive";
    }
  };

  const openInviteModal = async () => {
    modals.openModal({
      title: "Invite to team",
      size: "lg",
      children: <InviteUsers />,
    });
  };

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="flex flex-row justify-between items-center">
            <div className="text-xl font-semibold theme-text">Team</div>
            <div className="sm:hidden">
              <Button
                className="self-end sm:hidden"
                size="sm"
                onClick={() => openInviteModal()}
              >
                Add team members
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm theme-text-subtle">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
          <TextInput
            radius="xl"
            className="mt-4 max-w-[400px]"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none self-end pb-1 hidden sm:inline-block">
          <Button
            className="self-end"
            size="sm"
            onClick={() => openInviteModal()}
          >
            Add team members
          </Button>
        </div>
      </div>
      {isLoading ? null : (
        <div className="mt-2 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow border theme-border md:rounded-lg">
                <table className="min-w-full divide-y theme-divide">
                  <thead className="theme-bg-subtle theme-text">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold"
                      >
                        Account status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y theme-divide">
                    {teamMembers && teamMembers.length > 0
                      ? teamMembers.map((member) => (
                          <tr key={member.id} className="hover:theme-bg-subtle">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <Link href={`/team/${member.id}`}>
                                    <Avatar
                                      className={
                                        member.avatar_image_url
                                          ? "bg-white border theme-border"
                                          : "border theme-border"
                                      }
                                      radius="xl"
                                      size={42}
                                      variant="white"
                                      src={member.avatar_image_url}
                                      alt="avatar"
                                    />
                                  </Link>
                                </div>
                                <div className="ml-4">
                                  <Link href={`/team/${member.id}`}>
                                    <div className="font-medium hover:cursor-pointer theme-text">
                                      {member.name}
                                    </div>
                                    {member.name ? (
                                      <div className="theme-text-subtle hover:cursor-pointer">
                                        {"@"}
                                        {member.name}
                                      </div>
                                    ) : null}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm theme-text-subtle">
                              <div className="theme-text-subtle">
                                {member.email}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span
                                className={classNames(
                                  userStatus(member) === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800",
                                  "inline-flex capitalize rounded-full px-2 text-xs font-semibold leading-5"
                                )}
                              >
                                {userStatus(member)}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm theme-text-subtle text-center">
                              {user && member.id !== user.id ? (
                                <>
                                  {1 === 1 ? (
                                    <Button
                                      variant="subtle"
                                      color="red"
                                      size="compact-sm"
                                      onClick={() =>
                                        handleUnfollowUser(member.id)
                                      }
                                    >
                                      Unfollow
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="subtle"
                                      size="compact-sm"
                                      onClick={() =>
                                        handleFollowUser(member.id)
                                      }
                                    >
                                      Follow
                                    </Button>
                                  )}
                                </>
                              ) : null}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link
                                href={`/team/${member.id}`}
                                className="theme-link-blue"
                              >
                                View
                                <span className="sr-only">, {member.name}</span>
                              </Link>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingUserQuery.isSuccess &&
      pendingUserQuery.data &&
      pendingUserQuery.data.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Pending invites
          </h3>
          <PendingUsersTable pendingUsers={pendingUserQuery.data} />
        </div>
      ) : null}
    </>
  );
}
