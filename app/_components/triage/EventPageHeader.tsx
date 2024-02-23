import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { TriageEvent } from "@/types/triageEvent";
import fire from "@/public/fire.png";

export const EventPageHeader = ({ event }: { event: TriageEvent }) => {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
      <div className="flex items-center space-x-5">
        <div className="flex-shrink-0">
          <div className="relative">
            <img className="h-12 w-12" src={fire.src} alt="" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold theme-text">{`TEV-${
            10000 + event.event_number
          }`}</h1>
          <p className="text-sm font-medium theme-text-subtle">
            Created{" "}
            <span className="theme-text">
              {new Date(event.created_at).toLocaleString()}
            </span>
            <span className="theme-text-subtle font-medium mx-2">&middot;</span>
            Last updated{" "}
            <span className="theme-text">
              {new Date(event.updated_at).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <Button
          leftSection={
            <IconChevronLeft
              size={18}
              strokeWidth={3}
              className="-ml-2 -mr-1"
            />
          }
          onClick={() => router.push("/triage")}
        >
          Back
        </Button>
      </div>
    </div>
  );
};
