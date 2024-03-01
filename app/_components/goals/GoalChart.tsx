import { LineChart } from "@mantine/charts";
import type { GoalUpdate } from "@/types/goal";

type GoalChartProps = {
  updates: GoalUpdate[];
};

export const GoalChart: React.FC<GoalChartProps> = ({ updates }) => {
  const data = {
    label: "Values",
    data: updates.map((update) => {
      return {
        date: new Date(update.created_at).toLocaleDateString(),
        value: update.value,
      };
    }),
  };

  return (
    <div className="mt-2">
      <LineChart
        h={420}
        data={data.data}
        dataKey="date"
        series={[{ name: "value", color: "blue.6" }]}
        curveType="linear"
      />
    </div>
  );
};
