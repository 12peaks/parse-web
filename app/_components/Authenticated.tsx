"use client";
import { getCurrentUser } from "@/api/users";
import { useQuery } from "@tanstack/react-query";

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  if (isLoading) return <div>Loading...</div>;

  return <>{user ? <>{children}</> : <div>Not authenticated</div>}</>;
};
