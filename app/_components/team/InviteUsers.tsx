import { useState } from "react";
import axios from "@/libs/axios";
import { useQueryClient } from "@tanstack/react-query";
import { ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";

export const InviteUsers = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const modals = useModals();
  const form = useForm({
    initialValues: {
      teammates: [{ email: "", key: randomId() }],
    },
    validate: {
      teammates: {
        email: (value: string) =>
          /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      },
    },
  });

  const fields = form.values.teammates.map((item, index) => (
    <Group key={item.key} mt="md">
      <TextInput
        placeholder="Enter an email"
        className="flex-grow"
        {...form.getInputProps(`teammates.${index}.email`)}
      />
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => form.removeListItem("teammates", index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ));

  const handleInviteSubmit = async (values: typeof form.values) => {
    setLoading(true);
    showNotification({
      id: "invites",
      loading: true,
      title: "Sending invites",
      message: "Sending your invites to teammates.",
      autoClose: false,
      withCloseButton: false,
    });
    const responses = await Promise.all(
      values.teammates.map((teammate) =>
        axios.post("/users/invitation", {
          user: {
            email: teammate.email,
          },
        })
      )
    );

    if (responses.every((response) => response.status === 200)) {
      setLoading(false);
      updateNotification({
        id: "invites",
        title: "Invites sent",
        message: "Your invites were successfully sent.",
        color: "green",
        icon: <IconCheck />,
        autoClose: 1000,
      });
      queryClient.invalidateQueries({
        queryKey: ["team", ""],
      });
      modals.closeAll();
    } else {
      updateNotification({
        id: "invites",
        title: "Error",
        message: "There was an error sending your invites.",
        color: "red",
        autoClose: 1000,
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleInviteSubmit)}>
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 theme-text-subtle"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h2 className="mt-2 text-lg font-medium">Add team members</h2>
        <p className="mt-1 text-sm theme-text-subtle">
          Your account includes unlimited team members.
        </p>
      </div>
      {fields}
      <div className="flex mt-6">
        <Button
          className="mx-auto"
          variant="outline"
          size="sm"
          leftSection={<IconPlus size={18} />}
          onClick={() =>
            form.insertListItem("teammates", { email: "", key: randomId() })
          }
        >
          Add teammate
        </Button>
      </div>
      <div className="mt-6 flex flex-row justify-between">
        <Button type="submit" fullWidth loading={loading}>
          Send invites
        </Button>
      </div>
    </form>
  );
};
