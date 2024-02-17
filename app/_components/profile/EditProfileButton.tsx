import { Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import type { TeamUser } from "@/types/user";
import { EditProfileModal } from "./EditProfileModal";

type EditProfileButtonProps = {
  profile: TeamUser;
};

export const EditProfileButton = ({ profile }: EditProfileButtonProps) => {
  const modals = useModals();

  const openEditGroupModal = () => {
    modals.openModal({
      title: "Update profile",
      size: "lg",
      children: <EditProfileModal profile={profile} />,
    });
  };

  return (
    <div className="">
      <Button variant="light" fullWidth onClick={() => openEditGroupModal()}>
        Edit profile
      </Button>
    </div>
  );
};
