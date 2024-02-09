import { TextInput, Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { createPoll } from "@/api/polls";
import type { CurrentUser } from "@/types/user";
import type { PollOptionDTO } from "@/types/poll";

type CreatePollModalProps = {
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
  user: CurrentUser;
};

const CreatePollModal = ({
  groupId,
  teamId,
  homeFeed,
  user,
}: CreatePollModalProps) => {
  const [content, setContent] = useState("");
  const [pollOptions, setPollOptions] = useState<PollOptionDTO[]>([]);
  const allowMultiple = false;
  const modals = useModals();
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setPollOptions(
        [...Array(3)].map((_) => {
          return { text: "", poll_id: null };
        })
      );
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const createPollMutation = useMutation({
    mutationFn: createPoll,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts", groupId, teamId, homeFeed],
      });
      modals.closeAll();
      setContent("");
    },
  });

  const handlePollCreation = async () => {
    const optionsWithContent = pollOptions.filter(
      (option) => option.text.length > 0
    );
    if (content.length === 0) {
      showNotification({
        title: "Provide a poll topic",
        message: "Looks like you forgot to provide a poll topic!",
        color: "yellow",
      });
    } else if (optionsWithContent.length < 2) {
      showNotification({
        title: "No poll options",
        message: "Provide at least 2 options to vote on",
        color: "yellow",
      });
    } else {
      createPollMutation.mutate({
        content,
        poll_options: pollOptions.filter((option) => option.text.length > 0),
        allow_multiple: allowMultiple,
        group_id: groupId,
      });
    }
  };

  const handleOptionRemove = (index: number) => {
    setPollOptions([...pollOptions.splice(index, 1)]);
  };

  const handleAddOption = () => {
    setPollOptions([...pollOptions, { text: "", poll_id: null }]);
  };

  const handleOptionChange = (text: string, index: number) => {
    setPollOptions([
      ...pollOptions.slice(0, index),
      Object.assign({}, pollOptions[index], { text: text }),
      ...pollOptions.slice(index + 1),
    ]);
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <TextInput
        label="Poll topic"
        className="col-span-6 mb-2"
        placeholder="What's your poll about?"
        required
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
      />
      {pollOptions.map((option, idx) => (
        <div key={idx} className="items-center col-span-6 flex flex-column">
          <TextInput
            className="w-full ml-8"
            placeholder={`Option ${idx + 1}`}
            value={option.text}
            onChange={(e) => handleOptionChange(e.currentTarget.value, idx)}
          />

          <Button
            className="ml-2"
            variant="light"
            color="red"
            size="sm"
            onClick={() => handleOptionRemove(idx)}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      ))}
      <div className="col-span-6 justify-between mb-2 flex flex-column">
        <Button
          className="ml-8"
          variant="outline"
          size="xs"
          radius="xl"
          leftSection={<IconPlus size={18} />}
          onClick={() => handleAddOption()}
        >
          Add option
        </Button>
        <span></span>
      </div>

      <Button
        className="col-span-3"
        variant="light"
        onClick={() => modals.closeAll()}
      >
        Cancel
      </Button>
      <Button
        className="col-span-3 col-start-4"
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        onClick={() => handlePollCreation()}
      >
        Create poll
      </Button>
    </div>
  );
};

export default CreatePollModal;
