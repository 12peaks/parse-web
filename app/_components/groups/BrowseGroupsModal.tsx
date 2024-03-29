import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, TextInput } from "@mantine/core";
import { getAllGroups, joinGroup, leaveGroup } from "@/api/groups";
import { GroupIcon } from "@/app/_components/groups/GroupIcon";
import { Loader } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

type BrowseGroupsModalProps = {
  handleGroupNavigate: (urlName: string) => void;
};

const BrowseGroupsModal: React.FC<BrowseGroupsModalProps> = ({
  handleGroupNavigate,
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500);

  const {
    data: allGroups,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-groups", debouncedSearchTerm],
    queryFn: () => getAllGroups(debouncedSearchTerm),
  });

  const joinGroupMutation = useMutation({
    mutationFn: joinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-groups"] });
      showNotification({
        title: "Success",
        message: "You have joined the group",
        color: "teal",
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

  const leaveGroupMutation = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-groups"] });
      showNotification({
        title: "Success",
        message: "You have left the group",
        color: "teal",
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

  const handleJoinGroup = async (groupId: string) => {
    joinGroupMutation.mutate(groupId);
  };

  const handleLeaveGroup = async (groupId: string) => {
    leaveGroupMutation.mutate(groupId);
  };

  if (isError && error) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }

  return (
    <>
      <TextInput
        radius="xl"
        className="mb-2 mt-0.5"
        size="sm"
        placeholder="Search groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
      {isSuccess ? (
        <div>
          <div className="flow-root">
            <ul className="list-none divide-y theme-divide">
              {allGroups.map((group) => (
                <li key={group.id} className="py-3">
                  <div className="flex items-center space-x-4">
                    <div
                      className="flex-shrink-0 hover:cursor-pointer"
                      onClick={() => handleGroupNavigate(group.url_slug)}
                    >
                      <GroupIcon size={6} groupImage={group.avatar_url} />
                    </div>
                    <div
                      className="flex-1 min-w-0 hover:cursor-pointer"
                      onClick={() => handleGroupNavigate(group.url_slug)}
                    >
                      <p className="text-sm font-medium theme-text truncate">
                        {group.name}
                      </p>
                      <p className="text-sm theme-text-subtle truncate">
                        {group.description}
                      </p>
                    </div>

                    <div>
                      {group.users && group.users.length > 0 ? (
                        <Button
                          size="xs"
                          radius="xl"
                          onClick={() => handleLeaveGroup(group.id)}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          variant="outline"
                          radius="xl"
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Loader className="mx-auto mt-48" size="lg" />
      )}
    </>
  );
};

export default BrowseGroupsModal;
