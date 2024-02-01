"use client";
import { Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/navigation";
import BrowseGroupsModal from "@/app/_components/groups/BrowseGroupsModal";

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
    <div className="col-span-1">
      <Button
        variant="default"
        radius="md"
        fullWidth
        size="xs"
        color="gray"
        onClick={() => openBrowseGroupsModal()}
      >
        Browse all
      </Button>
    </div>
  );
};
