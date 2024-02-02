"use client";
import { ActionIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/navigation";
import BrowseGroupsModal from "@/app/_components/groups/BrowseGroupsModal";
import { IconSearch } from "@tabler/icons-react";

export const BrowseGroupsButton = () => {
  const modals = useModals();
  const router = useRouter();

  const handleGroupNavigate = (groupUrlName: string) => {
    router.push(`/groups/${groupUrlName}`);
    modals.closeAll();
  };

  const openBrowseGroupsModal = () => {
    modals.openModal({
      title: "Browse groups",
      size: "lg",
      children: <BrowseGroupsModal handleGroupNavigate={handleGroupNavigate} />,
    });
  };

  return (
    <ActionIcon
      color="gray"
      variant="subtle"
      onClick={() => openBrowseGroupsModal()}
    >
      <IconSearch style={{ width: "70%", height: "70%" }} stroke={2} />
    </ActionIcon>
  );
};
