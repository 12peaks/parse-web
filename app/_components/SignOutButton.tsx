"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mantine/core";
import { signOut } from "@/api/users";

export const SignOutButton = () => {
  const queryClient = useQueryClient();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return (
    <Button onClick={() => signOutMutation.mutateAsync()}>Sign out</Button>
  );
};
