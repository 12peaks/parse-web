import type { Group as GroupType } from "@/types/group";
import { forwardRef, useEffect, useState } from "react";
import { Avatar, Group, Text, Checkbox, Button } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamUsers } from "@/api/teams";
import { useModals } from "@mantine/modals";
import { addToGroup, removeFromGroup } from "@/api/groups";
import { showNotification } from "@mantine/notifications";

type AddTeammatesModalProps = {
  group: GroupType;
};

export const AddTeammatesModal: React.FC<AddTeammatesModalProps> = ({
  group,
}) => {
  const modals = useModals();
  const queryClient = useQueryClient();

  const {
    data: teamMembers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamUsers(),
  });

  const addToGroupMutation = useMutation({
    mutationFn: addToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", group.url_slug] });
      showNotification({
        title: "Success",
        message: "User added to group",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const removeFromGroupMutation = useMutation({
    mutationFn: removeFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", group.url_slug] });
      showNotification({
        title: "Success",
        message: "User removed from group",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const isExistingMember = (user_id: string): boolean => {
    for (const existingMember of group.users) {
      if (existingMember.id === user_id) {
        return true;
      }
    }
    return false;
  };

  const handleAddToGroup = (group_id: string, user_id: string) => {
    addToGroupMutation.mutate({ group_id, user_id });
    if (teamMembers) {
      const newGroupMember = teamMembers.find((user) => user.id === user_id);
      if (!newGroupMember) return;
      group.users.push({
        id: newGroupMember.id,
        name: newGroupMember.name ?? "",
        email: newGroupMember.email,
        avatar_url: newGroupMember.avatar_image_url,
        created_at: newGroupMember.created_at,
        updated_at: newGroupMember.updated_at,
      });
    }
  };

  const handleRemoveFromGroup = (group_id: string, user_id: string) => {
    removeFromGroupMutation.mutate({ group_id, user_id });
    group.users = group.users.filter((user) => user.id !== user_id);
  };

  if (isLoading) {
    return null;
  }

  if (isError && error) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        {teamMembers &&
          teamMembers.map((user) => (
            <div key={user.id} className="w-full flex items-center space-x-4">
              <div className="flex-shrink-0 hover:cursor-pointer">
                <Avatar
                  className="bg-white border theme-border"
                  size={36}
                  src={user.avatar_image_url}
                />
              </div>
              <div className="flex-1 flex-grow min-w-0 hover:cursor-pointer">
                <p className="text-sm font-medium theme-text truncate">
                  {user.name}
                </p>
                <p className="text-sm theme-text-subtle truncate">
                  {user.email}
                </p>
              </div>

              <div>
                {isExistingMember(user.id) ? (
                  <Button
                    size="xs"
                    radius="xl"
                    onClick={() => handleRemoveFromGroup(group.id, user.id)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    variant="outline"
                    radius="xl"
                    onClick={() => handleAddToGroup(group.id, user.id)}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
