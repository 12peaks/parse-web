import { useForm } from "@mantine/form";
import { Button, Chip, Slider, Textarea } from "@mantine/core";
import Target from "@/public/dart.png";
import { useModals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGoalUpdate, updateGoalUpdate } from "@/api/goals";
import { Goal, GoalUpdate } from "@/types/goal";

type GoalUpdateModalProps = {
  goal: Goal;
  update?: GoalUpdate;
};

export const GoalUpdateModal = ({ goal, update }: GoalUpdateModalProps) => {
  const modals = useModals();
  const queryClient = useQueryClient();

  const getInitialValue = () => {
    if (update) {
      return update.value;
    } else if (goal && goal.goal_updates && goal.goal_updates.length > 0) {
      return goal.goal_updates[0].value;
    } else {
      return goal.initial_value;
    }
  };

  const getInitialStatus = () => {
    if (update) {
      return update.status;
    } else if (goal && goal.goal_updates && goal.goal_updates.length > 0) {
      return goal.goal_updates[0].status;
    } else {
      return "";
    }
  };

  const form = useForm({
    initialValues: {
      value: getInitialValue(),
      note: update ? update.note : "",
      status: getInitialStatus(),
    },
    validate: {
      value: (val) =>
        val >= goal.initial_value && val <= goal.target_value
          ? null
          : "Invalid value",
      status: (val) => (val ? null : "Status is required"),
    },
  });

  const createUpdateMutation = useMutation({
    mutationFn: createGoalUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      queryClient.invalidateQueries({
        queryKey: ["goal", goal.id],
      });

      modals.closeAll();
    },
  });

  const editUpdateMutation = useMutation({
    mutationFn: updateGoalUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      queryClient.invalidateQueries({
        queryKey: ["goal", goal.id],
      });
      modals.closeAll();
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (update) {
      editUpdateMutation.mutate({
        id: update.id,
        note: values.note,
        value: values.value,
        status: values.status,
      });
    } else {
      createUpdateMutation.mutate({
        goal_id: goal.id,
        note: values.note,
        value: values.value,
        status: values.status,
      });
    }
  };

  const getValueColor = () => {
    switch (form.values.status) {
      case "on-track":
        return "green";
      case "behind":
        return "yellow";
      case "at-risk":
        return "red";
      default:
        return "";
    }
  };

  const formatGoalNumber = (value: number) => {
    switch (goal.format) {
      case "number":
        return value ?? "";

      case "percentage":
        return !Number.isNaN(value!)
          ? `% ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "% ";

      case "money":
        return !Number.isNaN(value!)
          ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "$ ";

      default:
        return value ?? "";
    }
  };

  return (
    <div className="ml-2 mr-4">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="space-y-6">
          <div className="flex flex-row items-center justify-center">
            <img src={Target.src} className="h-8 w-8 mr-2" />
            <div className="font-semibold mt-2 text-lg">{goal.name}</div>
          </div>
          <div className="">
            <div className="font-semibold text-sm mb-2">Status:</div>
            <Chip.Group {...form.getInputProps("status")}>
              <div className="flex flex-row items-center justify-start space-x-4">
                <Chip color="green" value="on-track">
                  On Track
                </Chip>
                <Chip color="yellow" value="behind">
                  Behind
                </Chip>
                <Chip color="red" value="at-risk">
                  At Risk
                </Chip>
                <Chip color="blue" value="complete">
                  Complete
                </Chip>
              </div>
            </Chip.Group>
          </div>
          <div className="mt-12">
            <div className="font-semibold text-sm mb-8">Value:</div>
            <Slider
              min={goal.initial_value}
              max={goal.target_value}
              color="indigo"
              label={(val) => formatters[goal.format](val.toString())}
              labelAlwaysOn
              {...form.getInputProps("value")}
            />
            <div className="flex flex-row justify-between">
              <span>{formatGoalNumber(goal.initial_value)}</span>
              <span>{formatGoalNumber(goal.target_value)}</span>
            </div>
          </div>
          <Textarea
            label="Comment"
            placeholder="Add a comment..."
            minRows={2}
            {...form.getInputProps("note")}
          />
          <div className="flex flex-row space-x-2">
            <Button variant="light" fullWidth onClick={() => modals.closeAll()}>
              Cancel
            </Button>
            <Button type="submit" fullWidth>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

type Formatters = {
  [key: string]: (val: string | undefined) => string;
};

const formatters: Formatters = {
  number: function (value: string | undefined) {
    return value ?? "";
  },
  percentage: function (value: string | undefined) {
    return !Number.isNaN(parseFloat(value!))
      ? `${value} %`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "% ";
  },
  money: function (value: string | undefined) {
    return !Number.isNaN(parseFloat(value!))
      ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "$ ";
  },
};
