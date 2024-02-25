"use client";
import { useModals } from "@mantine/modals";
import { Button, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getGoals } from "@/api/goals";
import { GoalModal } from "@/app/_components/goals/GoalModal";
import { GoalsEmptyState } from "@/app/_components/goals/GoalsEmptyState";
import { GoalsTable } from "@/app/_components/goals/GoalsTable";

export default function Goals() {
  const modals = useModals();

  const goalsQuery = useQuery({
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

  if (goalsQuery.isLoading) {
    return <Loader size="xl" className="mx-auto mt-24" />;
  }

  return (
    <>
      {goalsQuery.data && goalsQuery.data.length === 0 ? (
        <GoalsEmptyState handleGoalCreate={openNewGoalModal} />
      ) : (
        <div>
          {goalsQuery.data &&
            goalsQuery.isSuccess &&
            goalsQuery.data.length > 0 && (
              <GoalsTable
                goals={goalsQuery.data}
                handleGoalCreate={openNewGoalModal}
              />
            )}
        </div>
      )}
    </>
  );
}
