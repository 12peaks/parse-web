import { Avatar, Progress, Badge, Button } from "@mantine/core";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Goal, GoalUpdate } from "@/types/goal";
import { useModals } from "@mantine/modals";
import { GoalUpdateModal } from "@/app/_components/goals/GoalUpdateModal";
import { useRouter } from "next/navigation";

type GoalsTableProps = {
  goals: Goal[];
  handleGoalCreate: () => void;
};

const columns: ColumnDef<Goal>[] = [
  {
    header: "Goal",
    id: "name",
    accessorKey: "name",
    cell: (props) => <span>{props.row.original.name}</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.user.name,
    header: "Owner",
    id: "owner",
    cell: (props) => <OwnerCell profile={props.row.original?.user} />,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => null,
    header: "Status",
    id: "status",
    cell: (props) => <StatusCell goal={props.row.original} />,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.initial_value,
    header: "Progress",
    id: "initial_value",
    cell: (props) => <ProgressCell goal={props.row.original} />,
    footer: (props) => props.column.id,
  },
  {
    header: "Due",
    id: "end_date",
    accessorKey: "end_date",
    footer: (props) => props.column.id,
    cell: (props) => new Date(props.row.original.end_date).toLocaleDateString(),
  },
  {
    header: "",
    id: "update",
    cell: (props) => <UpdateCell goal={props.row.original} />,
  },
];

export const GoalsTable = ({ goals, handleGoalCreate }: GoalsTableProps) => {
  const router = useRouter();
  const table = useReactTable({
    data: goals ? goals : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleGoalNavigate = (row: any) => {
    router.push(`/goals/${row.original.id}`);
  };

  if (!goals || goals.length === 0) {
    return <div className="mx-auto text-center">No goals</div>;
  }

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold theme-text">Goals</h1>
          <p className="mt-2 text-sm theme-text-subtle">
            Track goals and update progress.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => handleGoalCreate()}>Add goal</Button>
        </div>
      </div>
      <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y theme-divide border theme-border rounded-md">
          <thead className="theme-bg-subtle">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold theme-text sm:pl-6"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y theme-divide">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:theme-bg-subtle hover:cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    onClick={() =>
                      cell.column.id !== "update"
                        ? handleGoalNavigate(row)
                        : null
                    }
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium theme-text sm:pl-6"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const OwnerCell = ({
  profile,
}: {
  profile: { id: string; name: string; avatar_image_url?: string };
}) => {
  return (
    <div className="flex flex-row items-center">
      <Avatar src={profile.avatar_image_url} radius="xl" size="sm" />
      <div className="ml-2 theme-text-subtle">{profile.name}</div>
    </div>
  );
};

export const ProgressCell = ({ goal }: { goal: Goal }) => {
  let progressValue = 0;
  if (goal.goal_updates.length > 0) {
    const sortedUpdates = goal.goal_updates.sort((a: any, b: any) => {
      return new Date(a.created_at) > new Date(b.created_at) ? -1 : 1;
    });

    const latestUpdate = sortedUpdates.length > 0 ? sortedUpdates[0] : null;
    if (latestUpdate) {
      progressValue =
        ((latestUpdate.value - goal.initial_value) /
          (goal.target_value - goal.initial_value)) *
        100;
    }
  }

  return (
    <div className="flex flex-row items-center w-full">
      <Progress
        size="md"
        className="w-full"
        value={progressValue}
        color="indigo"
      />
    </div>
  );
};

export const StatusCell = ({ goal }: { goal: Goal }) => {
  const sortedUpdates = goal.goal_updates.sort(
    (a: GoalUpdate, b: GoalUpdate) => {
      return new Date(a.created_at) > new Date(b.created_at) ? 1 : -1;
    },
  );

  const latestUpdate = sortedUpdates.length > 0 ? sortedUpdates[0] : null;

  const badgeProps: { [key: string]: { color: string; text: string } } = {
    "on-track": { color: "green", text: "On Track" },
    behind: { color: "yellow", text: "Behind" },
    "at-risk": { color: "red", text: "At Risk" },
    complete: { color: "blue", text: "Complete" },
  };

  return (
    <>
      {latestUpdate ? (
        <Badge color={badgeProps[latestUpdate.status].color}>
          {badgeProps[latestUpdate.status].text}
        </Badge>
      ) : (
        <Badge color="gray">No Updates</Badge>
      )}
    </>
  );
};

export const UpdateCell = ({ goal }: { goal: Goal }) => {
  const modals = useModals();
  const openGoalUpdateModal = (update?: GoalUpdate) => {
    if (goal) {
      modals.openModal({
        withCloseButton: false,
        size: "lg",
        children: <GoalUpdateModal goal={goal} update={update} />,
      });
    }
  };
  return (
    <Button
      className="justify-self-end"
      variant="subtle"
      size="compact-sm"
      onClick={() => openGoalUpdateModal()}
    >
      Update
    </Button>
  );
};
