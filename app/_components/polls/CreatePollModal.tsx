import { TextInput, Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { createPoll } from "@/api/polls";
import { randomId } from "@mantine/hooks";

type CreatePollModalProps = {
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
};

const CreatePollModal = ({
  groupId,
  teamId,
  homeFeed,
}: CreatePollModalProps) => {
  const modals = useModals();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      content: "",
      pollOptions: [
        { text: "", key: randomId() },
        { text: "", key: randomId() },
        { text: "", key: randomId() },
      ],
    },
    validate: {
      content: (value: string) =>
        value.length > 0 ? null : "Poll topic cannot be empty",
      pollOptions: {
        text: (value: string) =>
          value.length > 0 ? null : "Option cannot be empty",
      },
    },
  });

  const createPollMutation = useMutation({
    mutationFn: createPoll,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts", groupId, teamId, homeFeed],
      });
      modals.closeAll();
      form.reset();
    },
  });

  const handlePollCreation = async (values: typeof form.values) => {
    const optionsWithContent = values.pollOptions.filter(
      (option) => option.text.length > 0
    );
    if (values.content.length === 0) {
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
        content: values.content,
        poll_options_attributes: values.pollOptions
          .filter((option) => option.text.length > 0)
          .map((option) => ({ text: option.text })),
        group_id: groupId,
      });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handlePollCreation)}
      className="grid grid-cols-6 gap-4"
    >
      <TextInput
        label="Poll topic"
        className="col-span-6 mb-2"
        placeholder="What's your poll about?"
        required
        {...form.getInputProps("content")}
      />
      {form.values.pollOptions.map((option, idx) => (
        <div
          key={option.key}
          className="items-center col-span-6 flex flex-column"
        >
          <TextInput
            className="w-full ml-8"
            placeholder={`Option ${idx + 1}`}
            {...form.getInputProps(`pollOptions.${idx}.text`)}
          />

          <Button
            className="ml-2"
            variant="light"
            color="red"
            size="sm"
            onClick={() => form.removeListItem("pollOptions", idx)}
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
          onClick={() =>
            form.insertListItem("pollOptions", { text: "", key: randomId() })
          }
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
        type="submit"
        gradient={{ from: "indigo", to: "cyan" }}
      >
        Create poll
      </Button>
    </form>
  );
};

export default CreatePollModal;
