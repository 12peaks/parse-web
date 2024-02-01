"use client";
import { Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GroupInfoModal } from "./GroupInfoModal";
import { useRouter } from "next/navigation";

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
    <div className="pl-2 col-span-1">
      <Button
        variant="default"
        radius="md"
        fullWidth
        size="xs"
        color="gray"
        classNames={{ root: "rounded-md", section: "mr-2 -ml-1" }}
        onClick={() => openNewGroupModal()}
      >
        Add group
      </Button>
    </div>
  );
};
