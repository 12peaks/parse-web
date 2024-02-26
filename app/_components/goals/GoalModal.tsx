import { useEffect, useState, forwardRef } from "react";
import {
  Button,
  MultiSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Group,
  Avatar,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IconCalendar } from "@tabler/icons-react";
import { getTeamUsers } from "@/api/teams";
import { createGoal, updateGoal } from "@/api/goals";
import type { Goal } from "@/types/goal";
import { showNotification } from "@mantine/notifications";
//import { createGoalCollaborators } from "../api/createGoalCollaborators";
//import { Goal, GoalCollaborator } from "@/types/goal";

type GoalModalProps = {
  goal?: Goal;
};

type GoalCollaborator = {
  image: string;
  label: string;
  value: string;
  description: string;
};

export const GoalModal = ({ goal }: GoalModalProps) => {
  const [userList, setUserList] = useState<GoalCollaborator[]>([]);

  const modals = useModals();
  const queryClient = useQueryClient();

  const teamQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamUsers(),
  });

  const createGoalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: (data) => {
      showNotification({
        title: "Goal created",
        message: "Goal has been created successfully",
        color: "teal",
      });
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      modals.closeAll();
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: updateGoal,
    onSuccess: (data) => {
      showNotification({
        title: "Goal updated",
        message: "Goal has been updated successfully",
        color: "teal",
      });
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      modals.closeAll();
    },
  });

  const form = useForm({
    initialValues: {
      name: goal ? goal.name : "",
      owner: goal ? goal.user.id : "",
      collaborators: [],
      format: goal ? goal.format : "number",
      description: goal?.description ? goal.description : "",
      startDate: goal ? new Date(goal.start_date) : "",
      endDate: goal ? new Date(goal.end_date) : "",
      initialValue: goal ? goal.initial_value : 0,
      targetValue: goal ? goal.target_value : 0,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (goal) {
      updateGoalMutation.mutate({
        goal: {
          id: goal.id,
          name: values.name,
          format: values.format,
          description: values.description,
          start_date: new Date(values.startDate),
          end_date: new Date(values.endDate),
          initial_value: values.initialValue,
          target_value: values.targetValue,
        },
      });
    } else {
      createGoalMutation.mutate({
        goal: {
          name: values.name,
          description: values.description,
          format: values.format,
          start_date: new Date(values.startDate),
          end_date: new Date(values.endDate),
          initial_value: values.initialValue,
          target_value: values.targetValue,
        },
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && teamQuery.data) {
      let list = teamQuery.data.map((profile) => {
        return {
          image: profile.avatar_image_url ?? "",
          label: profile.name ?? "",
          value: profile.id,
          description: profile.email,
        };
      });
      setUserList(list);
    }

    return () => {
      isMounted = false;
    };
  }, [teamQuery.data]);

  return (
    <div className="grid grid-cols-6 gap-4 pl-1 mr-2">
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="col-span-6 grid grid-cols-6 gap-4 space-y-4 mr-2"
      >
        <TextInput
          className="col-span-6"
          placeholder="Name"
          label="Name"
          {...form.getInputProps("name")}
        />
        <Textarea
          minRows={2}
          className="col-span-6"
          placeholder="Goal description..."
          label="Description"
          {...form.getInputProps("description")}
        />
        <Select
          className="col-span-3"
          placeholder="Owner"
          label="Owner"
          data={userList}
          searchable
          nothingFoundMessage="No matches"
          {...form.getInputProps("owner")}
        />
        <MultiSelect
          className="col-span-3"
          placeholder="Collaborators"
          label="Collaborators"
          searchable
          data={userList}
          nothingFoundMessage="No matches"
          maxDropdownHeight={400}
          {...form.getInputProps("collaborators")}
        />
        <DatePickerInput
          className="col-span-3"
          label="Start date"
          placeholder="Start date"
          firstDayOfWeek={0}
          leftSection={<IconCalendar size={16} />}
          {...form.getInputProps("startDate")}
        />
        <DatePickerInput
          className="col-span-3"
          label="End date"
          placeholder="End date"
          firstDayOfWeek={0}
          leftSection={<IconCalendar size={16} />}
          {...form.getInputProps("endDate")}
        />
        <Select
          className="col-span-2"
          placeholder="Format"
          label="Format"
          data={formatOptions}
          {...form.getInputProps("format")}
        />
        <NumberInput
          className="col-span-2"
          placeholder="Intial value"
          label="Initial value"
          prefix={form.values.format === "money" ? "$" : undefined}
          suffix={form.values.format === "percentage" ? "%" : undefined}
          decimalScale={form.values.format === "money" ? 2 : 0}
          thousandSeparator=","
          {...form.getInputProps("initialValue")}
        />
        <NumberInput
          className="col-span-2"
          placeholder="Target value"
          label="Target value"
          prefix={form.values.format === "money" ? "$" : undefined}
          suffix={form.values.format === "percentage" ? "%" : undefined}
          decimalScale={form.values.format === "money" ? 2 : 0}
          thousandSeparator=","
          {...form.getInputProps("targetValue")}
        />
        <Button
          className="mt-4 col-span-3"
          variant="light"
          onClick={() => modals.closeAll()}
          fullWidth
        >
          Cancel
        </Button>
        <Button className="mt-4 col-span-3" type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  );
};

const formatOptions = [
  { label: "Number (#)", value: "number" },
  { label: "Percentage (%)", value: "percentage" },
  { label: "Money ($)", value: "money" },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group>
        <Avatar radius="xl" src={image} />

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);
