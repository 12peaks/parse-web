"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Badge, Button, Loader, Progress } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { getGoal } from "@/api/goals";
import { GoalUpdateModal } from "@/app/_components/goals/GoalUpdateModal";
import { GoalModal } from "@/app/_components/goals/GoalModal";
import { GoalChart } from "@/app/_components/goals/GoalChart";
import type { GoalUpdate } from "@/types/goal";
import Target from "@/public/dart.png";

export default function GoalPage() {
  const params = useParams<{ id: string }>();
  const [progressValue, setProgressValue] = useState(0);
  const [mostRecentUpdate, setMostRecentUpdate] = useState<GoalUpdate | null>(
    null
  );

  const modals = useModals();

  const { data: goal, isLoading } = useQuery({
    queryKey: ["goal", params.id],
    queryFn: () => getGoal(params.id),
    enabled: !!params.id,
  });

  const openGoalUpdateModal = (update?: GoalUpdate) => {
    if (goal) {
      modals.openModal({
        withCloseButton: false,
        size: "lg",
        children: <GoalUpdateModal goal={goal} update={update} />,
      });
    }
  };

  const openEditModal = () => {
    if (goal) {
      modals.openModal({
        withCloseButton: false,
        size: "xl",
        children: <GoalModal goal={goal} />,
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && goal && goal.goal_updates) {
      setMostRecentUpdate(goal.goal_updates[goal.goal_updates.length - 1]);
      setProgressValue(
        goal.goal_updates.length > 0
          ? goal.goal_updates[goal.goal_updates.length - 1].value
          : 0
      );
    }
    return () => {
      isMounted = false;
    };
  }, [goal, goal?.goal_updates.length]);

  const badgeProps: { [key: string]: { color: string; text: string } } = {
    "on-track": { color: "green", text: "On Track" },
    behind: { color: "yellow", text: "Behind" },
    "at-risk": { color: "red", text: "At Risk" },
    complete: { color: "blue", text: "Complete" },
  };

  if (!goal) {
    return null;
  }

  return (
    <div className="grid grid-cols-6 gap-4 mt-4">
      <div className="flex flex-row justify-between items-center col-span-6">
        <div className="text-xl font-semibold flex flex-row items-center space-x-4">
          <img src={Target.src} className="h-8 w-8" />
          <div className="mt-2">{goal.name}</div>
          {mostRecentUpdate ? (
            <Badge
              className="mt-2.5"
              size="lg"
              color={badgeProps[mostRecentUpdate.status].color}
            >
              {badgeProps[mostRecentUpdate.status].text}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-row space-x-2 items-center ">
          <Button onClick={() => openGoalUpdateModal()}>Add update</Button>
          <Button onClick={() => openEditModal()}>Edit</Button>
        </div>
      </div>
      <div className="chart col-span-4 rounded shadow border theme-border p-4 pb-4">
        <div className="flex flex-row space-x-2 text-sm items-center">
          <div className="font-semibold">Progress</div>
          <Progress
            className="w-1/3"
            value={progressValue}
            color="indigo"
            size="lg"
            radius="lg"
          />
          <div>{progressValue || 0}% complete</div>
        </div>
        {goal.goal_updates && goal.goal_updates.length > 0 ? (
          <GoalChart goal={goal} updates={goal.goal_updates} />
        ) : null}
      </div>
      <div className="info col-span-2 rounded shadow border theme-border p-4 text-sm">
        <div className="mb-4">
          <div className="font-semibold mb-1">Description</div>
          <div className="theme-text-subtle">
            {goal.description ? goal.description : "No description"}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Owner</div>
          <div className="flex flex-row space-x-2 items-center">
            <Avatar size="md" radius="xl" src={goal.user.avatar_image_url} />
            <div className="theme-text-subtle">{goal.user.name}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold mb-1">Collaborators</div>
          {goal.goal_collaborators && goal.goal_collaborators.length > 0 ? (
            <>
              {goal.goal_collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="flex flex-row space-x-2 items-center mb-2"
                >
                  <Avatar
                    size="md"
                    radius="xl"
                    src={collab.user.avatar_image_url}
                  />
                  <div className="theme-text-subtle">{collab.user.name}</div>
                </div>
              ))}
            </>
          ) : null}
        </div>

        <div className="mb-4">
          <div className="font-semibold mb-1">Starting value</div>
          <div className="theme-text-subtle">
            {formatters[goal.format](goal.initial_value.toString())}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold mb-1">Target value</div>
          <div className="theme-text-subtle">
            {formatters[goal.format](goal.target_value.toString())}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold mb-1">Due date</div>
          <div className="theme-text-subtle">
            {new Date(goal.end_date).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="updates col-span-4 px-4 rounded shadow border theme-border">
        <div className="text-lg font-semibold py-4">Updates</div>
        {goal.goal_updates &&
          goal.goal_updates.map((update) => (
            <div
              key={update.id}
              className="py-4 border-y theme-border text-sm grid grid-cols-6 gap-2"
            >
              <div className="flex flex-row space-x-2 items-center col-span-2">
                <Avatar
                  src={update.user.avatar_image_url}
                  size="md"
                  radius="xl"
                />
                <div>
                  <div>{update.user.name}</div>
                  <div className="text-xs theme-text-subtle">
                    {new Date(update.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start col-span-2 font-semibold">
                <div>
                  Value:{" "}
                  <span className="font-normal theme-text-subtle">
                    {formatters[goal.format](update.value.toString())}
                  </span>
                </div>
                {update.note ? (
                  <div>
                    Comment:{" "}
                    <span className="font-normal theme-text-subtle">
                      {update.note}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <Badge
                  className=""
                  size="md"
                  color={badgeProps[update.status].color}
                >
                  {badgeProps[update.status].text}
                </Badge>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  onClick={() => openGoalUpdateModal(update)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

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
