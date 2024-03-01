"use client";
import { useModals } from "@mantine/modals";
import { Loader } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { getGoals } from "@/api/goals";
import { GoalModal } from "@/app/_components/goals/GoalModal";
import { GoalsEmptyState } from "@/app/_components/goals/GoalsEmptyState";
import { GoalsTable } from "@/app/_components/goals/GoalsTable";

export default function Goals() {
  const modals = useModals();

  const {
    data: goals,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: () => getGoals(),
  });

  const openNewGoalModal = () => {
    modals.openModal({
      title: "Create new goal",
      size: "xl",
      children: <GoalModal />,
    });
  };

  if (isError) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }

  if (isLoading) {
    return <Loader size="xl" className="mx-auto mt-24" />;
  }

  return (
    <>
      {goals && goals.length === 0 ? (
        <GoalsEmptyState handleGoalCreate={openNewGoalModal} />
      ) : (
        <div>
          {goals && goals.length > 0 && (
            <GoalsTable goals={goals} handleGoalCreate={openNewGoalModal} />
          )}
        </div>
      )}
    </>
  );
}
