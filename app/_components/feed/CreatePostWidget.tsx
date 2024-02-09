/* eslint-disable @next/next/no-img-element */
import { ActionIcon, TextInput, UnstyledButton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useModals } from "@mantine/modals";
import { ComposerModal } from "@/app/_components/feed/ComposerModal";
import { CreatePollButton } from "@/app/_components/polls/CreatePollButton";
import { RecordVideoButton } from "@/app/_components/feed/RecordVideoButton";
import { CurrentUser } from "@/types/user";
import placeholderAvatar from "@/public/sunglasses.png";

type CreatePostWidgetProps = {
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
  user: CurrentUser;
};

const CreatePostWidget = ({
  groupId,
  teamId,
  homeFeed,
  user,
}: CreatePostWidgetProps) => {
  const modals = useModals();

  const openComposerModal = () => {
    modals.openModal({
      title: "Create new post",
      size: "xl",
      children: (
        <ComposerModal
          groupId={groupId}
          teamId={teamId}
          user={user}
          homeFeed={homeFeed}
        />
      ),
    });
  };

  return (
    <>
      <div className="mx-auto rounded shadow border theme-border px-4 pt-4 pb-4 items-center">
        <div className="flex flex-row items-center">
          <img
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full self-start"
            src={user.github_image ? user.github_image : placeholderAvatar.src}
            alt="avatar"
          />
          <div className="w-full !cursor-default">
            <div
              className="relative flex w-full items-center"
              onClick={() => openComposerModal()}
            >
              <TextInput
                className="grow ml-4"
                classNames={{
                  input: "!border !theme-border placeholder:!theme-text",
                }}
                placeholder="Share a new post..."
                radius="xl"
                variant="filled"
                disabled
                size="md"
              />
              <div
                style={{ zIndex: 100 }}
                className="absolute inset-0 flex flex-row items-center mr-2 z-50 !cursor-pointer"
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full justify-center">
          <div className="flex flex-row grow space-x-4 items-center sm:ml-16 mt-2 justify-evenly">
            <CreatePollButton
              groupId={groupId}
              teamId={teamId}
              homeFeed={homeFeed}
              user={user}
            />

            <RecordVideoButton
              groupId={groupId}
              teamId={teamId}
              homeFeed={homeFeed}
              user={user}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePostWidget;
