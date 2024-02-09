import { useState } from "react";
import { ThemeIcon } from "@mantine/core";
import { IconVideo } from "@tabler/icons-react";
import { VideoPortal } from "./VideoPortal";
import { CurrentUser } from "@/types/user";

type RecordVideoButtonProps = {
  groupId: string | null;
  teamId: string;
  user: CurrentUser;
  homeFeed: boolean;
};

export const RecordVideoButton: React.FC<RecordVideoButtonProps> = ({
  groupId,
  teamId,
  homeFeed,
  user,
}) => {
  const [portalActive, setPortalActive] = useState(false);

  const handleLoomStart = () => {
    setPortalActive(true);
  };

  const endPortal = () => {
    setPortalActive(false);
  };

  return (
    <div
      className="flex flex-row flex-grow justify-center items-center border theme-border rounded-xl py-2 px-6 hover:shadow hover:cursor-pointer"
      onClick={() => handleLoomStart()}
    >
      <ThemeIcon
        radius="xl"
        variant="gradient"
        size="lg"
        gradient={{ from: "indigo", to: "cyan" }}
      >
        <IconVideo size={20} />
      </ThemeIcon>
      <div className="ml-2 text-xs sm:text-sm">Record Video</div>
      <VideoPortal
        groupId={groupId}
        teamId={teamId}
        homeFeed={homeFeed}
        user={user}
        isActive={portalActive}
        endPortal={endPortal}
      />
    </div>
  );
};
