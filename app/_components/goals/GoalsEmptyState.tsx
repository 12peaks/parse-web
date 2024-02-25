import { Button } from "@mantine/core";

type GoalsEmptyStateProps = {
  handleGoalCreate: () => void;
};

export const GoalsEmptyState = ({ handleGoalCreate }: GoalsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-gray-700 mb-4">
        You don't have any goals yet
      </h1>
      <p className="text-gray-500 mb-6">Create a new goal to get started</p>
      <Button onClick={handleGoalCreate}>Create new goal</Button>
    </div>
  );
};
