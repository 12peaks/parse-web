/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJoinedGroups } from "@/api/groups";
import { Divider, AppShell, ScrollArea } from "@mantine/core";
import { GroupIcon } from "@/app/_components/groups/GroupIcon";
import placeholderAvatar from "@/public/sunglasses.png";
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { CreateGroupButton } from "@/app/_components/groups/CreateGroupButton";
import { BrowseGroupsButton } from "@/app/_components/groups/BrowseGroupsButton";
import type { CurrentUser } from "@/types/user";
import classes from "@/app/_components/Navigation.module.css";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: false, badgeCount: null },
  {
    name: "Notifications",
    href: "/notifications",
    icon: BellIcon,
    current: false,
  },
  {
    name: "Goals",
    href: "/goals",
    icon: ArrowTrendingUpIcon,
    current: false,
    badgeCount: null,
  },
  {
    name: "Triage",
    href: "/triage",
    icon: ExclamationTriangleIcon,
    current: false,
    badgeCount: null,
  },
  {
    name: "Team",
    href: "/team",
    icon: UsersIcon,
    current: false,
    badgeCount: null,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
    current: false,
    badgeCount: null,
  },
];

type NavigationProps = {
  unreadNotificationCount: number;
  user: CurrentUser;
};

export const Navigation = ({
  unreadNotificationCount,
  user,
}: NavigationProps) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const groupQuery = useQuery({
    queryKey: ["groups-joined"],
    queryFn: getJoinedGroups,
  });

  return (
    <AppShell.Navbar p="md">
      <AppShell.Section className={classes.title}>parse</AppShell.Section>
      <AppShell.Section className={classes.navbarMain}>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            data-active={pathname === item.href ? true : undefined}
            className={classes.link}
          >
            <item.icon
              className="mr-3 flex-shrink-0 h-6 w-6"
              aria-hidden="true"
            />
            {item.name}
            {unreadNotificationCount &&
            unreadNotificationCount > 0 &&
            item.name === "Notifications" ? (
              <span className="bg-red-100 text-red-900 hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">
                {unreadNotificationCount}
              </span>
            ) : null}
          </Link>
        ))}
      </AppShell.Section>
      {groupQuery.isSuccess ? (
        <AppShell.Section grow component={ScrollArea}>
          <div className="sticky top-0 ">
            <Divider
              my="xs"
              className={classes.divider}
              label="Groups"
              styles={{ label: { fontSize: "0.75rem" } }}
            />
            <div className="grid grid-cols-2 gap-2 -mt-1 mb-2">
              <CreateGroupButton />
              <BrowseGroupsButton />
            </div>
          </div>
          <div className="">
            {groupQuery.data.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.url_name ? group.url_name : group.name}`}
                className="flex cursor-pointer items-center px-2 py-1 flex-row font-medium hover:bg-gray-50 hover:text-gray-900 text-gray-600 rounded-md"
              >
                <GroupIcon size={null} groupImage={group.group_image} />
                <span className="text-sm">{group.name}</span>
              </Link>
            ))}
          </div>
        </AppShell.Section>
      ) : (
        <div className="flex-grow"></div>
      )}
      {user ? (
        <AppShell.Section className={classes.footer}>
          <Link href={`/team/${user?.id}`} className={classes.link}>
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full bg-white"
                  src={
                    user.github_image
                      ? user.github_image
                      : placeholderAvatar.src
                  }
                  alt="placeholder avatar"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium group-hover:text-gray-900">
                  {user.name ? user.name : user.email}
                </p>
                <p className="text-xs font-medium group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </Link>
        </AppShell.Section>
      ) : null}
    </AppShell.Navbar>
  );
};
