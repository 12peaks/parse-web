"use client";
import { getCurrentUser } from "@/api/users";
import { getUnreadNotificationCount } from "@/api/notifications";
import { AppShell, Burger, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Navigation } from "@/app/_components/navigation/Navigation";
import { useDisclosure } from "@mantine/hooks";

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { data: unreadCount, isLoading: unreadCountLoading } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 60000,
  });

  if (isLoading || unreadCountLoading)
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Loader type="dots" size={48} color="blue" />
      </div>
    );

  if (!isLoading && !unreadCountLoading && !user) {
    router.push(process.env.NEXT_PUBLIC_AUTH_URL!);
  }

  return (
    <>
      {user && user.id && unreadCount ? (
        <AppShell
          navbar={{
            width: { base: 200, md: 300 },
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
        >
          <AppShell.Header
            className="flex flex-row justify-between items-center px-4 py-2"
            hiddenFrom="sm"
          >
            <div className="font-montserrat font-medium theme-text text-2xl">
              parse
            </div>
            <Burger opened={opened} onClick={toggle} size="sm" />
          </AppShell.Header>
          <AppShell.Navbar>
            <Navigation
              user={user}
              unreadNotificationCount={unreadCount.count}
              mobileOpen={opened}
              toggleNav={toggle}
            />
          </AppShell.Navbar>
          <AppShell.Main>
            <div className="p-4 sm:p-8 mt-12 sm:mt-0">{children}</div>
          </AppShell.Main>
        </AppShell>
      ) : null}
    </>
  );
};
