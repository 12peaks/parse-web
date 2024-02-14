import type { Group as GroupType } from "@/types/group";
import { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Group,
  Text,
  Checkbox,
  Button,
  TransferList,
  TransferListData,
  TransferListItem,
  TransferListItemComponent,
  TransferListItemComponentProps,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamUsers } from "@/api/teams";
import { useModals } from "@mantine/modals";

type AddTeammatesModalProps = {
  group: GroupType;
};

export const AddTeammatesModal: React.FC<AddTeammatesModalProps> = ({
  group,
}) => {
  const [userTransferList, setUserTransferList] = useState<TransferListData>([
    [],
    [],
  ]);
  const modals = useModals();
  const queryClient = useQueryClient();

  const teamQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamUsers(),
  });

  const buildUserList = (profiles: any): TransferListData => {
    const list = profiles
      .filter((profile: any) => !isExistingMember(profile.id))
      .map((profile: any) => {
        return {
          image: profile.avatar_url,
          label: profile.real_name,
          value: profile.id.toString(),
          description: profile.email,
        };
      });
    return [
      list,
      group.group_users.map((profile) => {
        return {
          image: profile.avatar_url ?? "",
          label: profile.name ?? "",
          value: profile.id,
          description: profile.email,
        };
      }),
    ];
  };

  const isExistingMember = (profileId: number): boolean => {
    for (const existingProfile of existingMembers) {
      if (existingProfile.id === profileId) {
        return true;
      }
    }
    return false;
  };

  const isInUpdatedList = (
    profileId: number,
    updatedList: TransferListItem[]
  ): boolean => {
    for (const updatedProfileId of updatedList) {
      if (profileId === parseInt(updatedProfileId.value)) {
        return true;
      }
    }
    return false;
  };

  const removeGroupMembers = async () => {
    const newMembersProfileIds = userTransferList[1];
    const membersToRemove = [];
    for (const existingProfile of existingMembers) {
      if (!isInUpdatedList(existingProfile.id, newMembersProfileIds)) {
        membersToRemove.push({
          slack_profile_id: existingProfile.id,
          user_id: existingProfile.user_id,
          group_id: group.id,
        });
      }
    }
    if (membersToRemove.length > 0) {
      for (const member of membersToRemove) {
        await supabase.from("group_members").delete().match({
          group_id: member.group_id,
          slack_profile_id: member.slack_profile_id,
        });
      }
      queryClient.invalidateQueries(["member-count", group.url_name]);
      modals.closeAll();
    }
  };

  const addNewGroupMembers = async () => {
    const newMembersProfileIds = userTransferList[1];
    if (newMembersProfileIds.length > 0 && teamQuery.data) {
      let membersToAdd: any[] = [];
      for (const profileId of newMembersProfileIds) {
        if (!isExistingMember(parseInt(profileId.value))) {
          membersToAdd.push({
            group_id: group.id,
            user_id:
              teamQuery.data.find(
                (profile) =>
                  profile.id.toString() === profileId.value.toString()
              )?.user_id || null,
            slack_profile_id: parseInt(profileId.value),
          });
        }
      }
      const { data, error } = await supabase
        .from("group_members")
        .insert(membersToAdd);
      if (error) {
        console.warn(error.message);
      }
      if (data) {
        queryClient.invalidateQueries(["member-count", group.url_name]);
        modals.closeAll();
      }
    }
  };

  const handleMemberUpdate = async () => {
    const updateResults = Promise.all([
      addNewGroupMembers(),
      removeGroupMembers(),
    ]).then(() => queryClient.invalidateQueries("groups-joined"));
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && teamQuery.data) {
      setUserTransferList(buildUserList(teamQuery.data));
    }

    return () => {
      isMounted = false;
    };
  }, [teamQuery.data]);

  return (
    <div className="space-y-4">
      <TransferList
        value={userTransferList}
        onChange={setUserTransferList}
        classNames={{
          transferListTitle: "!text-gray-700 !text-sm",
        }}
        searchPlaceholder="Search teammates..."
        nothingFound="No one here"
        titles={[`Teammates not in #${group.name}`, "Members"]}
        listHeight={300}
        breakpoint="sm"
        itemComponent={ItemComponent}
        filter={(query, item) =>
          item.label.toLowerCase().includes(query.toLowerCase().trim()) ||
          item.description.toLowerCase().includes(query.toLowerCase().trim())
        }
      />
      <div className="flex flex-row justify-end space-x-2">
        <Button
          variant="light"
          color="gray"
          fullWidth
          onClick={() => modals.closeAll()}
        >
          Cancel
        </Button>
        <Button fullWidth onClick={() => handleMemberUpdate()}>
          Save
        </Button>
      </div>
    </div>
  );
};

const ItemComponent: TransferListItemComponent = ({
  data,
  selected,
}: TransferListItemComponentProps) => (
  <Group noWrap>
    <Avatar src={data.image} radius="xl" size="md" />
    <div style={{ flex: 1 }}>
      <Text size="sm" weight={500}>
        {data.label}
      </Text>
      <Text size="xs" color="dimmed" weight={400}>
        {data.description}
      </Text>
    </div>
    <Checkbox
      checked={selected}
      onChange={() => {}}
      tabIndex={-1}
      sx={{ pointerEvents: "none" }}
    />
  </Group>
);
