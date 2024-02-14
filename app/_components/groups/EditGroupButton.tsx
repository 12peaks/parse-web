import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Group } from "@/types/group";
import { GroupInfoModal } from "@/app/_components/groups/GroupInfoModal";

type EditGroupButtonProps = {
  group: Group;
};

export const EditGroupButton = ({ group }: EditGroupButtonProps) => {
  const router = useRouter();
  const modals = useModals();

  const handleNewNameNavigation = (newSlug: string) => {
    router.push(`/groups/${newSlug}`);
  };

  const openEditGroupModal = () => {
    modals.openModal({
      title: "Edit group",
      size: "lg",
      children: (
        <GroupInfoModal
          group={group}
          handleNewNameNavigation={handleNewNameNavigation}
        />
      ),
    });
  };

  return (
    <div className="">
      <Button
        variant="light"
        fullWidth
        radius="md"
        onClick={() => openEditGroupModal()}
      >
        Edit group
      </Button>
    </div>
  );
};
