"use client";
import { ActionIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GroupInfoModal } from "./GroupInfoModal";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";

export const CreateGroupButton = () => {
  const modals = useModals();
  const router = useRouter();

  const handleNewNameNavigation = (newName: string) => {
    router.push(`/groups/${newName}`);
  };

  const openNewGroupModal = () => {
    modals.openModal({
      title: "Create a new group",
      size: "lg",
      children: (
        <GroupInfoModal handleNewNameNavigation={handleNewNameNavigation} />
      ),
    });
  };

  return (
    <ActionIcon
      color="gray"
      variant="subtle"
      onClick={() => openNewGroupModal()}
    >
      <IconPlus style={{ width: "70%", height: "70%" }} stroke={2} />
    </ActionIcon>
  );
};
