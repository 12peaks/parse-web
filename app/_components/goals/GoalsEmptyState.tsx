import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Dart from "@/public/dart.png";

type EmptyStateProps = {
  handleGoalCreate: () => void;
};

export const GoalsEmptyState = ({ handleGoalCreate }: EmptyStateProps) => {
  return (
    <div className="text-center mt-12">
      <img src={Dart.src} className="mx-auto h-12 w-12" alt="Goal icon" />

      <h3 className="mt-2 text-sm font-medium theme-text">No goals</h3>
      <p className="mt-1 text-sm theme-text-subtle">
        Get started by creating a new goal.
      </p>
      <div className="mt-6">
        <Button
          type="button"
          onClick={() => handleGoalCreate()}
          rightSection={
            <IconPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          }
        >
          New Goal
        </Button>
      </div>
    </div>
  );
};
