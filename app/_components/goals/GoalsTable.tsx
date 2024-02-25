import type { Goal } from "@/types/goal";
type GoalsTableProps = {
  goals: Goal[];
  handleGoalCreate: () => void;
};

export const GoalsTable = ({ goals, handleGoalCreate }: GoalsTableProps) => {
  return <div>GoalsTable</div>;
};
