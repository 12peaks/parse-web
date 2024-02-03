"use client";
import { getCurrentUser } from "@/api/users";
import { AppShell, Button, Loader } from "@mantine/core";
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

  if (isLoading)
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
      {user && user.id ? (
        <AppShell
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
        >
          <Navigation user={user} unreadNotificationCount={0} />
          <AppShell.Main>
            <div className="p-4">{children}</div>
          </AppShell.Main>
        </AppShell>
      ) : null}
    </>
  );
};
