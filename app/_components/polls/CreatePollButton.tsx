import { ThemeIcon } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";
import { useModals } from "@mantine/modals";
import CreatePollModal from "@/app/_components/polls/CreatePollModal";

type CreatePollButtonProps = {
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
};

export const CreatePollButton = ({
  groupId,
  teamId,
  homeFeed,
}: CreatePollButtonProps) => {
  const modals = useModals();

  const openNewPollModal = () => {
    modals.openModal({
      title: "Create a poll",
      size: "lg",
      children: (
        <CreatePollModal
          groupId={groupId}
          teamId={teamId}
          homeFeed={homeFeed}
        />
      ),
    });
  };

  return (
    <div
      className="flex flex-row flex-grow justify-center items-center border theme-border rounded-xl py-2 px-6 hover:shadow hover:cursor-pointer"
      onClick={() => openNewPollModal()}
    >
      <ThemeIcon
        size="lg"
        radius="xl"
        variant="gradient"
        gradient={{ from: "cyan", to: "teal", deg: 60 }}
      >
        <IconChartBar size={18} />
      </ThemeIcon>

      <div className="ml-2 text-xs sm:text-sm">Create Poll</div>
    </div>
  );
};
