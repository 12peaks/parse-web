"use client";
import { getCurrentUser } from "@/api/users";
import { getUnreadNotificationCount } from "@/api/notifications";
import { AppShell, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Navigation } from "@/app/_components/navigation/Navigation";
import { useDisclosure } from "@mantine/hooks";

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [opened] = useDisclosure();
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

  if (!isLoading && !user) {
    router.push(process.env.NEXT_PUBLIC_AUTH_URL!);
  }

  return (
    <>
      {user && user.id && unreadCount ? (
        <AppShell
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
        >
          <Navigation user={user} unreadNotificationCount={unreadCount.count} />
          <AppShell.Main>
            <div className="p-8">{children}</div>
          </AppShell.Main>
        </AppShell>
      ) : null}
    </>
  );
};
